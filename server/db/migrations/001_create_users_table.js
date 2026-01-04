export const up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 191).notNullable().unique();
    table.string('password_hash', 191).notNullable();
    table.string('display_name', 191).notNullable();
    table.enum('role', ['admin', 'editor']).notNullable().defaultTo('editor');
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('users');
};
