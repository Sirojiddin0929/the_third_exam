import db from "../config/db.js";

export const BookModel = {
  async create(book) {
    return await db("books").insert(book).returning("*");
  },

  async findAll() {
    return await db("books").select("*");
  },

  async findById(id) {
    return await db("books").where({ id }).first();
  },

  async update(id, data) {
    return await db("books").where({ id }).update(data).returning("*");
  },

  async remove(id) {
    return await db("books").where({ id }).del();
  },
};
