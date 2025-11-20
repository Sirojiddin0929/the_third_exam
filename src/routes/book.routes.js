import { Router } from 'express';
import { BookController } from '../controllers/book.controller.js';
import { authGuard } from '../middlewares/authGuard.js';
import { roleGuard } from '../middlewares/roleGuard.js';
import { validate } from '../middlewares/validate.js';
import { createBookSchema, updateBookSchema } from '../validations/book.validation.js';
import { roles } from '../constants/roles.js';

const router = Router();

router.get('/', authGuard, roleGuard(roles.admin,roles.librarian),BookController.getAll);
router.get('/:id', authGuard,roleGuard(roles.admin,roles.librarian), BookController.getById);
router.post('/', authGuard, roleGuard(roles.admin,roles.librarian), validate(createBookSchema), BookController.create);
router.put('/:id', authGuard, roleGuard(roles.admin,roles.librarian), validate(updateBookSchema), BookController.update);
router.delete('/:id', authGuard, roleGuard(roles.admin,roles.librarian), BookController.delete);

export { router as bookRouter };
