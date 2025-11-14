export async function up(knex) {
  await knex.schema.createTable("books", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("title").notNullable();
    table.string("isbn").notNullable().unique();
    table.uuid("authorId").references("id").inTable("authors").onDelete("CASCADE");
    table.string("category");
    table.date("publicationDate");
    table.integer("totalCopies").defaultTo(1);
    table.integer("availableCopies").defaultTo(1);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
};

export async function down(knex) {
  await knex.schema.dropTableIfExists("books");
};
