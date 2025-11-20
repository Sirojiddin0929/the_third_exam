import { BookService } from '../services/book.service.js';

export const BookController = {
  async create(req, res, next) {
    try {
      const result = await BookService.create(req.body,req.user);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await BookService.getAll(req.query);
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const book = await BookService.getById(req.params.id);
      res.json({ success: true, data: book });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const result = await BookService.update(req.params.id, req.body);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await BookService.delete(req.params.id);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
};
