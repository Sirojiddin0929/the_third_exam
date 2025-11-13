import db from "../config/db.js";

export const UserModel = {
  async create(user) {
    return await db("users").insert(user).returning("*");
  },

  async findAll() {
    return await db("users").select("*");
  },

  async findById(id) {
    return await db("users").where({ id }).first();
  },

  async findByEmail(email) {
    return await db("users").where({ email }).first();
  },

  async update(id, data) {
    return await db("users").where({ id }).update(data).returning("*");
  },

  async remove(id) {
    return await db("users").where({ id }).del();
  },
};
