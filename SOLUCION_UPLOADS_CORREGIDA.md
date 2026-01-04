# ✅ SOLUCIÓN: Ruta de Uploads Corregida

## 🔍 **Problema Identificado:**

La carpeta `uploads` está en:
```
C:\Users\Usuario\Documents\Imparables\uploads
```

Pero el servidor estaba buscando en:
```
C:\Users\Usuario\Documents\Imparables\server\uploads
```

---

## ✅ **Solución Aplicada:**

He actualizado `server/index.js` línea 41:

**ANTES:**
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

**DESPUÉS:**
```javascript
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
```

Ahora apunta correctamente a la carpeta en la raíz del proyecto.

---

## 🚀 **PASOS FINALES:**

### **1. Limpiar Testimonios (si aún tienen HTML):**

```bash
mysql -u root -p imparableok < ARREGLAR_TODO.sql
```

### **2. Reiniciar el Servidor:**

**Detener el servidor actual:**
- Presiona `Ctrl + C` en la terminal

**Reiniciar:**
```bash
npm run server
```

Deberías ver:
```
API de Imparables escuchando en http://localhost:4000
✓ Usuario admin verificado
```

---

## 🧪 **Verificar que Funciona:**

### **1. Verificar que las imágenes cargan:**

Abre en el navegador:
```
http://localhost:4000/uploads/1764846188234-935075586.jpg
```

- ✅ Si la imagen existe en `C:\Users\Usuario\Documents\Imparables\uploads\`, se mostrará
- ❌ Si no existe, verás error 404

### **2. Ver qué imágenes tienes:**

```bash
dir uploads
```

Esto te mostrará todas las imágenes disponibles.

### **3. Probar en un post:**

1. Ir a un post individual
2. ✅ La imagen debería cargar ahora
3. Si no carga, verificar que el nombre del archivo en la BD coincida con el archivo real

---

## 📊 **Estructura Correcta:**

```
Imparables/
├── server/
│   ├── index.js          ← Apunta a ../uploads
│   └── routes/
│       └── upload.js     ← Guarda en ../../uploads
└── uploads/              ← CARPETA CORRECTA
    ├── 1764846188234-935075586.jpg
    ├── 1764844056834-842225689.png
    └── ...
```

---

## 🔧 **Si las Imágenes Aún No Cargan:**

### **Opción 1: Verificar nombres de archivo**

```sql
-- Ver qué imágenes están en la BD
SELECT id, title, image FROM posts WHERE image IS NOT NULL;
```

Compara con:
```bash
dir uploads
```

### **Opción 2: Usar imágenes externas temporalmente**

```sql
-- Actualizar posts con imágenes de ejemplo
UPDATE posts 
SET image = 'https://picsum.photos/800/400' 
WHERE id = 1;
```

### **Opción 3: Subir nueva imagen desde el admin**

1. Admin → Publicaciones → Editar
2. Subir una imagen nueva
3. Se guardará automáticamente en `uploads/`
4. ✅ Funcionará correctamente

---

## ✅ **Checklist Final:**

- [x] Ruta de uploads corregida en `server/index.js`
- [ ] Servidor reiniciado
- [ ] Testimonios limpios (sin HTML)
- [ ] Imágenes verificadas en carpeta `uploads/`
- [ ] Posts mostrando imágenes correctamente

---

## 🎉 **Resultado:**

Después de reiniciar el servidor:

1. **Imágenes locales:** Funcionarán si existen en `uploads/`
2. **Testimonios:** Limpios sin HTML (después de ejecutar SQL)
3. **Subir nuevas imágenes:** Funcionará correctamente desde el admin

---

**Reinicia el servidor y verifica que las imágenes cargan.** 🚀
