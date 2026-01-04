-- Renombrar base de datos de imparableok a imparable
-- Ejecutar: mysql -u root -p < server/rename_database.sql

-- Eliminar base de datos antigua si existe
DROP DATABASE IF EXISTS imparable;

-- Renombrar (MySQL no tiene RENAME DATABASE, así que creamos nueva y copiamos)
CREATE DATABASE imparable CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Copiar todas las tablas
-- Nota: Esto se hace mejor con mysqldump, pero aquí está la alternativa simple
RENAME TABLE imparableok.categories TO imparable.categories;
RENAME TABLE imparableok.comments TO imparable.comments;
RENAME TABLE imparableok.contacts TO imparable.contacts;
RENAME TABLE imparableok.knex_migrations TO imparable.knex_migrations;
RENAME TABLE imparableok.knex_migrations_lock TO imparable.knex_migrations_lock;
RENAME TABLE imparableok.posts TO imparable.posts;
RENAME TABLE imparableok.reactions TO imparable.reactions;
RENAME TABLE imparableok.site_sections TO imparable.site_sections;
RENAME TABLE imparableok.users TO imparable.users;

-- Eliminar base de datos antigua
DROP DATABASE IF EXISTS imparableok;

SELECT 'Base de datos renombrada exitosamente a imparable' AS mensaje;
