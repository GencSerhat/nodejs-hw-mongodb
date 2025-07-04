import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../db/models/Users.js';
import '../config/env.js'; // deneme configler
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
console.log('JWT_SECRET:', JWT_SECRET); // test için ekledim
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded ID from token:', decoded.id); // tets için ekledim
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createError(401, 'Access token expired');
      }
      throw createError(401, 'Invalid token');
    }

    const user = await User.findById(decoded.id); 
    console.log('User from DB:', user); // test için eklediö
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
