# 🔐 Solución: Credenciales Incorrectas

## ❌ Problema

Al intentar iniciar sesión con:
- **Email:** `editor@imparables.com`
- **Contraseña:** `Imparable2025!`

Aparece el error: **"Credenciales inválidas"**

## 🔍 Causa del Problema

Las migraciones estaban en dos directorios diferentes:
- `server/migrations/` (antiguo) ← Aquí estaban las migraciones de `users` y `posts`
- `server/db/migrations/` (nuevo) ← Aquí están las migraciones nuevas

El archivo `knexfile.cjs` apuntaba al directorio antiguo, pero las nuevas migraciones se crearon en el nuevo directorio.

**Resultado:**
- La tabla `users` nunca se creó
- El usuario admin no existe
- Por eso las credenciales no funcionan

## ✅ Solución (3 Pasos)

### **Paso 1: Resetear la Base de Datos**

Abre MySQL y ejecuta:

```sql
mysql -u root -p
```

Luego ejecuta el script de reset:

```sql
USE imparable;

-- Eliminar todas las tablas
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS site_sections;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS knex_migrations_lock;
DROP TABLE IF EXISTS knex_migrations;

EXIT;
```

**O más fácil:** Ejecuta el archivo SQL que creé:

```bash
mysql -u root -p imparable < server/reset_database.sql
```

### **Paso 2: Ejecutar Migraciones**

```bash
npm run migrate
```

**Deberías ver:**
```
Batch 1 run: 9 migrations
```

Esto creará:
1. ✅ Tabla `users` con campo `active` y `role`
2. ✅ Tabla `posts`
3. ✅ Tabla `contacts`
4. ✅ Tabla `comments`
5. ✅ Tabla `reactions`
6. ✅ Tabla `categories` con 5 categorías predefinidas
7. ✅ Tabla `site_sections` con contenido inicial
8. ✅ Usuario admin automáticamente

### **Paso 3: Iniciar Servidor y Probar**

```bash
npm run dev
```

Luego:
1. Ir a `http://localhost:5173/admin/login`
2. Ingresar credenciales:
   - **Email:** `editor@imparables.com`
   - **Contraseña:** `Imparable2025!`
3. ✅ Debe iniciar sesión correctamente

---

## 🔧 Cambios Realizados

### **1. Archivos Creados:**
- `server/db/migrations/001_create_users_table.js` ✅
- `server/db/migrations/002_create_posts_table.js` ✅
- `server/reset_database.sql` ✅

### **2. Archivos Modificados:**
- `server/knexfile.cjs` - Ahora apunta a `db/migrations` ✅

### **3. Estructura de la Tabla `users`:**

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) UNIQUE NOT NULL,
  password_hash VARCHAR(191) NOT NULL,
  display_name VARCHAR(191) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'editor' NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Campos importantes:**
- `active` - Debe ser `true` para poder iniciar sesión
- `role` - Puede ser `admin` o `editor`
- `password_hash` - Contraseña hasheada con bcrypt

---

## 🧪 Verificar que Todo Funciona

### **1. Verificar que las tablas existen:**

```sql
mysql -u root -p
USE imparable;
SHOW TABLES;
```

**Deberías ver:**
```
+---------------------+
| Tables_in_imparable |
+---------------------+
| categories          |
| comments            |
| contacts            |
| knex_migrations     |
| knex_migrations_lock|
| posts               |
| reactions           |
| site_sections       |
| users               |
+---------------------+
```

### **2. Verificar que el usuario admin existe:**

```sql
SELECT id, email, display_name, role, active FROM users;
```

**Deberías ver:**
```
+----+------------------------+-------------------+-------+--------+
| id | email                  | display_name      | role  | active |
+----+------------------------+-------------------+-------+--------+
|  1 | editor@imparables.com  | Editora Imparable | admin |      1 |
+----+------------------------+-------------------+-------+--------+
```

### **3. Verificar que las categorías existen:**

```sql
SELECT name, color FROM categories;
```

**Deberías ver:**
```
+---------------------+---------+
| name                | color   |
+---------------------+---------+
| Innovación feminista| #9f3876 |
| Cultura viva        | #bd1d82 |
| Comunidad           | #f6a4fd |
| Territorio          | #2196f3 |
| Derechos            | #4caf50 |
+---------------------+---------+
```

### **4. Verificar que las secciones existen:**

```sql
SELECT section FROM site_sections;
```

**Deberías ver:**
```
+-----------+
| section   |
+-----------+
| hero      |
| historia  |
| mision    |
| vision    |
| servicios |
+-----------+
```

---

## 🎯 Credenciales Finales

Después de seguir todos los pasos:

**Email:** `editor@imparables.com`  
**Contraseña:** `Imparable2025!`  
**Rol:** Administrador  
**Estado:** Activo  

---

## ⚠️ Si Aún No Funciona

### **Debug 1: Verificar que el servidor está corriendo**

```bash
# Terminal 1: Backend
cd server
node index.js

# Deberías ver:
# ✓ Usuario admin verificado (editor@imparables.com)
# API de Imparables escuchando en http://localhost:4000
```

### **Debug 2: Verificar el hash de la contraseña**

El problema podría ser que la contraseña no se hasheó correctamente.

```sql
-- Ver el hash actual
SELECT email, password_hash FROM users WHERE email = 'editor@imparables.com';
```

Si el hash está vacío o es incorrecto, puedes actualizarlo manualmente:

```javascript
// En Node.js (o en el navegador console del servidor)
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('Imparable2025!', 10);
console.log(hash);
// Copia el hash y actualiza en MySQL
```

```sql
UPDATE users 
SET password_hash = 'HASH_COPIADO_AQUI' 
WHERE email = 'editor@imparables.com';
```

### **Debug 3: Verificar la respuesta del servidor**

Abre DevTools (F12) → Network → Intenta iniciar sesión

Busca la petición a `/api/auth/login`:
- **Status:** Debe ser `200 OK`
- **Response:** Debe contener `{ token: "...", user: {...} }`

Si es `401 Unauthorized`:
- El usuario no existe o la contraseña es incorrecta

Si es `500 Internal Server Error`:
- Hay un error en el servidor (ver consola del servidor)

---

## 📋 Resumen

1. ✅ Resetear base de datos (eliminar todas las tablas)
2. ✅ Ejecutar `npm run migrate`
3. ✅ Verificar que se crearon 9 migraciones
4. ✅ Verificar que existe el usuario admin
5. ✅ Iniciar servidor con `npm run dev`
6. ✅ Iniciar sesión con las credenciales

**¡Ahora debería funcionar correctamente!** 🎉
