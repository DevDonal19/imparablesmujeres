-- Limpia testimonios que guardaron estilos CSS en la tabla
-- Ejecutar: mysql -u root -p imparableok < LIMPIAR_ESTILOS_TESTIMONIOS.sql

USE imparableok;

-- Eliminar cualquier rastro del bloque CSS inyectado accidentalmente
UPDATE testimonials
SET message = TRIM(BOTH '"' FROM TRIM(SUBSTRING_INDEX(message, '}}', -1)))
WHERE message LIKE '%position:absolute%' OR message LIKE '%}}%';

-- Verificar resultado
SELECT id, name, message FROM testimonials ORDER BY created_at DESC;
