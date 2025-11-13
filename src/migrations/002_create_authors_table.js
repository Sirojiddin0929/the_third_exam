export async function up(knex) {
  await knex.schema.createTable("authors", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.text("biography");
    table.date("dateOfBirth");
    table.string("nationality");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
};

export async function down(knex) {
  await knex.schema.dropTableIfExists("authors");
};
