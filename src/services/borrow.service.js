import db from '../database/knex.js';
import { v4 as uuid } from 'uuid';
import { ApiError } from '../helpers/errorMessage.js';
import { roles,borrowRoles } from '../constants/roles.js';
export const BorrowService = {
  async create({ bookId, userId,dueDate},requester) {
    if(!requester){
      throw new ApiError(401,"Unauthorized")
    }

    if(requester.role=== roles.user && requester.id !== userId){
      throw new ApiError(403,"You do not have permission to do it")
    }
    
    const existing=await db("borrows").where({bookId,userId}).first()
    if(existing){
      throw new ApiError(400,"You already borrowed this book")
    }
    const book = await db('books').where({ id: bookId }).first();
    if (!book) throw new ApiError(404, 'Book not found');

    const user = await db('users').where({ id: userId }).first();
    if (!user) throw new ApiError(404, 'User not found');

    
    const newBorrow = {
      id: uuid(),
      bookId,
      userId,
      borrowDate:new Date(),
      dueDate,
      returnDate: undefined,
      status: borrowRoles.borrowed,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [borrow] = await db('borrows').insert(newBorrow).returning("*");
    return { borrow};
  },

  async getAll({ page = 1, limit = 10, search = "" }) {
    const pageNum=parseInt(page)
    const limitNum=parseInt(limit)
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
      .limit(limitNum)
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
      page: pageNum,
      limit: limitNum,
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
