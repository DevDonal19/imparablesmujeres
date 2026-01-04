-- Script para verificar la tabla testimonials
-- Ejecutar: mysql -u root -p < VERIFICAR_TESTIMONIALS.sql

-- Verificar en la base de datos correcta
USE imparableok;

-- Ver si la tabla existe
SHOW TABLES LIKE 'testimonials';

-- Ver estructura de la tabla
DESCRIBE testimonials;

-- Ver contenido
SELECT * FROM testimonials;

-- Si la tabla NO existe, crearla:
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved, created_at);

-- Insertar testimonios de ejemplo si la tabla está vacía
INSERT IGNORE INTO testimonials (id, name, message, approved) VALUES
(UUID(), 'María González', 'Imparables cambió mi vida. Aprendí a valorar mi voz y mis derechos.', TRUE),
(UUID(), 'Sofía Ramírez', 'Gracias a esta organización encontré mi propósito y mi fuerza.', TRUE),
(UUID(), 'Alejandra Torres', 'Nuestros cuerpos son territorios de dignidad. Imparables me enseñó a cuidarlo.', TRUE);

SELECT 'Verificación completa' AS resultado;
SELECT COUNT(*) AS total FROM testimonials;
