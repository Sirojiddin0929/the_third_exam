import Joi from 'joi';

export const createAuthorSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  biography: Joi.string().max(1000).optional(),
  dateOfBirth: Joi.date().optional(),
  nationality: Joi.string().max(100).optional()
});

export const updateAuthorSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  biography: Joi.string().max(1000).optional(),
  dateOfBirth: Joi.date().optional(),
  nationality: Joi.string().max(100).optional()
});
