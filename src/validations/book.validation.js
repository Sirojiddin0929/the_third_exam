import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().required(),
  isbn: Joi.string().required(),
  authorId: Joi.string().uuid().required(),
  category: Joi.string().required(),
  publicationDate: Joi.date().iso().required(),
  totalCopies: Joi.number().integer().min(1).required(),
});

export const updateBookSchema = Joi.object({
  title: Joi.string(),
  isbn: Joi.string(),
  authorId: Joi.string().uuid(),
  category: Joi.string(),
  publicationDate: Joi.date().iso(),
  totalCopies: Joi.number().integer().min(1),
});
