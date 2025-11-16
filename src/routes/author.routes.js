import { Router } from 'express';
import { AuthorController } from '../controllers/author.controller.js';
import { authGuard } from '../middlewares/authGuard.js';
import { roleGuard } from '../middlewares/roleGuard.js';
import { validate } from '../middlewares/validate.js';
import { createAuthorSchema,updateAuthorSchema } from '../validations/author.validation.js';

const router = Router();

router.get('/', authGuard, AuthorController.getAll);
router.get('/:id', authGuard, AuthorController.getById);


router.post('/', authGuard, roleGuard('admin'), validate(createAuthorSchema), AuthorController.create);
router.put('/:id', authGuard, roleGuard('admin'), validate(updateAuthorSchema), AuthorController.update);
router.delete('/:id', authGuard, roleGuard('admin'), AuthorController.delete);

export { router as authorRouter };
