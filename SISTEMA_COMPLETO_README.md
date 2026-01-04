# 🚀 Sistema Completo Imparables - Documentación

## ✅ Funcionalidades Implementadas

### 1. 📰 Blog Público (Solo Lectura)
**Archivo:** `src/components/BlogPublic.jsx`

- ✅ Los usuarios solo ven las publicaciones
- ✅ Sin botones de login o edición visibles
- ✅ Diseño profesional con animaciones
- ✅ Tarjetas con gradientes y efectos hover
- ✅ Chips de categoría y fecha con iconos
- ✅ Responsive en todos los dispositivos

**Características:**
- Carga automática de publicaciones desde la API
- Lazy loading de imágenes
- Animaciones con Framer Motion
- Truncado automático de texto largo

---

### 2. 👥 Sistema de Gestión de Usuarios
**Archivo:** `src/pages/AdminUsers.jsx`

#### **Roles Disponibles:**
1. **Administrador** - Control total del sistema
2. **Editor** - Puede crear y editar contenido
3. **Visualizador** - Solo puede ver contenido

#### **Funcionalidades:**
- ✅ **Crear usuarios** (solo admin)
- ✅ **Editar usuarios** (admin puede editar todos, usuarios pueden editar su perfil)
- ✅ **Eliminar usuarios** (solo admin, no puede eliminarse a sí mismo)
- ✅ **Cambiar roles** (solo admin)
- ✅ **Cambiar contraseñas**
- ✅ **Tarjetas de estadísticas** por rol
- ✅ **Tabla con listado completo**
- ✅ **Diálogos de confirmación**

#### **Seguridad:**
- Validación de permisos en frontend y backend
- Hash de contraseñas con bcrypt
- Protección contra auto-eliminación
- Validación de emails únicos

---

### 3. 📧 Sistema de Correos Automáticos
**Archivo:** `server/routes/contact.js`

#### **Flujo de Correos:**

**Cuando un usuario envía un mensaje:**

1. **Se guarda en la base de datos**
   - Tabla `contacts` con toda la información
   - Timestamp automático
   - Estado de lectura

2. **Respuesta automática al usuario:**
   ```
   ✉️ Correo HTML con:
   - Logo de Imparables
   - Colores de marca (#9f3876, #bd1d82, #f6a4fd)
   - Mensaje personalizado con el nombre
   - Botón para visitar el sitio web
   - Enlaces a redes sociales
   - Diseño responsive
   ```

3. **Notificación al equipo:**
   ```
   ✉️ Correo al administrador con:
   - Nombre del remitente
   - Email del remitente
   - Mensaje completo
   - Fecha y hora
   - Botón para responder directamente
   ```

#### **Configuración SMTP:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
```

**Para Gmail:**
1. Ir a https://myaccount.google.com/apppasswords
2. Crear una contraseña de aplicación
3. Usar esa contraseña en `SMTP_PASS`

---

### 4. 🔐 Sistema de Autenticación Mejorado
**Archivo:** `server/middleware/auth.js`

#### **Middlewares Disponibles:**

1. **`authenticate`** - Verifica que el usuario esté autenticado
2. **`authorizeAdmin`** - Verifica que el usuario sea administrador
3. **`authorizeEditor`** - Verifica que el usuario sea editor o admin

#### **Validación de Tokens:**
- Verificación de JWT en cada request
- Decodificación segura del payload
- Validación de expiración
- Mensajes de error claros

---

### 5. 🗄️ Base de Datos

#### **Tablas Creadas:**

**`users`**
```sql
- id (PK)
- email (único)
- password (hash)
- displayName
- role (admin/editor/viewer)
- createdAt
```

**`posts`**
```sql
- id (PK)
- title
- excerpt
- category
- image
- date
- createdAt
```

**`contacts`**
```sql
- id (PK)
- nombre
- correo
- mensaje
- createdAt
- leido (boolean)
- respuesta (text)
- respondidoAt
```

#### **Migraciones:**
- `001_create_users_table.js`
- `002_create_posts_table.js`
- `003_create_contacts_table.js`
- `004_add_role_to_users.js`

---

### 6. 🛣️ API Endpoints

#### **Autenticación**
```
POST /api/auth/login
- Body: { email, password }
- Response: { token, user }
```

#### **Usuarios**
```
GET    /api/users              - Listar todos (requiere auth)
GET    /api/users/:id          - Obtener uno (requiere auth)
POST   /api/users              - Crear (solo admin)
PUT    /api/users/:id          - Actualizar (admin o propio)
DELETE /api/users/:id          - Eliminar (solo admin)
PUT    /api/users/profile/me   - Actualizar perfil propio
```

#### **Publicaciones**
```
GET    /api/posts              - Listar todas (público)
GET    /api/posts/:id          - Obtener una (público)
POST   /api/posts              - Crear (requiere auth)
PUT    /api/posts/:id          - Actualizar (requiere auth)
DELETE /api/posts/:id          - Eliminar (requiere auth)
```

#### **Contacto**
```
POST   /api/contact            - Enviar mensaje (público)
GET    /api/contact            - Listar mensajes (requiere auth)
```

---

### 7. 🎨 Componentes Frontend

#### **Páginas Públicas:**
- `HomePage.jsx` - Página principal
- `BlogPublic.jsx` - Blog de solo lectura
- `Hero.jsx` - Sección hero
- `Historia.jsx` - Historia de la organización
- `MisionVision.jsx` - Misión y visión
- `Servicios.jsx` - Servicios ofrecidos
- `Muro.jsx` - Testimonios
- `Contacto.jsx` - Formulario de contacto

#### **Páginas Admin:**
- `AdminLogin.jsx` - Login del panel
- `AdminLayout.jsx` - Layout con sidebar
- `AdminDashboard.jsx` - Dashboard principal
- `AdminPosts.jsx` - Gestión de publicaciones
- `AdminUsers.jsx` - Gestión de usuarios

#### **Componentes Utilitarios:**
- `ProtectedRoute.jsx` - Protección de rutas

---

### 8. 🔒 Seguridad Implementada

#### **Frontend:**
- ✅ Validación de tokens JWT
- ✅ Verificación de expiración automática
- ✅ Rutas protegidas con ProtectedRoute
- ✅ Limpieza de formularios después de login
- ✅ Mensajes de error claros

#### **Backend:**
- ✅ Hash de contraseñas con bcrypt (10 rounds)
- ✅ Validación de permisos por rol
- ✅ Protección contra inyección SQL (Knex)
- ✅ Validación de datos de entrada
- ✅ CORS configurado correctamente
- ✅ Tokens JWT con expiración

---

### 9. 📱 Diseño Responsive

Todas las páginas son completamente responsive:
- **Desktop**: Layout completo con sidebar
- **Tablet**: Sidebar colapsable
- **Móvil**: Menú hamburguesa

---

### 10. 🎨 Paleta de Colores

```css
Primary: #9f3876 (Magenta oscuro)
Primary Dark: #bd1d82 (Magenta brillante)
Secondary Light: #f6a4fd (Rosa claro)
Secondary: #a8a8a8 (Gris)

