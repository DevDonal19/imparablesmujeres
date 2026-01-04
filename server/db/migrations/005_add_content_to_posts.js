export async function up(knex) {
  await knex.schema.table('posts', (table) => {
    table.text('content').after('excerpt'); // Contenido completo del artículo
    table.string('author', 255).after('content').defaultTo('Equipo Imparables');
    table.integer('views').defaultTo(0);
  });
}

export async function down(knex) {
  await knex.schema.table('posts', (table) => {
    table.dropColumn('content');
    table.dropColumn('author');
    table.dropColumn('views');
  });
}
