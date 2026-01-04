export async function up(knex) {
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable().unique();
    table.string('slug', 100).notNullable().unique();
    table.string('color', 20).defaultTo('#9f3876');
    table.text('description');
    table.integer('postCount').defaultTo(0);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

  // Insertar categorías por defecto
  await knex('categories').insert([
    { name: 'Innovación feminista', slug: 'innovacion-feminista', color: '#9f3876' },
    { name: 'Cultura viva', slug: 'cultura-viva', color: '#bd1d82' },
    { name: 'Comunidad', slug: 'comunidad', color: '#f6a4fd' },
    { name: 'Territorio', slug: 'territorio', color: '#2196f3' },
    { name: 'Derechos', slug: 'derechos', color: '#4caf50' },
  ]);
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('categories');
}
