# 🎯 Crear Base de Datos Nueva

## ✅ Problemas Arreglados

He corregido TODOS los errores en las migraciones:

1. ✅ `003_create_contacts_table.js` - Campo `respondidoAt` ahora es nullable
2. ✅ `006_create_comments_table.js` - Campo `postId` ahora es UUID (no integer)
3. ✅ `007_create_reactions_table.js` - Campo `postId` ahora es UUID (no integer)

## 🚀 Ejecuta Estos Comandos (Copia y Pega)

### **Paso 1: Crear Base de Datos Nueva**

```powershell
mysql -u root -p < server/setup_database.sql
```

Esto:
- ❌ Elimina la base de datos `imparable` anterior (si existe)
- ✅ Crea una base de datos `imparable` nueva y limpia
- ✅ Usa codificación UTF-8

### **Paso 2: Ejecutar Migraciones**

```powershell
npm run migrate
```

Deberías ver:
```
Batch 1 run: 9 migrations
✓ Usuario admin verificado (editor@imparables.com)
```

### **Paso 3: Iniciar Servidor**

```powershell
npm run dev
```

### **Paso 4: Probar Login**

1. Ir a: `http://localhost:5173/admin/login`
2. Ingresar:
   - **Email:** `editor@imparables.com`
   - **Contraseña:** `Imparable2025!`
3. ✅ Debe funcionar

---

## 📊 Tablas que se Crearán

1. ✅ **users** - Usuarios del sistema (con admin)
2. ✅ **posts** - Publicaciones del blog (ID = UUID)
3. ✅ **contacts** - Mensajes de contacto
4. ✅ **comments** - Comentarios de artículos (postId = UUID)
5. ✅ **reactions** - Reacciones a artículos (postId = UUID)
6. ✅ **categories** - Categorías del blog (5 predefinidas)
7. ✅ **site_sections** - Secciones del sitio (5 con contenido)

---

## 🔧 Datos Iniciales

### **Usuario Admin:**
```
Email: editor@imparables.com
Contraseña: Imparable2025!
Rol: admin
Estado: activo
```

### **Categorías:**
1. Innovación feminista (#9f3876)
2. Cultura viva (#bd1d82)
3. Comunidad (#f6a4fd)
4. Territorio (#2196f3)
5. Derechos (#4caf50)

### **Secciones:**
1. Hero (Inicio)
2. Historia
3. Misión
4. Visión
5. Servicios

---

## ⚠️ Si MySQL Pide Contraseña

Si al ejecutar el comando te pide contraseña y no tienes:
- Presiona **Enter** (sin escribir nada)

O si tienes contraseña de root:
- Escribe tu contraseña de MySQL

---

## 🎉 Resultado Final

Después de ejecutar los comandos tendrás:

✅ Base de datos limpia  
✅ Todas las tablas creadas correctamente  
✅ Usuario admin listo  
✅ 5 categorías predefinidas  
✅ 5 secciones con contenido inicial  
✅ Sistema completo funcionando  

---

## 📝 Archivos Creados/Modificados

**Nuevos:**
- ✅ `server/setup_database.sql` - Script para crear BD nueva

**Arreglados:**
- ✅ `server/db/migrations/003_create_contacts_table.js`
- ✅ `server/db/migrations/006_create_comments_table.js`
- ✅ `server/db/migrations/007_create_reactions_table.js`

---

## 🔍 Verificar que Funcionó

```sql
mysql -u root -p
USE imparable;
SHOW TABLES;
```

Deberías ver 9 tablas:
```
categories
comments
contacts
knex_migrations
knex_migrations_lock
posts
reactions
site_sections
users
```

---

**¡Ejecuta los comandos y todo debería funcionar perfectamente!** 🚀