Gradientes:
- linear-gradient(120deg, #9f3876, #bd1d82)
- linear-gradient(135deg, rgba(159,56,118,0.1), rgba(246,164,253,0.1))
```

---

## 🚀 Cómo Usar el Sistema

### **1. Configuración Inicial**

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar .env con tus credenciales SMTP

# Ejecutar migraciones
npm run migrate

# Iniciar servidor
npm run dev
```

### **2. Acceso al Panel Admin**

1. Ir a `http://localhost:5173/admin/login`
2. Usar credenciales:
   - Email: `editor@imparables.com`
   - Password: `Imparable2025!`

### **3. Crear Usuarios**

1. Ir a **Usuarios** en el sidebar
2. Click en **Nuevo Usuario**
3. Llenar formulario:
   - Nombre completo
   - Email (único)
   - Contraseña
   - Rol (admin/editor/viewer)
4. Click en **Crear**

### **4. Gestionar Publicaciones**

1. Ir a **Publicaciones**
2. Click en **Nueva Publicación**
3. Llenar datos:
   - Título
   - Categoría
   - Fecha
   - Resumen
   - URL de imagen
4. Click en **Guardar**

### **5. Ver Mensajes de Contacto**

Los mensajes se guardan automáticamente en la base de datos.
Para verlos, necesitas crear una página de gestión de contactos.

---

## 📋 Pendiente de Implementar

### **Alta Prioridad:**
1. ✅ Página de perfil de usuario
2. ✅ Página de estadísticas funcional
3. ✅ Página de configuración
4. ✅ Edición de secciones del sitio

### **Media Prioridad:**
5. ✅ Gestión de mensajes de contacto en admin
6. ✅ Filtros y búsqueda en usuarios
7. ✅ Paginación en tablas
8. ✅ Exportación de datos

### **Baja Prioridad:**
9. ✅ Subida de imágenes
10. ✅ Editor de texto enriquecido
11. ✅ Notificaciones en tiempo real
12. ✅ Logs de auditoría

---

## 🐛 Solución de Problemas

### **Error: No se envían correos**
1. Verificar credenciales SMTP en `.env`
2. Para Gmail, usar contraseña de aplicación
3. Verificar que el puerto 587 esté abierto

### **Error: Token expirado**
1. El token expira después de cierto tiempo
2. Volver a iniciar sesión
3. Ajustar tiempo de expiración en `server/routes/auth.js`

### **Error: No se pueden crear usuarios**
1. Verificar que el usuario actual sea admin
2. Verificar que el email no esté duplicado
3. Verificar conexión a la base de datos

---

## 📞 Soporte

Para más información o soporte:
- Email: editor@imparables.com
- Documentación: Este archivo

---

**Desarrollado con 💜 para Imparables**
**Mujeres que transforman el mundo desde el Pacífico colombiano**
