import Joi from "joi";
import { roles,activation } from "../constants/roles.js";

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  username: Joi.string().min(3).optional(),
  firstName: Joi.string().min(2).optional(),
  lastName: Joi.string().min(2).optional(),
  role: Joi.string().valid(roles.admin,roles.librarian,roles.user).optional(),
  status: Joi.string().valid(activation.active,activation.inactive).optional(),
});


