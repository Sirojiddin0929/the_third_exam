import { v4 as uuid } from "uuid";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  
  await knex("authors").del();

  const authors = [
    {
      id: uuid(),
      firstName: "George",
      lastName: "Orwell",
      biography: "George Orwell was an English novelist, essayist, journalist and critic.",
      dateOfBirth: "1903-06-25",
      nationality: "British",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuid(),
      firstName: "J.K.",
      lastName: "Rowling",
      biography: "British author, best known for the Harry Potter fantasy series.",
      dateOfBirth: "1965-07-31",
      nationality: "British",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuid(),
      firstName: "Ernest",
      lastName: "Hemingway",
      biography: "American novelist, short-story writer, and journalist.",
      dateOfBirth: "1899-07-21",
      nationality: "American",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    }
  ];

  await knex("authors").insert(authors);
}
