import { Router } from 'express';
import { BorrowController } from '../controllers/borrow.controller.js';
import { authGuard } from '../middlewares/authGuard.js';
import { roleGuard } from '../middlewares/roleGuard.js';
import { validate } from '../middlewares/validate.js';
import { createBorrowSchema, updateBorrowSchema } from '../validations/borrow.validation.js';
import { roles } from '../constants/roles.js';

const router = Router();

router.get('/', authGuard,roleGuard(roles.admin,roles.librarian,roles.user), BorrowController.getAll);
router.get('/my-borrows',authGuard,roleGuard(roles.admin,roles.librarian,roles.user),BorrowController.getMyBorrows)
router.get('/:id', authGuard, roleGuard(roles.admin,roles.librarian,roles.user), BorrowController.getById);
router.post('/', authGuard, roleGuard(roles.admin,roles.librarian,roles.user), validate(createBorrowSchema), BorrowController.create);
router.put('/:id', authGuard, roleGuard(roles.admin,roles.librarian,roles.user), validate(updateBorrowSchema), BorrowController.update);
router.delete('/:id', authGuard, roleGuard(roles.admin,roles.librarian,roles.user), BorrowController.delete);

export { router as borrowRouter };
