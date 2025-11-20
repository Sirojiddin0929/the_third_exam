import Joi from 'joi';
import { roles } from '../constants/roles.js';


export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email invalid',
    'any.required': 'Email is required'
  }),
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be at most 30 characters',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Confirm Password is required'
  }),
  role: Joi.string().valid(roles.user,roles.admin,roles.librarian).optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
});


export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


export const verifyOtpSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  otp: Joi.string().length(6).required()
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "Confirm password must match new password" })
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});


export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "Confirm password must match new password" })
});

