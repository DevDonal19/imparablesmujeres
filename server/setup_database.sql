-- Script para crear base de datos nueva desde cero
-- Ejecutar: mysql -u root -p < server/setup_database.sql

-- Eliminar base de datos anterior si existe
DROP DATABASE IF EXISTS imparable;

-- Crear base de datos nueva
CREATE DATABASE imparable CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE imparable;

-- Mensaje de confirmación
SELECT 'Base de datos creada exitosamente. Ahora ejecuta: npm run migrate' AS mensaje;
