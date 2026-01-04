-- Script para agregar tabla de testimonios a la base de datos existente
-- Ejecutar: mysql -u root -p imparable < server/add_testimonials.sql

USE imparable;

-- Crear tabla de testimonios
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas rápidas de testimonios aprobados
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved, created_at);

-- Mensaje de confirmación
SELECT 'Tabla testimonials creada exitosamente' AS mensaje;
SELECT COUNT(*) AS total_testimonials FROM testimonials;
