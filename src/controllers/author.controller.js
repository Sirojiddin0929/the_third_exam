import db from "../config/db.js";

export const AuthorController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (page - 1) * limit;

      const authors = await db("authors")
        .select("*")
        .modify((qb) => {
          if (search) {
            qb.whereILike("name", `%${search}%`);
          }
        })
        .limit(limit)
        .offset(offset);

      const total = await db("authors")
        .modify((qb) => {
          if (search) {
            qb.whereILike("name", `%${search}%`);
          }
        })
        .count("* as count")
        .first();

      res.json({
        page: Number(page),
        limit: Number(limit),
        total: Number(total.count),
        authors,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const author = await db("authors").where({ id: req.params.id }).first();
      if (!author) return res.status(404).json({ message: "Author not found" });
      res.json(author);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const [newAuthor] = await db("authors").insert(req.body).returning("*");
      res.status(201).json(newAuthor);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await db("authors").where({ id: req.params.id }).update(req.body).returning("*");
      if (!updated) return res.status(404).json({ message: "Author not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await db("authors").where({ id: req.params.id }).del();
      if (!deleted) return res.status(404).json({ message: "Author not found" });
      res.json({ message: "Author deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
