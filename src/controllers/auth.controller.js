import { AuthService } from '../services/auth.service.js';
import { ApiError } from '../helpers/errorMessage.js';
import logger from '../utils/logger.js';
import db from '../database/knex.js';
import bcrypt from 'bcryptjs';
import { mailer } from '../helpers/nodeMailer.js';
import { generateOtp } from '../helpers/otp.js';
export const AuthController = {
  signup: async (req, res, next) => {
    try {
      const { email, username, password, confirmPassword, firstName, lastName, role } = req.body;
      
      if (!email || !username || !password || !confirmPassword || !firstName || !lastName) {
        logger.warn('Signup attempt with missing fields');
        throw new ApiError(400, 'All fields are required');
      }
      if (password !== confirmPassword) {
        logger.warn(`Password mismatch during signup for email: ${email}`);
        throw new ApiError(400, 'Passwords do not match');
      }

      const result = await AuthService.signup({
        email, username, password, firstName, lastName, role
      });

      logger.info(`User signed up successfully: ${email}`);
      res.status(201).json({
        message: 'User created successfully. OTP sent to email.',
        userId: result.userId,
        otpSent: result.otpSent
      });

    } catch (error) {
      logger.error(`Signup error: ${error.message}`);
      next(error);
    }
  },

  
  verifyOtp: async (req, res, next) => {
    try {
      const { userId, otp } = req.body;
      if (!userId || !otp) {
        logger.warn('Verify OTP attempt with missing fields');
        throw new ApiError(400, 'userId and otp are required');
      }

      const result = await AuthService.verifyOtp({ userId, otp });
      logger.info(`OTP verified for user: ${userId}`);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Verify OTP error: ${error.message}`);
      next(error);
    }
  },

  
  signin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        logger.warn('Signin attempt with missing fields');
        throw new ApiError(400, 'Email and password are required');
      }

      const tokens = await AuthService.signin({ email, password });
      logger.info(`User signed in: ${email}`);
      res.status(200).json(tokens);
    } catch (error) {
      logger.error(`Signin error: ${error.message}`);
      next(error);
    }
  },

  
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        logger.warn('Refresh token attempt with missing token');
        throw new ApiError(400, 'Refresh token is required');
      }

      const tokens = await AuthService.refreshToken({ token: refreshToken });
      logger.info(`Refresh token issued`);
      res.status(200).json(tokens);
    } catch (error) {
      logger.error(`Refresh token error: ${error.message}`);
      next(error);
    }
  },

  
  getMe: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await AuthService.getMe(userId);
      logger.info(`Current user fetched: ${userId}`);
      res.status(200).json(user);
    } catch (error) {
      logger.error(`GetMe error: ${error.message}`);
      next(error);
    }
  },

  
  logout: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await AuthService.logout(userId);
      logger.info(`User logged out: ${userId}`);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      next(error);
    }
  },
  changePassword: async (req, res, next)=> {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await db("users").where({ id: userId }).first();
    if (!user) return next(new ApiError(404, "User not found"));

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(new ApiError(400, "Old password is incorrect"));
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db("users")
      .where({ id: userId })
      .update({ password: hashed, updatedAt: new Date() });

    return res.json({ message: "Password successfully updated" });

  } catch (err) {
    next(err);
  }
},
 forgotPassword: async (req, res, next)=> {
  try {
    const { email } = req.body;

    const user = await db("users").where({ email }).first();
    if (!user) return next(new ApiError(404, "User not found"));

    const otp = generateOtp();

    await db("users").where({ id: user.id }).update({
      otp,
      updatedAt: new Date()
    });

    await mailer(email, otp);

    res.json({ message: "OTP sent to your email" });

  } catch (err) {
    next(err);
  }
},
resetPassword: async (req, res, next)=> {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await db("users").where({ email }).first();
    if (!user) return next(new ApiError(404, "User not found"));

    if (user.otp !== otp) {
      return next(new ApiError(400, "Invalid OTP"));
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db("users")
      .where({ id: user.id })
      .update({
        password: hashed,
        otp: null,
        updatedAt: new Date()
      });

    return res.json({ message: "Password reset successful" });

  } catch (err) {
    next(err);
  }
}

};
