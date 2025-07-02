import express from 'express';
import { registerController,loginController } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/userSchemas.js';
import { refreshSessionController, logoutController } from '../controllers/auth.js';
const router = express.Router();
router.post('/refresh', refreshSessionController);

// Yeni kullanıcı kaydı
router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/logout', logoutController);
export default router;
