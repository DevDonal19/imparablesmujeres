-- Script para resetear la base de datos Imparables
-- ADVERTENCIA: Esto eliminará TODOS los datos

-- Eliminar tablas en orden correcto (respetando foreign keys)
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS site_sections;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS users;

-- Limpiar tabla de migraciones para empezar desde cero
DELETE FROM knex_migrations;
DELETE FROM knex_migrations_lock;

-- Mensaje de confirmación
SELECT 'Base de datos reseteada. Ejecuta: npm run migrate' AS mensaje;
