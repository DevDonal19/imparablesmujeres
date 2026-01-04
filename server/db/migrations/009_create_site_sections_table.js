export async function up(knex) {
  await knex.schema.createTable('site_sections', (table) => {
    table.increments('id').primary();
    table.string('section', 50).notNullable().unique(); // hero, historia, mision, vision, servicios
    table.json('content').notNullable(); // Contenido en formato JSON
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // Insertar secciones por defecto
  await knex('site_sections').insert([
    {
      section: 'hero',
      content: JSON.stringify({
        title: 'Imparables',
        subtitle: 'Mujeres que transforman el mundo desde el Pacífico colombiano',
        description: 'Somos una organización que impulsa la innovación feminista, la cultura viva y el fortalecimiento comunitario en el Pacífico colombiano.',
        buttonText: 'Conoce más',
        buttonLink: '#historia',
        image: '/images/hero-doll.png',
      }),
    },
    {
      section: 'historia',
      content: JSON.stringify({
        title: 'Nuestra Historia',
        cards: [
          {
            title: 'Nuestro Origen',
            content: 'Imparables nace en el Pacífico colombiano como respuesta a la necesidad de visibilizar y fortalecer el trabajo de las mujeres en sus territorios. Desde 2020, hemos trabajado incansablemente para crear espacios de encuentro, formación y transformación social.',
          },
          {
            title: 'Nuestras Fundadoras',
            content: 'Un grupo de mujeres líderes del Pacífico que decidieron unir fuerzas para crear cambios significativos en sus comunidades. Con experiencia en derechos humanos, cultura, educación y emprendimiento, construimos esta red de apoyo mutuo.',
          },
        ],
      }),
    },
    {
      section: 'mision',
      content: JSON.stringify({
        title: 'Misión',
        content: 'Fortalecer las capacidades de las mujeres del Pacífico colombiano a través de la innovación feminista, promoviendo su liderazgo, autonomía económica y participación activa en la construcción de paz y desarrollo territorial.',
        icon: 'target',
      }),
    },
    {
      section: 'vision',
      content: JSON.stringify({
        title: 'Visión',
        content: 'Ser reconocidas como la principal red de mujeres líderes del Pacífico colombiano, referentes en innovación feminista y transformación social, donde cada mujer sea protagonista de su propio desarrollo y el de su comunidad.',
        quote: 'Ser Imparable es recordar que nuestras ancestras caminan con nosotras cada vez que alzamos la voz.',
        icon: 'vision',
      }),
    },
    {
      section: 'servicios',
      content: JSON.stringify({
        title: 'Nuestros Programas',
        services: [
          {
            title: 'Escuela de Liderazgo Feminista',
            description: 'Formación integral para mujeres líderes del Pacífico',
            items: [
              'Talleres de liderazgo y empoderamiento',
              'Formación en derechos humanos',
              'Desarrollo de habilidades de comunicación',
              'Construcción de redes de apoyo',
            ],
            color: '#9f3876',
          },
          {
            title: 'Innovación y Emprendimiento',
            description: 'Impulso a iniciativas económicas lideradas por mujeres',
            items: [
              'Asesoría para emprendimientos',
              'Acceso a microcréditos',
              'Formación en gestión empresarial',
              'Comercialización de productos',
            ],
            color: '#bd1d82',
          },
          {
            title: 'Cultura Viva Comunitaria',
            description: 'Fortalecimiento de expresiones culturales del territorio',
            items: [
              'Festivales culturales',
              'Talleres de artes y oficios',
              'Recuperación de saberes ancestrales',
              'Espacios de creación colectiva',
            ],
            color: '#f6a4fd',
          },
        ],
      }),
    },
  ]);
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('site_sections');
}
