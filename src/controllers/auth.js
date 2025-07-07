import { registerUser } from '../services/auth.js';
import createError from 'http-errors';
import { loginUser } from '../services/auth.js';
import { refreshSession } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import User from '../db/models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../helpers/sendEmail.js';

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

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 📌 Email kontrolü
    if (!email) {
      throw createError(400, 'Email is required');
    }

    // 📌 Kullanıcı var mı kontrol et
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    // 📌 Token üret (email bilgisiyle)
    const payload = { email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    // 📌 Reset linki hazırla
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
    console.log('🔗 Reset Link:', resetLink);

    // 📩 Email gönder
    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      html: `
        <h2>Şifre Sıfırlama</h2>
        <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Bu bağlantı 5 dakika içinde geçerliliğini yitirecektir.</p>
      `,
    });

    // ✅ Başarılı yanıt
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    // ❌ E-posta gönderilemedi ise
    if (error.response) {
      return next(
        createError(500, 'Failed to send the email, please try again later.')
      );
    }

    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Token'ı doğrula
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return next(createError(401, 'Token is expired or invalid.'));
    }
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return next(createError(404, 'User not found!'));
    }
    // Şifreyi güncelle
    user.password = await bcrypt.hash(password, 10);
    user.token = null;
    await user.save();

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// export const sendResetEmailController = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     //  Email kontrolü
//     if (!email) {
//       return res.status(400).json({
//         status: 400,
//         message: 'Email is required',
//       });
//     }
// const user = await User.findOne({ email });

// if (!user) {
//   return next(createError(404, 'User not found!'));
// }
// const payload = { email: user.email };

// const token = jwt.sign(payload, process.env.JWT_SECRET, {
//   expiresIn: '5m', // 5 dakika
// });
// const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
// console.log(resetLink); // test için yazdım

//     res.status(200).json({
//       status: 200,
//       message: 'Reset password email has been successfully sent.',
//       data: {},
//     });
//   } catch (error) {
//     next(error);
//   }
// };
