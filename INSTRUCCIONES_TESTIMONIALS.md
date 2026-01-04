# 📋 Instrucciones para Agregar Tabla de Testimonios

## 🎯 **Opción 1: Agregar Solo la Tabla (Recomendado)**

Si ya tienes datos en la base de datos y NO quieres perderlos:

### **Paso 1: Ejecutar el script SQL**

```bash
# En la terminal, desde la raíz del proyecto:
mysql -u root -p imparable < server/add_testimonials.sql
```

Cuando te pida la contraseña, ingresa tu contraseña de MySQL.

### **Paso 2: Verificar que se creó**

```bash
mysql -u root -p imparable
```

Luego en MySQL:
```sql
SHOW TABLES;
DESCRIBE testimonials;
```

Deberías ver:
```
+-------------+--------------+------+-----+-------------------+
| Field       | Type         | Null | Key | Default           |
+-------------+--------------+------+-----+-------------------+
| id          | varchar(36)  | NO   | PRI | NULL              |
| name        | varchar(255) | NO   |     | NULL              |
| message     | text         | NO   |     | NULL              |
| approved    | tinyint(1)   | YES  | MUL | 0                 |
| created_at  | timestamp    | YES  |     | CURRENT_TIMESTAMP |
+-------------+--------------+------+-----+-------------------+
```

---

## 🔄 **Opción 2: Resetear Base de Datos Completa**

Si NO te importa perder los datos actuales:

### **Paso 1: Resetear la BD**

```bash
mysql -u root -p < server/reset_database.sql
```

### **Paso 2: Ejecutar migraciones**

```bash
npm run migrate
```

### **Paso 3: Ejecutar el script de testimonials**

```bash
mysql -u root -p imparable < server/add_testimonials.sql
```

---

## 🧪 **Verificar que Todo Funciona**

### **1. Iniciar el servidor**

```bash
cd server
npm run dev
```

### **2. Probar el endpoint**

En otra terminal:

```bash
# Obtener testimonios aprobados (público)
curl http://localhost:4000/api/testimonials/approved

# Crear un testimonio de prueba
curl -X POST http://localhost:4000/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{"name":"María","message":"Excelente organización"}'
```

### **3. Verificar en la BD**

```bash
mysql -u root -p imparable
```

```sql
SELECT * FROM testimonials;
```

Deberías ver el testimonio creado con `approved = 0` (pendiente).

---

## 📊 **Estructura de la Tabla**

```sql
CREATE TABLE testimonials (
  id VARCHAR(36) PRIMARY KEY,           -- UUID único
  name VARCHAR(255) NOT NULL,           -- Nombre del usuario
  message TEXT NOT NULL,                -- Mensaje del testimonio
  approved BOOLEAN DEFAULT FALSE,       -- Estado de aprobación
  created_at TIMESTAMP DEFAULT NOW()    -- Fecha de creación
);
```

---

## 🔧 **Endpoints Disponibles**

### **Públicos:**

1. **GET** `/api/testimonials/approved`
   - Obtiene testimonios aprobados
   - No requiere autenticación

2. **POST** `/api/testimonials`
   - Crea un nuevo testimonio
   - Body: `{ "name": "string", "message": "string" }`
   - No requiere autenticación
   - Se crea como `approved: false`

### **Admin (requieren token):**

3. **GET** `/api/testimonials`
   - Obtiene TODOS los testimonios
   - Requiere: `Authorization: Bearer <token>`

4. **PUT** `/api/testimonials/:id/approve`
   - Aprueba un testimonio
   - Requiere: `Authorization: Bearer <token>`

5. **DELETE** `/api/testimonials/:id`
   - Elimina un testimonio
   - Requiere: `Authorization: Bearer <token>`

---

## 🎨 **Uso en el Frontend**

### **Sección Pública (Muro de Testimonios):**

```javascript
// Cargar testimonios aprobados
const response = await fetch(`${API_URL}/testimonials/approved`);
const testimonials = await response.json();

// Crear nuevo testimonio
const response = await fetch(`${API_URL}/testimonials`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'María', message: 'Excelente!' })
});
```

### **Panel Admin:**

```javascript
// Obtener todos los testimonios
const response = await fetch(`${API_URL}/testimonials`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Aprobar testimonio
await fetch(`${API_URL}/testimonials/${id}/approve`, {
  method: 'PUT',
  headers: { Authorization: `Bearer ${token}` }
});

// Eliminar testimonio
await fetch(`${API_URL}/testimonials/${id}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## ✅ **Checklist de Verificación**

- [ ] Tabla `testimonials` creada en la BD
- [ ] Índice `idx_testimonials_approved` creado
- [ ] Servidor backend corriendo sin errores
- [ ] Endpoint `/api/testimonials/approved` funciona
- [ ] Endpoint `/api/testimonials` (POST) funciona
- [ ] Panel admin muestra sección "Testimonios"
- [ ] Formulario público de testimonios funciona
- [ ] Testimonios aprobados se muestran en el muro

---

## 🚨 **Solución de Problemas**

### **Error: "Table 'testimonials' doesn't exist"**

```bash
# Ejecutar el script de creación:
mysql -u root -p imparable < server/add_testimonials.sql
```

### **Error: "Cannot POST /api/testimonials"**

Verificar que el servidor esté corriendo y que la ruta esté registrada:

```javascript
// En server/index.js debe estar:
app.use('/api/testimonials', testimonialsRoutes);
```

### **Error: "Authorization required"**

Los endpoints de admin requieren token. Asegúrate de:
1. Estar logueado en el admin
2. Enviar el header: `Authorization: Bearer <token>`

---

## 📝 **Archivos Creados/Modificados**

### **Backend:**
- ✅ `server/models/testimonials.js` - Modelo de datos
- ✅ `server/routes/testimonials.js` - Rutas API
- ✅ `server/add_testimonials.sql` - Script de migración
- ✅ `server/reset_database.sql` - Actualizado
- ✅ `server/index.js` - Ruta registrada

### **Frontend:**
- ✅ `src/components/Muro.jsx` - Actualizado para usar API
- ✅ `src/pages/AdminTestimonials.jsx` - Panel de admin
- ✅ `src/pages/AdminLayout.jsx` - Menú actualizado
- ✅ `src/App.jsx` - Ruta agregada

---

## 🎉 **¡Listo!**

Ahora tienes un sistema completo de testimonios con:
- ✅ Formulario público para enviar testimonios
- ✅ Sistema de aprobación en el admin
- ✅ Visualización de testimonios aprobados
- ✅ CRUD completo en el panel admin
