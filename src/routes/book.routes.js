import { Router } from "express";
import { BookController } from "../controllers/bookController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/role.js";
import { validate } from "../middlewares/validate.js";
import { createBookSchema, updateBookSchema } from "../validations/bookValidation.js";

const router = Router();

router.post("/", authMiddleware, roleGuard(["admin", "librarian"]), validate(createBookSchema), BookController.createBook);
router.put("/:id", authMiddleware, roleGuard(["admin", "librarian"]), validate(updateBookSchema), BookController.updateBook);
router.get("/", BookController.getAllBooks);
router.get("/:id", BookController.getBookById);
router.delete("/:id", authMiddleware, roleGuard(["admin", "librarian"]), BookController.deleteBook);

export {router as bookRouter};
