import { db } from '../db/knex.js';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

export const UserService = {
  
  
  async createUser({ email, username, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuid(),
      email,
      username,
      password: hashedPassword,
      role,
      status: 'inactive',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db('users').insert(newUser);
    return newUser;
  },

  
  async getAllUsers({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    const users = await db('users')
      .whereILike('username', `%${search}%`)
      .orWhereILike('email', `%${search}%`)
      .limit(limit)
      .offset(offset);

    const total = await db('users')
      .whereILike('username', `%${search}%`)
      .orWhereILike('email', `%${search}%`)
      .count('id as count')
      .first();

    return { users, total: total.count };
  },

  
  async getUserById(id) {
    return await db('users').where({ id }).first();
  },

  
  async updateUser(id, payload) {
    payload.updatedAt = new Date();
    await db('users').where({ id }).update(payload);
    return await db('users').where({ id }).first();
  },

  
  async deleteUser(id) {
    return await db('users').where({ id }).del();
  }

};
