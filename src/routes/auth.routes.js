import {Router} from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authGuard } from '../middlewares/authGuard.js';
import { signupSchema, signinSchema, verifyOtpSchema,changePasswordSchema,forgotPasswordSchema,resetPasswordSchema } from '../validations/auth.validation.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/signup', validate(signupSchema), AuthController.signup);
router.post('/verify-otp', validate(verifyOtpSchema), AuthController.verifyOtp);
router.post('/signin', validate(signinSchema), AuthController.signin);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/me', authGuard, AuthController.getMe);
router.get('/logout', authGuard, AuthController.logout);
router.post("/change-password", authGuard, validate(changePasswordSchema), AuthController.changePassword); 
router.post("/forgot-password", validate(forgotPasswordSchema), AuthController.forgotPassword); 
router.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);


export {router as authRouter};
