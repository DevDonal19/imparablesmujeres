export async function up(knex) {
  const hasRole = await knex.schema.hasColumn('users', 'role');
  
  if (!hasRole) {
    await knex.schema.table('users', (table) => {
      table.string('role', 50).defaultTo('editor').notNullable();
    });
    
    // Actualizar el usuario admin existente
    await knex('users')
      .where({ email: process.env.ADMIN_EMAIL || 'editor@imparables.com' })
      .update({ role: 'admin' });
  }
}

export async function down(knex) {
  const hasRole = await knex.schema.hasColumn('users', 'role');
  
  if (hasRole) {
    await knex.schema.table('users', (table) => {
      table.dropColumn('role');
    });
  }
}
