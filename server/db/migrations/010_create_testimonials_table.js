export const up = async (knex) => {
  await knex.schema.createTable('testimonials', (table) => {
    table.uuid('id').primary();
    table.string('name', 191).notNullable();
    table.text('message').notNullable();
    table.boolean('approved').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('testimonials');
};
