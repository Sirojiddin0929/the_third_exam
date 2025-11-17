import db from '../database/knex.js';
import { ApiError } from "../helpers/errorMessage.js";

export const UserService = {
  
  async getAll({ page = 1, limit = 10, search = "" }) {
    const pageNum=parseInt(page) || 1
    const limitNum =parseInt(limit) || 10
    const offset = (pageNum - 1) * limitNum;

    const users = await db("users")
      .select("id","email","firstName", "lastName", "role","status")
      .modify((qb) => {
        if (search) {
          qb.whereILike("firstName", `%${search}%`)
            .orWhereILike("lastName", `%${search}%`)
            .orWhereILike("role", `%${search}%`)
            .orWhereILike("status", `%${search}%`);
        }
      })
      .limit(limitNum)
      .offset(offset);

    const totalResult = await db("users")
      .modify((qb) => {
        if (search) {
          qb.whereILike("firstName", `%${search}%`)
            .orWhereILike("lastName", `%${search}%`)
            .orWhereILike("role", `%${search}%`)
            .orWhereILike("status", `%${search}%`);
        }
      })
      .count("* as count")
      .first();

    return {
      page: pageNum,
      limit: limitNum,
      total: Number(totalResult.count),
      users
    };
  },

  async getById(id, requester) {
    if (requester.role === "user" && requester.id !== id) {
      throw new ApiError(403, "You do not have permission to view this profile");
    }
    

    const user = await db("users")
      .select(
        "id",
        "email",
        "username",
        "firstName",
        "lastName",
        "role",
        "status",
        "createdAt",
        "updatedAt"
      )
      .where({ id })
      .first();

    if (!user) throw new ApiError(404, "User not found");

    return user;
  },

  async updateUser(id, data, requester) {
    if (requester.role === "user" && requester.id !== id) {
      throw new ApiError(403, "You do not have permission to update this profile");
    }
    

    data.updatedAt = new Date();

    const updated = await db("users")
      .where({ id })
      .update(data)
      .returning([
        "id",
        "email",
        "username",
        "firstName",
        "lastName",
        "role",
        "status",
        "createdAt",
        "updatedAt"
      ]);

    if (!updated.length) throw new ApiError(404, "User not found");

    return updated[0];
  },

  async deleteUser(id, requester) {
    if (requester.role === "user" && requester.id !== id) {
      throw new ApiError(403, "You do not have permission to delete this user");
    }
    

    const user = await db("users").where({ id }).first();
    if (!user) throw new ApiError(404, "User not found");

    await db("users").where({ id }).del();
    return { message: "User deleted successfully" };
  }
};
