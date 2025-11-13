import db from "../config/db.js";

export const AuthorModel = {
  async create(author) {
    return await db("authors").insert(author).returning("*");
  },

  async findAll() {
    return await db("authors").select("*");
  },

  async findById(id) {
    return await db("authors").where({ id }).first();
  },

  async update(id, data) {
    return await db("authors").where({ id }).update(data).returning("*");
  },

  async remove(id) {
    return await db("authors").where({ id }).del();
  },
};
