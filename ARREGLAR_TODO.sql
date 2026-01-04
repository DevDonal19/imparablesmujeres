-- Script completo para arreglar testimonios e imágenes
-- Ejecutar: mysql -u root -p imparableok < ARREGLAR_TODO.sql

USE imparableok;

-- ==========================================
-- 1. LIMPIAR TESTIMONIOS (QUITAR HTML)
-- ==========================================

SELECT '=== LIMPIANDO TESTIMONIOS ===' AS paso;

-- Ver testimonios actuales con HTML
SELECT id, name, LEFT(message, 100) as mensaje_con_html FROM testimonials;

-- Eliminar todos los testimonios
TRUNCATE TABLE testimonials;

-- Insertar testimonios limpios (SIN HTML)
INSERT INTO testimonials (id, name, message, approved, created_at) VALUES
('testimonio-1', 'María González', 'Imparables cambió mi vida. Aprendí a valorar mi voz y mis derechos.', TRUE, NOW()),
('testimonio-2', 'Sofía Ramírez', 'Gracias a esta organización encontré mi propósito y mi fuerza.', TRUE, NOW()),
('testimonio-3', 'Alejandra Torres', 'Nuestros cuerpos son territorios de dignidad. Imparables me enseñó a cuidarlo.', TRUE, NOW()),
('testimonio-4', 'Carolina Pérez', 'Encontré en Imparables un espacio seguro donde mi voz importa.', TRUE, NOW());

SELECT '✅ Testimonios limpiados' AS resultado;
SELECT id, name, message, approved FROM testimonials;

-- ==========================================
-- 2. VERIFICAR Y ARREGLAR POSTS
-- ==========================================

SELECT '=== VERIFICANDO POSTS ===' AS paso;

-- Ver posts actuales
SELECT id, title, 
       CASE WHEN image IS NULL THEN '❌ NULL' 
            WHEN image = '' THEN '❌ VACÍO' 
            ELSE CONCAT('✅ ', LEFT(image, 50)) 
       END as estado_imagen,
       CASE WHEN content IS NULL THEN '❌ NULL' 
            WHEN content = '' THEN '❌ VACÍO' 
            ELSE CONCAT('✅ ', LEFT(content, 30)) 
       END as estado_contenido
FROM posts 
ORDER BY created_at DESC 
LIMIT 5;

-- Actualizar posts sin imagen con una imagen de ejemplo
UPDATE posts 
SET image = 'https://picsum.photos/800/400' 
WHERE image IS NULL OR image = '';

SELECT '✅ Posts actualizados con imágenes de ejemplo' AS resultado;

-- ==========================================
-- 3. VERIFICACIÓN FINAL
-- ==========================================

SELECT '=== VERIFICACIÓN FINAL ===' AS paso;

SELECT 'TESTIMONIOS:' AS tipo, COUNT(*) as total FROM testimonials WHERE approved = TRUE
UNION ALL
SELECT 'POSTS CON IMAGEN:', COUNT(*) FROM posts WHERE image IS NOT NULL AND image != ''
UNION ALL
SELECT 'POSTS CON CONTENIDO:', COUNT(*) FROM posts WHERE content IS NOT NULL AND content != '';

-- Mostrar un post de ejemplo
SELECT '=== POST DE EJEMPLO ===' AS info;
SELECT id, title, image, LEFT(content, 100) as contenido_preview, author, views
FROM posts 
ORDER BY created_at DESC 
LIMIT 1;

SELECT '=== ✅ SCRIPT COMPLETADO ===' AS resultado;
