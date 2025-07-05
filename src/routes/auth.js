import express from 'express';
import { registerController, loginController } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from '../schemas/userSchemas.js';
import {
  refreshSessionController,
  logoutController,
} from '../controllers/auth.js';
import {
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
const router = express.Router();
router.post('/refresh', refreshSessionController);

// Yeni kullanıcı kaydı
router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/logout', logoutController);
router.post('/send-reset-email', sendResetEmailController);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPasswordController
);
export default router;
