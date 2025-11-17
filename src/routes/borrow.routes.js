import { Router } from 'express';
import { BorrowController } from '../controllers/borrow.controller.js';
import { authGuard } from '../middlewares/authGuard.js';
import { roleGuard } from '../middlewares/roleGuard.js';
import { validate } from '../middlewares/validate.js';
import { createBorrowSchema, updateBorrowSchema } from '../validations/borrow.validation.js';

const router = Router();

router.get('/', roleGuard('admin', 'librarian','user'), BorrowController.getAll);
router.get('/my-borrows',authGuard,roleGuard('admin','librarian','user'),BorrowController.getMyBorrows)
router.get('/:id', authGuard, roleGuard('admin', 'librarian', 'user'), BorrowController.getById);

router.post('/', authGuard, roleGuard('admin', 'librarian','user'), validate(createBorrowSchema), BorrowController.create);
router.put('/:id', authGuard, roleGuard('admin', 'librarian'), validate(updateBorrowSchema), BorrowController.update);
router.delete('/:id', authGuard, roleGuard('admin', 'librarian'), BorrowController.delete);

export { router as borrowRouter };
