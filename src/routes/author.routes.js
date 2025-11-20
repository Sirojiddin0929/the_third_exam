import { Router } from 'express';
import { AuthorController } from '../controllers/author.controller.js';
import { authGuard } from '../middlewares/authGuard.js';
import { roleGuard } from '../middlewares/roleGuard.js';
import { validate } from '../middlewares/validate.js';
import { createAuthorSchema,updateAuthorSchema } from '../validations/author.validation.js';
import { roles } from '../constants/roles.js';

const router = Router();

router.get('/', authGuard,roleGuard(roles.admin,roles.librarian), AuthorController.getAll);
router.get('/:id', authGuard,roleGuard(roles.admin,roles.librarian), AuthorController.getById);
router.post('/', authGuard, roleGuard(roles.admin,roles.librarian), validate(createAuthorSchema), AuthorController.create);
router.put('/:id', authGuard, roleGuard(roles.admin,roles.librarian), validate(updateAuthorSchema), AuthorController.update);
router.delete('/:id', authGuard, roleGuard(roles.admin,roles.librarian), AuthorController.delete);

export { router as authorRouter };
