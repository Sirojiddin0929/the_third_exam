import Joi from "joi";
import { borrowRoles } from "../constants/roles.js";
export const createBorrowSchema = Joi.object({
  bookId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
  borrowDate: Joi.date().required(),
  dueDate: Joi.date().required()
});

export const updateBorrowSchema = Joi.object({
  returnDate: Joi.date(),
  status: Joi.string().valid(borrowRoles.borrowed,borrowRoles.returned,borrowRoles.overdue)
});
