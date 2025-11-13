import Joi from "joi";

export const createAuthorSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  biography: Joi.string().allow("").optional(),
  dateOfBirth: Joi.date().required(),
  nationality: Joi.string().min(2).max(50).required()
});

export const updateAuthorSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  biography: Joi.string().allow(""),
  dateOfBirth: Joi.date(),
  nationality: Joi.string().min(2).max(50)
});
