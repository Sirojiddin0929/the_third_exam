import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { signupSchema, signinSchema, verifyOtpSchema } from "../validations/authValidation.js";

const router = Router();

router.post("/signup", validate(signupSchema), AuthController.signup);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp);
router.post("/signin", validate(signinSchema), AuthController.signin);
router.get("/me", authMiddleware, AuthController.getMe);
router.get("/logout", authMiddleware, AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);

export {router as authRouter};
