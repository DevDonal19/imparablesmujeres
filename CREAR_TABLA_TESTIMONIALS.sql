-- Ejecutar este script en MySQL Workbench o desde la terminal
-- Terminal: mysql -u root -p imparable < CREAR_TABLA_TESTIMONIALS.sql

USE imparable;

-- Eliminar tabla si existe (para empezar limpio)
DROP TABLE IF EXISTS testimonials;

-- Crear tabla de testimonios
CREATE TABLE testimonials (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice
CREATE INDEX idx_testimonials_approved ON testimonials(approved, created_at);

-- Insertar algunos testimonios de ejemplo
INSERT INTO testimonials (id, name, message, approved) VALUES
(UUID(), 'María González', 'Imparables cambió mi vida. Aprendí a valorar mi voz y mis derechos.', TRUE),
(UUID(), 'Sofía Ramírez', 'Gracias a esta organización encontré mi propósito y mi fuerza.', TRUE),
(UUID(), 'Alejandra Torres', 'Nuestros cuerpos son territorios de dignidad. Imparables me enseñó a cuidarlo.', TRUE);

-- Verificar que se creó correctamente
SELECT 'Tabla testimonials creada exitosamente' AS resultado;
SELECT COUNT(*) AS total_testimonials FROM testimonials;
SELECT * FROM testimonials;
