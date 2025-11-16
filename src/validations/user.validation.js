import Joi from "joi";

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  username: Joi.string().min(3).optional(),
  firstName: Joi.string().min(2).optional(),
  lastName: Joi.string().min(2).optional(),
  role: Joi.string().valid("user", "admin").optional(),
  status: Joi.string().valid("active", "inactive").optional(),
});


