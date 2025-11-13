import { Router } from "express";
import { AuthorController } from "../controllers/authorController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/role.js";
import { validate } from "../middlewares/validate.js";
import { createAuthorSchema, updateAuthorSchema } from "../validations/authorValidation.js";

const router = Router();


router.post(
  "/",
  authMiddleware,
  roleGuard(["admin", "librarian"]),
  validate(createAuthorSchema),
  AuthorController.createAuthor
);

router.put(
  "/:id",
  authMiddleware,
  roleGuard(["admin", "librarian"]),
  validate(updateAuthorSchema),
  AuthorController.updateAuthor
);

router.get("/", AuthorController.getAllAuthors);


router.get("/:id", AuthorController.getAuthorById);


router.delete(
  "/:id",
  authMiddleware,
  roleGuard(["admin", "librarian"]),
  AuthorController.deleteAuthor
);

export {router as authorRouter};
