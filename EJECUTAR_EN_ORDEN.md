# 🚀 Ejecutar en Orden - Solución Completa

## ⚠️ **IMPORTANTE: El servidor backend debe reiniciarse**

Los cambios en `.env` requieren reiniciar el servidor.

---

## 📋 **PASOS EN ORDEN:**

### **1. Detener el Servidor Backend**

En la terminal donde está corriendo el servidor:
- Presiona `Ctrl + C`

---

### **2. Limpiar Testimonios**

```bash
mysql -u root -p imparableok < LIMPIAR_TESTIMONIALS.sql
```

Cuando te pida la contraseña, presiona Enter (sin contraseña).

---

### **3. Reiniciar el Servidor Backend**

```bash
npm run server
```

Deberías ver:
```
API de Imparables escuchando en http://localhost:4000
✓ Usuario admin verificado
```

---

### **4. Verificar que el Frontend Está Corriendo**

El frontend debería estar en: `http://localhost:5174`

Si NO está corriendo:
```bash
npm run dev
```

---

### **5. Probar Todo**

#### **A. Verificar Backend:**
Abre en el navegador:
```
http://localhost:4000/api/health
```

Debe mostrar:
```json
{"status":"ok","timestamp":"..."}
```

#### **B. Verificar Testimonios:**
1. Ir a la página principal
2. Scroll a "Testimonios"
3. ✅ Deben verse 3 testimonios SIN etiquetas HTML

#### **C. Verificar Imágenes:**
1. Ir a un post
2. ✅ La imagen debe cargar (si existe en `server/uploads/`)
3. Si NO existe, verás "Imagen no disponible"

#### **D. Verificar Modal:**
1. Admin → Publicaciones → Click Editar
2. Abrir consola (F12)
3. Buscar los logs:
```
📝 Abriendo editor con post: {...}
📋 Draft creado: {...}
🔍 Campos del draft:
  - title: ...
  - excerpt: ...
  - content: ...
  - image: ...
  - author: ...
```

4. ✅ Todos los campos deben tener valores

---

## 🔍 **Si el Modal Sigue Vacío:**

Copia y pega EXACTAMENTE lo que aparece en la consola después de:
```
🔍 Campos del draft:
```

Necesito ver si los valores son:
- Strings vacíos: `""`
- null: `null`
- undefined: `undefined`
- Con datos: `"Mi título"`

---

## 🖼️ **Si las Imágenes NO Cargan:**

### **Opción 1: Usar Imágenes Externas**

Edita un post y usa una URL externa:
```
https://picsum.photos/800/400
```

### **Opción 2: Verificar Carpeta Uploads**

```bash
dir server\uploads
```

Si está vacía, las imágenes locales no funcionarán.

---

## ✅ **Checklist Final:**

- [ ] Servidor backend reiniciado
- [ ] Testimonios limpios (sin HTML)
- [ ] Backend responde en `http://localhost:4000/api/health`
- [ ] Frontend en `http://localhost:5174`
- [ ] Logs del modal muestran datos completos

---

## 📝 **Comandos Resumidos:**

```bash
# 1. Limpiar testimonios
mysql -u root -p imparableok < LIMPIAR_TESTIMONIALS.sql

# 2. Reiniciar backend (después de Ctrl+C)
npm run server

# 3. Verificar backend
# Abrir: http://localhost:4000/api/health

# 4. Verificar frontend
# Abrir: http://localhost:5174
```

---

**Ejecuta estos pasos y luego prueba de nuevo. Cópiame los logs del modal si sigue sin funcionar.** 🎯
