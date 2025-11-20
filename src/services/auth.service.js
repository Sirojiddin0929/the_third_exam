import db from '../database/knex.js';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { generateToken, verifyToken } from '../helpers/jwt.js';
import { generateOtp } from '../helpers/otp.js';
import { mailer } from '../helpers/nodeMailer.js';
import { ApiError } from '../helpers/errorMessage.js';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';
import { activation, roles } from '../constants/roles.js';

export const AuthService = {

  async signup({ email, username, password, role,firstName,lastName }) {
    console.log('sign up')
    const existingUser = await db('users').where({ email }).orWhere({ username }).first();
    if (existingUser) throw new ApiError(400, 'Email or Username already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const newUser = {
      id: uuid(),
      email,
      username,
      password: hashedPassword,
      role: role || roles.user,
      status: activation.inactive,
      otp,
      firstName,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log(newUser)
    await db('users').insert(newUser);

    try {
      await mailer(email, otp);
    } catch (err) {
      logger.error(`Mailer error: ${err.message}`);
    }

    return { userId: newUser.id, otpSent: true };
  },

  async verifyOtp({ userId, otp }) {
    const user = await db('users').where({ id: userId }).first();
    if (!user) throw new ApiError(404, 'User not found');

    if (user.otp !== otp) throw new ApiError(400, 'Invalid OTP');

    await db('users').where({ id: userId }).update({
      status: activation.active,
      otp: null,
      updatedAt: new Date()
    });

    return { message: 'OTP verified, account activated' };
  },

  async signin({ email, password }) {
    const user = await db('users').where({ email }).first();
    if (!user) throw new ApiError(404, 'User not found');
    if (user.status !== activation.active) throw new ApiError(403, 'User not active');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(400, 'Incorrect password');

    const accessToken = generateToken({ id: user.id, role: user.role }, config.jwt.accessSecret, '1h');
    const refreshToken = generateToken({ id: user.id, role: user.role }, config.jwt.refreshSecret, '7d');

    await db('users').where({ id: user.id }).update({ refreshToken, updatedAt: new Date() });

    return { accessToken, refreshToken };
  },

  async refreshToken({ token }) {
    let payload;
    try {
      payload = verifyToken(token, config.jwt.refreshSecret);
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired refresh token',err);
    }

    const user = await db('users').where({ id: payload.id }).first();
    if (!user) throw new ApiError(404, 'User not found');

    const newAccessToken = generateToken({ id: user.id, role: user.role }, config.jwt.accessSecret, '1h');
    const newRefreshToken = generateToken({ id: user.id, role: user.role }, config.jwt.refreshSecret, '7d');

    await db('users').where({ id: user.id }).update({ refreshToken: newRefreshToken, updatedAt: new Date() });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  async getMe(userId) {
    const user = await db('users')
      .select('id', 'email', 'username', 'role', 'status','firstName','lastName', 'createdAt', 'updatedAt')
      .where({ id: userId })
      .first();

    if (!user) throw new ApiError(404, 'User not found');
    return user;
  },

  async logout(userId) {
    await db('users').where({ id: userId }).update({ refreshToken: null, updatedAt: new Date() });
    return { message: 'Logout successful' };
  }

};
