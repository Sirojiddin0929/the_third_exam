import db from "../config/db.js";

export const UserController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (page - 1) * limit;

      const users = await db("users")
        .select("id", "name", "email", "role")
        .modify((qb) => {
          if (search) {
            qb.whereILike("name", `%${search}%`).orWhereILike("email", `%${search}%`);
          }
        })
        .limit(limit)
        .offset(offset);

      const total = await db("users")
        .modify((qb) => {
          if (search) {
            qb.whereILike("name", `%${search}%`).orWhereILike("email", `%${search}%`);
          }
        })
        .count("* as count")
        .first();

      res.json({
        page: Number(page),
        limit: Number(limit),
        total: Number(total.count),
        users,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await db("users").where({ id: req.params.id }).first();
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const [newUser] = await db("users").insert(req.body).returning("*");
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await db("users").where({ id: req.params.id }).update(req.body).returning("*");
      if (!updated) return res.status(404).json({ message: "User not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await db("users").where({ id: req.params.id }).del();
      if (!deleted) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
