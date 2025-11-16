import { Router } from 'express';
import { BookController } from '../controllers/book.controller.js';
import { authGuard } from '../middlewares/authGuard.js';
import { roleGuard } from '../middlewares/roleGuard.js';
import { validate } from '../middlewares/validate.js';
import { createBookSchema, updateBookSchema } from '../validations/book.validation.js';

const router = Router();

router.get('/', authGuard, BookController.getAll);
router.get('/:id', authGuard, BookController.getById);

router.post('/', authGuard, roleGuard('admin'), validate(createBookSchema), BookController.create);
router.put('/:id', authGuard, roleGuard('admin'), validate(updateBookSchema), BookController.update);
router.delete('/:id', authGuard, roleGuard('admin'), BookController.delete);

export { router as bookRouter };
