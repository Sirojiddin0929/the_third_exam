import { v4 as uuid } from "uuid";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  
  await knex("books").del();

  
  const authors = await knex("authors").select("id").limit(3);

  const books = [
    {
      id: uuid(),
      title: "1984",
      isbn: "9780451524935",
      authorId: authors[0]?.id || uuid(),
      category: "Dystopian",
      publicationDate: "1949-06-08",
      totalCopies: 5,
      availableCopies: 5,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuid(),
      title: "Harry Potter and the Sorcerer's Stone",
      isbn: "9780590353427",
      authorId: authors[1]?.id || uuid(),
      category: "Fantasy",
      publicationDate: "1997-06-26",
      totalCopies: 10,
      availableCopies: 10,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuid(),
      title: "The Old Man and the Sea",
      isbn: "9780684801223",
      authorId: authors[2]?.id || uuid(),
      category: "Fiction",
      publicationDate: "1952-09-01",
      totalCopies: 3,
      availableCopies: 3,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
  ];

  await knex("books").insert(books);
}
