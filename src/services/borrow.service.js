import db from '../database/knex.js';
import { v4 as uuid } from 'uuid';
import { ApiError } from '../helpers/errorMessage.js';

export const BorrowService = {
  async create({ bookId, userId, borrowDate, dueDate }) {
    const book = await db('books').where({ id: bookId }).first();
    if (!book) throw new ApiError(404, 'Book not found');

    const user = await db('users').where({ id: userId }).first();
    if (!user) throw new ApiError(404, 'User not found');

    const newBorrow = {
      id: uuid(),
      bookId,
      userId,
      borrowDate: borrowDate || new Date(),
      dueDate,
      returnDate: null,
      status: 'borrowed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db('borrows').insert(newBorrow);
    return { borrowId: newBorrow.id, message: 'Borrow created' };
  },

  async getAll({ page = 1, limit = 10, search = "" }) {
    const pageNum=parseInt(page) || 1
    const limitNum=parseInt(limit) || 10
    const offset = (pageNum - 1) * limitNum;

    const borrows = await db('borrows')
      .select('*')
      .modify((qb)=>{
        if(search){
          qb.whereILike('borrowDate',`%${search}%`)
          .orWhereILike('dueDate', `%${search}%`)
          .orWhereILike('returnDate', `%${search}%`);
        }
      })
      .limit(limit)
      .offset(offset);

    const totalResult = await db('borrows')
      .modify((qb) => {
        if (search) {
          qb.whereILike('borrowDate', `%${search}%`)
            .orWhereILike('dueDate', `%${search}%`)
            .orWhereILike('returnDate', `%${search}%`);
        }
      })
      .count('* as count')
      .first();


    return {
      page: Number(page),
      limit: Number(limit),
      total: Number(totalResult.count),
      borrows
    };
  },

  async getById(id) {
    const borrow = await db('borrows').where({ id }).first();
    if (!borrow) throw new ApiError(404, 'Borrow not found');
    return borrow;
  },

  async update(id, data) {
    data.updatedAt = new Date();

    const [updated] = await db('borrows')
      .where({ id })
      .update(data)
      .returning('*');

    if (!updated) throw new ApiError(404, 'Borrow not found');
    return { borrowId: updated.id, message: 'Borrow updated' };
  },

  async delete(id) {
    const borrow = await db('borrows').where({ id }).first();
    if (!borrow) throw new ApiError(404, 'Borrow not found');

    await db('borrows').where({ id }).del();
    return { message: 'Borrow deleted' };
  }
};
