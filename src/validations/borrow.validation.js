import Joi from "joi";

export const createBorrowSchema = Joi.object({
  bookId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
  borrowDate: Joi.date().required(),
  dueDate: Joi.date().required()
});

export const updateBorrowSchema = Joi.object({
  returnDate: Joi.date(),
  status: Joi.string().valid("borrowed", "returned", "overdue")
});
