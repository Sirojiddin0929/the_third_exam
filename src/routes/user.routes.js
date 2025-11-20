import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authGuard } from "../middlewares/authGuard.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import { validate } from "../middlewares/validate.js";
import { updateUserSchema } from "../validations/user.validation.js";
import { roles } from "../constants/roles.js";

const router = Router();

router.get("/",authGuard,roleGuard(roles.admin),UserController.getAll);
router.get("/:id", authGuard,roleGuard(roles.admin),UserController.getById);
router.put("/:id", authGuard,roleGuard(roles.admin,roles.user) ,validate(updateUserSchema), UserController.updateUser);
router.delete("/:id", authGuard,roleGuard(roles.admin,roles.user),UserController.deleteUser);

export { router as userRouter };
