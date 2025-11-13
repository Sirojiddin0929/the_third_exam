import db from "../config/db.js";

export const BookController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (page - 1) * limit;

      const books = await db("books")
        .select("*")
        .modify((qb) => {
          if (search) {
            qb.whereILike("title", `%${search}%`);
          }
        })
        .limit(limit)
        .offset(offset);

      const total = await db("books")
        .modify((qb) => {
          if (search) {
            qb.whereILike("title", `%${search}%`);
          }
        })
        .count("* as count")
        .first();

      res.json({
        page: Number(page),
        limit: Number(limit),
        total: Number(total.count),
        books,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const book = await db("books").where({ id: req.params.id }).first();
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const [newBook] = await db("books").insert(req.body).returning("*");
      res.status(201).json(newBook);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await db("books").where({ id: req.params.id }).update(req.body).returning("*");
      if (!updated) return res.status(404).json({ message: "Book not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await db("books").where({ id: req.params.id }).del();
      if (!deleted) return res.status(404).json({ message: "Book not found" });
      res.json({ message: "Book deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
