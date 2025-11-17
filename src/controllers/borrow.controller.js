import { BorrowService } from '../services/borrow.service.js';
import db from '../database/knex.js';
export const BorrowController = {
  async create(req, res, next) {
    try {
      const result = await BorrowService.create(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await BorrowService.getAll(req.query);
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const borrow = await BorrowService.getById(req.params.id);
      res.json({ success: true, data: borrow });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const result = await BorrowService.update(req.params.id, req.body);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await BorrowService.delete(req.params.id);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },
  async getMyBorrows(req, res, next) {
  try {
    const borrows = await db('borrows')
      .join('books', 'borrows.bookId', 'books.id')
      .join('authors', 'books.authorId', 'authors.id')
      .where({ 'borrows.userId': req.user.id })
      .select(
        'borrows.id as borrowId',
        'borrows.borrowDate',
        'borrows.dueDate',
        'borrows.returnDate',
        'borrows.status',
        'books.id as bookId',
        'books.title as bookTitle',
        'books.isbn as bookISBN',
        'books.category as bookCategory',
        'authors.id as authorId',
        'authors.firstName as authorFirstName',
        'authors.lastName as authorLastName'
      );

    res.json({ success: true, borrows });
  } catch (err) {
    next(err);
  }
}

}



