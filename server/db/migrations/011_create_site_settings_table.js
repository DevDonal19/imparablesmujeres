export const up = async (knex) => {
  await knex.schema.createTable('site_settings', (table) => {
    table.increments('id').primary();
    table.string('site_name', 191).notNullable();
    table.text('site_description').notNullable();
    table.string('contact_email', 191).notNullable();

    table.string('social_facebook', 191);
    table.string('social_instagram', 191);
    table.string('social_tiktok', 191);
    table.string('social_whatsapp', 191);

    table.boolean('enable_comments').notNullable().defaultTo(true);
    table.boolean('enable_newsletter').notNullable().defaultTo(true);
    table.boolean('enable_notifications').notNullable().defaultTo(true);
    table.boolean('maintenance_mode').notNullable().defaultTo(false);

    table
      .enum('site_status', ['active', 'maintenance'])
      .notNullable()
      .defaultTo('active');
    table.string('site_version', 50).notNullable().defaultTo('v1.0.0');

    table.timestamps(true, true);
  });

  await knex('site_settings').insert({
    site_name: 'Imparables',
    site_description: 'Mujeres que transforman el mundo desde el Pacífico colombiano',
    contact_email: 'contacto@imparables.com',
    social_facebook: 'https://facebook.com/imparables',
    social_instagram: 'https://instagram.com/imparables',
    social_tiktok: 'https://tiktok.com/@imparables',
    social_whatsapp: 'https://wa.me/573000000000',
    enable_comments: true,
    enable_newsletter: true,
    enable_notifications: true,
    maintenance_mode: false,
    site_status: 'active',
    site_version: 'v1.0.0',
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('site_settings');
};
