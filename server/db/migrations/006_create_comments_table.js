export async function up(knex) {
  await knex.schema.createTable('comments', (table) => {
    table.increments('id').primary();
    table.uuid('postId').notNullable();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.text('content').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.boolean('approved').defaultTo(false);
    
    table.foreign('postId').references('posts.id').onDelete('CASCADE');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('comments');
}
