export async function up(knex) {
  await knex.schema.createTable('contacts', (table) => {
    table.increments('id').primary();
    table.string('nombre', 255).notNullable();
    table.string('correo', 255).notNullable();
    table.text('mensaje').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.boolean('leido').defaultTo(false);
    table.text('respuesta').nullable();
    table.timestamp('respondidoAt').nullable();
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('contacts');
}
