import db from '../database/knex.js';
import { v4 as uuid } from 'uuid';
import { ApiError } from '../helpers/errorMessage.js';

export const BookService = {
  async create({ title, isbn, authorId, category, publicationDate, totalCopies }) {
    const author = await db('authors').where({ id: authorId }).first();
    if (!author) throw new ApiError(404, 'Author not found');

    const newBook = {
      id: uuid(),
      title,
      isbn,
      authorId,
      category: category || null,
      publicationDate: publicationDate || null,
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db('books').insert(newBook);
    return { bookId: newBook.id, message: 'Book created' };
  },

  async getAll({ page = 1, limit = 10, search = "",authorId }) {
    const pageNum=parseInt(page) || 1
    const limitNum=parseInt(limit) || 10
    const offset = (pageNum - 1) * limitNum;

    const books = await db('books')
      .select('*')
      .modify((qb) => {
        if (authorId) {
        qb.where('authorId', authorId);
      }
        if (search) {
          qb.where((q)=>{
          q.whereILike('title', `%${search}%`)
            .orWhereILike('isbn', `%${search}%`)
            .orWhereILike('category', `%${search}%`);
        })
      }
      })
      .limit(limitNum)
      .offset(offset);

    const totalResult = await db('books')
      .modify((qb) => {
        if (authorId) {
        qb.where('authorId', authorId);
      }
        if (search) {
          qb.whereILike('title', `%${search}%`)
            .orWhereILike('isbn', `%${search}%`)
            .orWhereILike('category', `%${search}%`);
        }
      })
      .count('* as count')
      .first();

    return {
      page: pageNum,
      limit: limitNum,
      total: Number(totalResult.count),
      books
    };
  },

  async getById(id) {
    const book = await db('books').where({ id }).first();
    if (!book) throw new ApiError(404, 'Book not found');
    return book;
  },

  async update(id, data) {
    if (data.authorId) {
      const author = await db('authors').where({ id: data.authorId }).first();
      if (!author) throw new ApiError(404, 'Author not found');
    }

    data.updatedAt = new Date();
    const [updated] = await db('books')
      .where({ id })
      .update(data)
      .returning('*');

    if (!updated) throw new ApiError(404, 'Book not found');
    return { bookId: updated.id, message: 'Book updated' };
  },

  async delete(id) {
    const book = await db('books').where({ id }).first();
    if (!book) throw new ApiError(404, 'Book not found');

    await db('books').where({ id }).del();
    return { message: 'Book deleted' };
  }
};
