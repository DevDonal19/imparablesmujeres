export async function up(knex) {
  await knex.schema.createTable('reactions', (table) => {
    table.increments('id').primary();
    table.uuid('postId').notNullable();
    table.string('type', 50).notNullable(); // like, love, celebrate, support, insightful
    table.string('userIdentifier', 255).notNullable(); // IP o cookie para evitar duplicados
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    
    table.foreign('postId').references('posts.id').onDelete('CASCADE');
    table.unique(['postId', 'userIdentifier', 'type']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('reactions');
}
