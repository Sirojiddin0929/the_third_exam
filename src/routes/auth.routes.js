import {Router} from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authGuard } from '../middlewares/authGuard.js';
import { roleGuard } from '../middlewares/roleGuard.js';
import { signupSchema, signinSchema, verifyOtpSchema } from '../validations/auth.validation.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/signup', validate(signupSchema), AuthController.signup);
router.post('/verify-otp', validate(verifyOtpSchema), AuthController.verifyOtp);
router.post('/signin', validate(signinSchema), AuthController.signin);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/me', authGuard, AuthController.getMe);
router.get('/logout', authGuard, AuthController.logout);
router.get('/admin-only', authGuard, roleGuard('admin'), (req, res) => {
  res.json({ message: 'Hello Admin!' });
});

export {router as authRouter};
