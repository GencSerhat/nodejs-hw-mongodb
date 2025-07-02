import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../db/models/Users.js';

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createError(401, 'Access token expired');
      }
      throw createError(401, 'Invalid token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user; // Doğrulanan kullanıcıyı req içine ekle
    next();

  } catch (error) {
    next(error);
  }
};

export default authenticate;
