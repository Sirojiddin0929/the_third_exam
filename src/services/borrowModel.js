import db from "../config/db.js";

export const BorrowModel = {
  async create(borrow) {
    return await db("borrows").insert(borrow).returning("*");
  },

  async findAll() {
    return await db("borrows").select("*");
  },

  async findById(id) {
    return await db("borrows").where({ id }).first();
  },

  async update(id, data) {
    return await db("borrows").where({ id }).update(data).returning("*");
  },

async remove(id) {
    return await db("borrows").where({ id }).del();
  },
};
