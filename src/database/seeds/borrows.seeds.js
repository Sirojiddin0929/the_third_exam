import { v4 as uuid } from "uuid";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  
  await knex("borrows").del();

  
  const books = await knex("books").select("id").limit(3);
  const users = await knex("users").select("id").limit(3);

  const today = new Date();
  const due = new Date();
  due.setDate(today.getDate() + 14); 

  const borrows = [
    {
      id: uuid(),
      bookId: books[0]?.id || uuid(),
      userId: users[0]?.id || uuid(),
      borrowDate: today.toISOString().split("T")[0],
      dueDate: due.toISOString().split("T")[0],
      returnDate: null,
      status: "borrowed",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuid(),
      bookId: books[1]?.id || uuid(),
      userId: users[1]?.id || uuid(),
      borrowDate: today.toISOString().split("T")[0],
      dueDate: due.toISOString().split("T")[0],
      returnDate: null,
      status: "borrowed",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuid(),
      bookId: books[2]?.id || uuid(),
      userId: users[2]?.id || uuid(),
      borrowDate: today.toISOString().split("T")[0],
      dueDate: due.toISOString().split("T")[0],
      returnDate: null,
      status: "borrowed",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
  ];

  await knex("borrows").insert(borrows);
}
