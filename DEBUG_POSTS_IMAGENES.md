# 🔍 Debug: Posts, Imágenes y Modal de Edición

## 🎯 **Problemas a Verificar**

1. **Imagen del post no se muestra**
2. **Modal de edición no carga la información**

---

## 📋 **Pasos para Diagnosticar**

### **1. Verificar Datos en la Base de Datos**

```sql
-- Conectar a MySQL
mysql -u root -p imparableok

-- Ver estructura de la tabla posts
DESCRIBE posts;

-- Ver un post específico con todos sus campos
SELECT id, title, content, image, author, views 
FROM posts 
LIMIT 1;
```

**Verificar:**
- ✅ La columna `content` existe y tiene datos
- ✅ La columna `image` existe y tiene una URL válida
- ✅ La columna `author` existe
- ✅ La columna `views` existe

---

### **2. Verificar en el Navegador (Consola)**

**Paso 1: Ver un Post**
1. Ir a un post individual (ej: `/blog/1`)
2. Abrir DevTools (F12) → Console
3. Buscar estos logs:

```
📰 Post cargado: { id: 1, title: "...", content: "...", image: "...", ... }
🖼️ URL de imagen: http://localhost:4000/uploads/...
📝 Contenido: Este es el contenido...
```

**Si NO aparece la imagen:**
- Buscar: `❌ Error cargando imagen: [URL]`
- Copiar la URL y pegarla en el navegador
- Ver si la imagen existe

**Si aparece la imagen:**
- Buscar: `✅ Imagen cargada: [URL]`

---

### **3. Verificar Modal de Edición**

**Paso 1: Abrir el Modal**
1. Ir a Panel Admin → Publicaciones
2. Click en el botón de editar (lápiz) de cualquier post
3. Abrir DevTools (F12) → Console
4. Buscar estos logs:

```
📝 Abriendo editor con post: { id: 1, title: "...", content: "...", image: "...", ... }
📋 Draft creado: { title: "...", excerpt: "...", content: "...", image: "...", ... }
```

**Verificar:**
- ✅ El objeto `post` tiene todos los campos
- ✅ El objeto `draft` tiene todos los campos copiados
- ✅ Los campos del formulario se llenan

---

## 🔧 **Posibles Problemas y Soluciones**

### **Problema 1: Imagen es NULL en la BD**

**Síntoma:**
```
🖼️ URL de imagen: null
```

**Solución:**
```sql
-- Actualizar el post con una imagen de prueba
UPDATE posts 
SET image = 'http://localhost:4000/uploads/1764841305464.png'
WHERE id = 1;
```

---

### **Problema 2: Contenido es NULL en la BD**

**Síntoma:**
```
📝 Contenido: null
```

**Solución:**
```sql
-- Actualizar el post con contenido
UPDATE posts 
SET content = '<p>Este es el contenido del post.</p>'
WHERE id = 1;
```

---

### **Problema 3: URL de Imagen Incorrecta**

**Síntoma:**
```
❌ Error cargando imagen: http://localhost:4000/uploads/imagen-que-no-existe.png
```

**Solución:**
1. Verificar que la imagen existe en `server/uploads/`
2. Usar una URL válida:
   - Imagen local: `http://localhost:4000/uploads/nombre.png`
   - Imagen externa: `https://ejemplo.com/imagen.jpg`

---

### **Problema 4: Modal No Carga Datos**

**Síntoma:**
```
📝 Abriendo editor con post: { id: 1, title: "...", content: null, image: null }
```

**Causa:** El backend no está retornando `content` e `image`

**Solución:** Verificar que el modelo de posts incluye estos campos:

```javascript
// server/models/posts.js
.select('id', 'title', 'category', 'publish_date as date', 
        'excerpt', 'content', 'image', 'author', 'views',  // ✅ Estos campos
        'author_id', 'created_at', 'updated_at')
```

---

## 🧪 **Prueba Completa**

### **Crear un Post de Prueba Completo:**

```sql
USE imparableok;

-- Insertar post de prueba con TODOS los campos
INSERT INTO posts (id, title, excerpt, content, image, author, category, publish_date, views, created_at)
VALUES (
  UUID(),
  'Post de Prueba',
  'Este es el resumen del post de prueba',
  '<p>Este es el <strong>contenido completo</strong> del post de prueba.</p><p>Con múltiples párrafos.</p>',
  'https://picsum.photos/800/400',
  'Equipo Imparables',
  'Noticias',
  CURDATE(),
  0,
  NOW()
);

-- Verificar que se creó
SELECT * FROM posts ORDER BY created_at DESC LIMIT 1;
```

---

## 📊 **Checklist de Verificación**

### **Base de Datos:**
- [ ] Tabla `posts` tiene columna `content`
- [ ] Tabla `posts` tiene columna `image`
- [ ] Tabla `posts` tiene columna `author`
- [ ] Tabla `posts` tiene columna `views`
- [ ] Al menos un post tiene `content` con datos
- [ ] Al menos un post tiene `image` con URL válida

### **Backend:**
- [ ] `server/models/posts.js` selecciona `content`, `image`, `author`, `views`
- [ ] Servidor corriendo sin errores
- [ ] Endpoint `/api/posts/:id` retorna todos los campos

### **Frontend:**
- [ ] Console muestra: `📰 Post cargado: {...}`
- [ ] Console muestra: `🖼️ URL de imagen: [URL válida]`
- [ ] Console muestra: `📝 Contenido: [texto]`
- [ ] Imagen se carga: `✅ Imagen cargada`
- [ ] Modal muestra: `📝 Abriendo editor con post: {...}`
- [ ] Modal muestra: `📋 Draft creado: {...}`

---

## 🚀 **Comandos Útiles**

### **Ver logs del servidor:**
```bash
# En la terminal donde corre el servidor
# Buscar errores o warnings
```

### **Probar endpoint directamente:**
```bash
# Ver un post específico
curl http://localhost:4000/api/posts/1

# Debería retornar:
{
  "id": 1,
  "title": "...",
  "content": "...",
  "image": "...",
  "author": "...",
  "views": 0,
  ...
}
```

---

## 📝 **Reportar el Problema**

Si después de verificar todo sigue sin funcionar, copia y pega:

1. **Logs de la consola del navegador** (al ver un post)
2. **Logs de la consola del navegador** (al abrir modal de edición)
3. **Resultado de este query:**
```sql
SELECT id, title, content, image, author FROM posts LIMIT 1;
```

---

**¡Con estos logs podré identificar exactamente dónde está el problema!** 🔍
