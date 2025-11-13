import db from "../config/db.js";

export const BorrowController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const borrows = await db("borrows")
        .select("*")
        .limit(limit)
        .offset(offset);

      const total = await db("borrows").count("* as count").first();

      res.json({
        page: Number(page),
        limit: Number(limit),
        total: Number(total.count),
        borrows,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const borrow = await db("borrows").where({ id: req.params.id }).first();
      if (!borrow) return res.status(404).json({ message: "Borrow record not found" });
      res.json(borrow);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const [newBorrow] = await db("borrows").insert(req.body).returning("*");
      res.status(201).json(newBorrow);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await db("borrows").where({ id: req.params.id }).update(req.body).returning("*");
      if (!updated) return res.status(404).json({ message: "Borrow not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await db("borrows").where({ id: req.params.id }).del();
      if (!deleted) return res.status(404).json({ message: "Borrow not found" });
      res.json({ message: "Borrow deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
