import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  isbn: Joi.string().min(10).max(13).required(),
  authorId: Joi.string().uuid().required(),
  category: Joi.string().min(2).max(100).required(),
  publicationDate: Joi.date().required(),
  totalCopies: Joi.number().integer().min(1).required()
});

export const updateBookSchema = Joi.object({
  title: Joi.string().min(2).max(255),
  isbn: Joi.string().min(10).max(13),
  authorId: Joi.string().uuid(),
  category: Joi.string().min(2).max(100),
  publicationDate: Joi.date(),
  totalCopies: Joi.number().integer().min(1)
});
