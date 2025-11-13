import knex from "knex";
import config from "../../knexfile.js";

const db = knex(config.development);

db.raw("SELECT 1")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

export default db;

