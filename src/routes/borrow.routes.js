import { Router } from "express";
import { BorrowController } from "../controllers/borrowController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/role.js";
import { validate } from "../middlewares/validate.js";
import { createBorrowSchema, updateBorrowSchema } from "../validations/borrowValidation.js";

const router = Router();


router.post(
  "/",
  authMiddleware,
  roleGuard(["admin", "librarian"]),
  validate(createBorrowSchema),
  BorrowController.createBorrow
);

router.put(
  "/:id",
  authMiddleware,
  roleGuard(["admin", "librarian"]),
  validate(updateBorrowSchema),
  BorrowController.updateBorrow
);


router.get("/", authMiddleware, BorrowController.getAllBorrows);


router.get("/:id", authMiddleware, BorrowController.getBorrowById);


router.delete(
  "/:id",
  authMiddleware,
  roleGuard(["admin", "librarian"]),
  BorrowController.deleteBorrow
);

export {router as borrowRouter};
