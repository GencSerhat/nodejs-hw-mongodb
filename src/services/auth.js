import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../db/models/Users.js';
import Session from '../db/models/Session.js';
import '../config/env.js'; // deneme configler
dotenv.config();

// Ortam değişkenleri
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Token süreleri
const ACCESS_TOKEN_EXPIRES_IN = '15m';   // JWT bu formatı destekler
const REFRESH_TOKEN_EXPIRES_IN = '30d';  // JWT bu formatı destekler

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError(401, 'Invalid email or password');
  }

  await Session.deleteOne({ userId: user._id });

  const payload = { id: user._id };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  const now = new Date();
  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now.getTime() + 15 * 60 * 1000), // 15 dk
    refreshTokenValidUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 gün
  });

  await session.save();

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const user = await User.findById(payload.id);
    if (!user) {
      throw createError(401, 'User not found');
    }

    await Session.deleteOne({ userId: user._id });

    const newAccessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const newRefreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    const now = new Date();
    const session = new Session({
      userId: user._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(now.getTime() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    });

    await session.save();

    return newAccessToken;
  } catch (error) {
    throw createError(401, 'Invalid refresh token');
  }
};
export const logoutUser = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Oturumu sil
    await Session.deleteOne({ userId: payload.id });
  } catch (error) {
    // Token geçersizse bile  oturumu silmeye çalışıyoruz
    console.error('Logout error:', error.message);
  }
};