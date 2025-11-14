import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  
  await knex("users").del();

  const users = [
    {
      id: uuid(),
      email: "oyosboyev@gmail.com",
      username: "Sirojiddin",
      password: await bcrypt.hash("123burl", 10),
      role: "user",
      status: "inactive",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuid(),
      email: "oyosboyevsirojiddin@gmail.com",
      username: "The Dark Lord",
      password: await bcrypt.hash("sirojiddin10", 10),
      role: "user",
      status: "inactive",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
    {
      id: uuid(),
      email: "oyosboyturgunov@gmail.com",
      username: "My grandfather",
      password: await bcrypt.hash("grand123", 10),
      role: "user",
      status: "inactive",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
  ];

  await knex("users").insert(users);
}

