export async function up(knex) {
  await knex.schema.createTable("borrows", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("bookId").references("id").inTable("books").onDelete("CASCADE");
    table.uuid("userId").references("id").inTable("users").onDelete("CASCADE");
    table.date("borrowDate").notNullable();
    table.date("dueDate").notNullable();
    table.date("returnDate");
    table.enu("status", ["borrowed", "returned", "overdue"]).defaultTo("borrowed");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
};

export async function down(knex) {
  await knex.schema.dropTableIfExists("borrows");
};
