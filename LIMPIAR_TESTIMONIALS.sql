-- Limpiar y recrear testimonials con datos correctos
-- Ejecutar: mysql -u root -p imparableok < LIMPIAR_TESTIMONIALS.sql

USE imparableok;

-- Eliminar todos los testimonios actuales
TRUNCATE TABLE testimonials;

-- Insertar testimonios limpios (sin HTML)
INSERT INTO testimonials (id, name, message, approved, created_at) VALUES
('test-testimonio-1', 'María González', 'Imparables cambió mi vida. Aprendí a valorar mi voz y mis derechos.', TRUE, NOW()),
('test-testimonio-2', 'Sofía Ramírez', 'Gracias a esta organización encontré mi propósito y mi fuerza.', TRUE, NOW()),
('test-testimonio-3', 'Alejandra Torres', 'Nuestros cuerpos son territorios de dignidad. Imparables me enseñó a cuidarlo.', TRUE, NOW());

-- Verificar
SELECT '=== TESTIMONIOS LIMPIOS ===' AS resultado;
SELECT id, name, LEFT(message, 50) as mensaje_preview, approved FROM testimonials;
