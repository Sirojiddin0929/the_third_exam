import db from '../database/knex.js';
import { v4 as uuid } from 'uuid';
import { ApiError } from '../helpers/errorMessage.js';

export const AuthorService = {
  async create({ firstName, lastName, biography, dateOfBirth, nationality }) {
    const newAuthor = {
      id: uuid(),
      firstName,
      lastName,
      biography: biography || null,
      dateOfBirth: dateOfBirth || null,
      nationality: nationality || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db('authors').insert(newAuthor);
    return { authorId: newAuthor.id, message: 'Author created' };
  },

  async getAll({ page = 1, limit = 10, search = "" }) {
    const offset = (page - 1) * limit;

    const authors = await db('authors')
      .select('id', 'firstName', 'lastName', 'biography', 'dateOfBirth', 'nationality', 'createdAt', 'updatedAt')
      .modify((qb) => {
        if (search) {
          qb.whereILike('firstName', `%${search}%`)
            .orWhereILike('lastName', `%${search}%`)
            .orWhereILike('nationality', `%${search}%`);
        }
      })
      .limit(limit)
      .offset(offset);

    const totalResult = await db('authors')
      .modify((qb) => {
        if (search) {
          qb.whereILike('firstName', `%${search}%`)
            .orWhereILike('lastName', `%${search}%`)
            .orWhereILike('nationality', `%${search}%`);
        }
      })
      .count('* as count')
      .first();

    return {
      page: Number(page),
      limit: Number(limit),
      total: Number(totalResult.count),
      authors
    };
  },

  async getById(id) {
    const author = await db('authors').where({ id }).first();
    if (!author) throw new ApiError(404, 'Author not found');
    return author;
  },

  async update(id, data) {
    data.updatedAt = new Date();
    const [updated] = await db('authors')
      .where({ id })
      .update(data)
      .returning(['id', 'firstName', 'lastName', 'biography', 'dateOfBirth', 'nationality', 'createdAt', 'updatedAt']);

    if (!updated) throw new ApiError(404, 'Author not found');
    return { authorId: updated.id, message: 'Author updated' };
  },

  async delete(id) {
    const author = await db('authors').where({ id }).first();
    if (!author) throw new ApiError(404, 'Author not found');

    await db('authors').where({ id }).del();
    return { message: 'Author deleted' };
  }
};
