import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authGuard } from "../middlewares/authGuard.js";
// import { roleGuard } from "../middlewares/roleGuard.js";
import { validate } from "../middlewares/validate.js";
import { updateUserSchema } from "../validations/user.validation.js";

const router = Router();

router.get("/",UserController.getAll);
router.get("/:id", authGuard,UserController.getById);
router.put("/:id", authGuard, validate(updateUserSchema), UserController.updateUser);
router.delete("/:id", authGuard, UserController.deleteUser);

export { router as userRouter };
