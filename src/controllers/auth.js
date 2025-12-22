import { registerUser } from '../services/auth.js';
import createError from 'http-errors';
import { loginUser } from '../services/auth.js';
import { refreshSession } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Gerekli alan kontrolü 
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 400,
        message: 'Missing required fields',
      });
    }

    const newUser = await registerUser({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};


export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, 'Missing required fields');
    }

    const { accessToken, refreshToken } = await loginUser(email, password);

   
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    });

    //  Access tokeni JSON içinde gönderdik
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });

  } catch (error) {
    next(error);
  }
};

export const refreshSessionController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createError(401, 'Refresh token not provided');
    }

    const accessToken = await refreshSession(refreshToken);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};


export const logoutController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(204).send(); 
    }

    await logoutUser(refreshToken);

    // Tarayıcıdaki çerezi temizlemek için
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};