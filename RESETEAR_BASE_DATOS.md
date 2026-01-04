# 🔧 Resetear Base de Datos

## Problema Detectado

Las migraciones estaban en dos directorios diferentes:
- `server/migrations/` (antiguo)
- `server/db/migrations/` (nuevo)

Esto causó que:
1. La tabla `users` no se creó correctamente
2. El usuario admin no existe
3. Las credenciales no funcionan

## Solución

### Opción 1: Resetear manualmente en MySQL

```sql
-- 1. Conectar a MySQL
mysql -u root -p

-- 2. Usar la base de datos
USE imparable;

-- 3. Ver tablas actuales
SHOW TABLES;

-- 4. Eliminar tabla de migraciones
DROP TABLE IF EXISTS knex_migrations;
DROP TABLE IF EXISTS knex_migrations_lock;

-- 5. Eliminar todas las tablas (CUIDADO: esto borra todos los datos)
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS site_sections;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS users;

-- 6. Salir
EXIT;
```

### Opción 2: Recrear la base de datos completa

```sql
-- 1. Conectar a MySQL
mysql -u root -p

-- 2. Eliminar base de datos
DROP DATABASE IF EXISTS imparable;

-- 3. Crear base de datos nueva
CREATE DATABASE imparable CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Salir
EXIT;
```

### Después de resetear:

```bash
# 1. Ejecutar migraciones
npm run migrate

# 2. Verificar que se crearon las tablas
# Debería mostrar:
# - Batch 1 run: 9 migrations
```

## Credenciales del Admin

Después de ejecutar las migraciones, el usuario admin se creará automáticamente con:

**Email:** `editor@imparables.com`  
**Contraseña:** `Imparable2025!`

## Verificar que funciona

1. Iniciar servidor: `npm run dev`
2. Ir a: `http://localhost:5173/admin/login`
3. Ingresar credenciales
4. ✅ Debe iniciar sesión correctamente

## Archivos Corregidos

1. ✅ `server/knexfile.cjs` - Apunta a `db/migrations`
2. ✅ `server/db/migrations/001_create_users_table.js` - Creada
3. ✅ `server/db/migrations/002_create_posts_table.js` - Creada

## Orden de Migraciones

1. `001_create_users_table.js`
2. `002_create_posts_table.js`
3. `003_create_contacts_table.js`
4. `004_add_role_to_users.js` ⚠️ ELIMINAR (ya incluido en 001)
5. `005_add_content_to_posts.js`
6. `006_create_comments_table.js`
7. `007_create_reactions_table.js`
8. `008_create_categories_table.js`
9. `009_create_site_sections_table.js`

## Migración 004 Redundante

La migración `004_add_role_to_users.js` es redundante porque la tabla `users` ya se crea con el campo `role` en la migración `001`.

Necesitamos eliminarla o modificarla.
