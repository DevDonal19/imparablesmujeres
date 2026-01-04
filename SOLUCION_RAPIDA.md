# 🚀 Solución Rápida - Todos los Problemas

## 🎯 **Problemas Identificados:**

1. ❌ **Imágenes no cargan** - `ERR_CONNECTION_REFUSED`
2. ❌ **Testimonios muestran HTML**
3. ❌ **Modal no carga datos del post**

---

## ✅ **SOLUCIÓN 1: Iniciar el Servidor Backend**

El problema principal es que **el servidor backend NO está corriendo**.

### **Paso 1: Abrir una terminal nueva**

### **Paso 2: Ir a la carpeta del servidor**
```bash
cd server
```

### **Paso 3: Iniciar el servidor**
```bash
npm run dev
```

**Deberías ver:**
```
API de Imparables escuchando en http://localhost:4000
```

### **Paso 4: Verificar que funciona**
Abre en el navegador:
```
http://localhost:4000/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2024-12-04T..."
}
```

---

## ✅ **SOLUCIÓN 2: Limpiar Testimonios con HTML**

```bash
mysql -u root -p imparableok < LIMPIAR_TESTIMONIALS.sql
```

Este script:
- Elimina testimonios con HTML
- Agrega testimonios limpios de ejemplo

---

## ✅ **SOLUCIÓN 3: Verificar Carpeta de Uploads**

### **Crear carpeta si no existe:**
```bash
# Desde la raíz del proyecto
mkdir server\uploads
```

### **Verificar que las imágenes existen:**
```bash
dir server\uploads
```

Si NO hay imágenes, las URLs no funcionarán. Necesitas:
- Subir imágenes desde el admin
- O usar URLs externas (ej: `https://picsum.photos/800/400`)

---

## 🧪 **Prueba Completa:**

### **1. Servidor Backend Corriendo**
```bash
# Terminal 1
cd server
npm run dev
```

### **2. Frontend Corriendo**
```bash
# Terminal 2 (nueva terminal)
npm run dev
```

### **3. Verificar:**
- ✅ Backend: `http://localhost:4000/api/health`
- ✅ Frontend: `http://localhost:5173`

---

## 📝 **Para el Modal de Edición:**

Una vez que el servidor esté corriendo:

1. **Ir a Admin → Publicaciones**
2. **Click en Editar (lápiz)**
3. **Abrir consola (F12)**
4. **Buscar:**
```
📝 Abriendo editor con post: {...}
📋 Draft creado: {...}
```

**Si NO aparecen esos logs, cópiame el error que aparece.**

---

## 🔧 **Comandos en Orden:**

```bash
# 1. Limpiar testimonios
mysql -u root -p imparableok < LIMPIAR_TESTIMONIALS.sql

# 2. Crear carpeta uploads si no existe
mkdir server\uploads

# 3. Iniciar servidor backend (Terminal 1)
cd server
npm run dev

# 4. Iniciar frontend (Terminal 2 - nueva terminal)
npm run dev
```

---

## ✅ **Checklist Final:**

- [ ] Servidor backend corriendo en puerto 4000
- [ ] Frontend corriendo en puerto 5173
- [ ] Carpeta `server/uploads` existe
- [ ] Testimonios limpios (sin HTML)
- [ ] Puedes acceder a `http://localhost:4000/api/health`

---

## 🎯 **Resultado Esperado:**

### **Imágenes:**
- Si la imagen existe en `server/uploads/`: ✅ Se muestra
- Si NO existe: Muestra "Imagen no disponible"

### **Testimonios:**
- Texto limpio sin etiquetas HTML

### **Modal de Edición:**
- Todos los campos se llenan con los datos del post

---

**¡Ejecuta los comandos en orden y prueba de nuevo!** 🚀
