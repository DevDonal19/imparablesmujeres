export const up = async (knex) => {
  await knex.schema.createTable('posts', (table) => {
    table.uuid('id').primary();
    table.string('title').notNullable();
    table.string('category').notNullable().defaultTo('General');
    table.date('publish_date').nullable();
    table.text('excerpt').notNullable();
    table.string('image').nullable();
    table.integer('author_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('posts');
};
