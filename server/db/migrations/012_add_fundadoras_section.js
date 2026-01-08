export async function up(knex) {
  // Verificar si la sección ya existe
  const existing = await knex('site_sections').where({ section: 'fundadoras' }).first();
  
  if (!existing) {
    await knex('site_sections').insert({
      section: 'fundadoras',
      content: JSON.stringify({
        title: 'Fundadoras',
        subtitle: 'Juntas sostienen una plataforma donde la memoria, el arte y la incidencia política se encuentran para ofrecer oportunidades reales a las mujeres que habitan el Pacífico colombiano.',
        fundadoras: [
          {
            name: 'Maria Camila Chaverra',
            role: 'Impulsa los procesos de comunicación y narrativas digitales.',
            image: '/images/fundadoras/maria-camila.jpg',
          },
          {
            name: 'Teresa Moreno',
            role: 'Lidera la formación en justicia de género y la articulación con liderazgos comunitarios.',
            image: '/images/fundadoras/teresa.jpg',
          },
          {
            name: 'Jessica Mosquera',
            role: 'Acompaña los procesos psicojurídicos y las redes de cuidado.',
            image: '/images/fundadoras/jessica.jpg',
          },
          {
            name: 'Mayra Lemus',
            role: 'Dinamiza los laboratorios creativos para niñas y adolescentes.',
            image: '/images/fundadoras/mayra.jpg',
          },
        ],
      }),
    });
  }
}

export async function down(knex) {
  await knex('site_sections').where({ section: 'fundadoras' }).delete();
}
