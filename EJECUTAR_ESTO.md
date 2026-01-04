# 🚀 EJECUTA ESTOS COMANDOS

## Problema: Error en migración de contacts

El campo `respondidoAt` causaba error. **Ya está arreglado.**

## Solución Rápida (Copia y pega en PowerShell):

### Opción 1: Resetear con MySQL

```powershell
# 1. Ejecutar script SQL
mysql -u root -p imparable < server/reset_database.sql

# 2. Ejecutar migraciones
npm run migrate
```

### Opción 2: Resetear manualmente

```powershell
# 1. Conectar a MySQL
mysql -u root -p

# 2. Dentro de MySQL, ejecutar:
```

```sql
USE imparable;

-- Eliminar tablas
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS site_sections;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS users;

-- Limpiar migraciones
DELETE FROM knex_migrations;
DELETE FROM knex_migrations_lock;

EXIT;
```

```powershell
# 3. Ejecutar migraciones
npm run migrate
```

## ✅ Resultado Esperado

```
Batch 1 run: 9 migrations
```

Esto creará:
- ✅ users (con admin)
- ✅ posts
- ✅ contacts (ARREGLADO)
- ✅ comments
- ✅ reactions
- ✅ categories
- ✅ site_sections

## 🔐 Luego Prueba el Login

```
Email: editor@imparables.com
Contraseña: Imparable2025!
```

## ⚠️ Si aún falla

Ejecuta esto para ver el error exacto:

```powershell
npm run migrate
```

Y copia el error completo.
