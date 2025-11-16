import { AuthorService } from '../services/author.service.js';

export const AuthorController = {
  async create(req, res, next) {
    try {
      const result = await AuthorService.create(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await AuthorService.getAll(req.query);
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const author = await AuthorService.getById(req.params.id);
      res.json({ success: true, data: author });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const result = await AuthorService.update(req.params.id, req.body);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const result = await AuthorService.delete(req.params.id);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
};
