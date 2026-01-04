# ✅ Imagen Dinámica en Hero

## 🎉 **¡Problema Solucionado!**

Ahora la imagen de la sección Hero se carga dinámicamente desde la base de datos y se puede editar desde el panel de administración.

---

## 📝 **Cambios Realizados**

### **Archivo: `src/components/Hero.jsx`**

**Antes:**
```javascript
const DollImage = getAssetUrl('doll-imparables.png'); // Imagen fija

// En el render:
<img src={DollImage} alt="Muñeca Imparables" />
```

**Después:**
```javascript
const defaultDollImage = getAssetUrl('doll-imparables.png'); // Imagen por defecto

// Estado dinámico:
const [heroData, setHeroData] = useState({
  title: '...',
  subtitle: '...',
  buttonText: '...',
  buttonLink: '...',
  image: defaultDollImage, // Imagen por defecto
});

// Cargar desde API:
useEffect(() => {
  const loadHeroData = async () => {
    const response = await fetch(`${API_URL}/sections`);
    const data = await response.json();
    const heroSection = data.find(s => s.section === 'hero');
    if (heroSection) {
      setHeroData({
        title: heroSection.content.title,
        subtitle: heroSection.content.subtitle,
        buttonText: heroSection.content.buttonText,
        buttonLink: heroSection.content.buttonLink,
        image: heroSection.content.image || defaultDollImage,
      });
    }
  };
  loadHeroData();
}, []);

// En el render:
<img src={heroData.image} alt="Muñeca Imparables" />
```

---

## 🎯 **Cómo Usar**

### **1. Editar la Imagen desde el Panel Admin**

1. Iniciar sesión en el panel admin
2. Ir a **Secciones del Sitio**
3. Tab **"Inicio/Hero"**
4. Campo **"URL de la Imagen"**
5. Ingresar la URL de la imagen
6. Click en **"Guardar Cambios"**
7. ✅ La imagen se actualiza en la página principal

---

## 🖼️ **Tipos de URL Soportadas**

### **1. URL Relativa (Imagen en el proyecto):**
```
/images/hero-doll.png
```
La imagen debe estar en: `public/images/hero-doll.png`

### **2. URL Absoluta (Imagen externa):**
```
https://ejemplo.com/imagenes/mujer-pacifico.jpg
```
Cualquier URL pública de internet

### **3. URL de Asset (Imagen en src/assets):**
```
/src/assets/doll-imparables.png
```
La imagen debe estar en: `src/assets/doll-imparables.png`

---

## 📊 **Datos que se Cargan Dinámicamente**

Ahora **TODOS** los datos del Hero son dinámicos:

✅ **Título** - Se carga desde la base de datos  
✅ **Subtítulo** - Se carga desde la base de datos  
✅ **Texto del Botón** - Se carga desde la base de datos  
✅ **Enlace del Botón** - Se carga desde la base de datos  
✅ **Imagen** - Se carga desde la base de datos (NUEVO)  

---

## 🔄 **Flujo de Datos**

```
Base de Datos (MySQL)
    ↓
API Backend (/api/sections)
    ↓
Frontend (Hero.jsx)
    ↓
Renderizado en Pantalla
```

### **Estructura en Base de Datos:**

```json
{
  "section": "hero",
  "content": {
    "title": "Imparables",
    "subtitle": "Mujeres que transforman...",
    "buttonText": "Conoce más",
    "buttonLink": "#historia",
    "image": "/images/hero-doll.png"
  }
}
```

---

## ✨ **Características**

### **Imagen por Defecto:**
Si no hay imagen en la base de datos, se usa la imagen por defecto:
```javascript
defaultDollImage = getAssetUrl('doll-imparables.png')
```

### **Carga Asíncrona:**
La imagen se carga al montar el componente con `useEffect`

### **Fallback:**
Si falla la carga, se usa la imagen por defecto

### **Optimización:**
Solo se carga una vez al montar el componente

---

## 🧪 **Probar el Cambio**

### **Paso 1: Cambiar la Imagen**
1. Panel Admin → Secciones del Sitio → Inicio/Hero
2. Cambiar "URL de la Imagen" a:
   ```
   https://picsum.photos/400/600
   ```
3. Guardar

### **Paso 2: Ver el Resultado**
1. Ir a la página principal
2. ✅ La imagen debe cambiar a la nueva URL

### **Paso 3: Volver a la Original**
1. Panel Admin → Secciones del Sitio → Inicio/Hero
2. Cambiar "URL de la Imagen" a:
   ```
   /images/hero-doll.png
   ```
3. Guardar
4. ✅ Vuelve a la imagen original

---

## 🐛 **Solución de Problemas**

### **La imagen no se muestra:**

1. **Verificar la URL:**
   - Abrir la URL en el navegador
   - Debe mostrar la imagen

2. **Verificar la consola:**
   - F12 → Console
   - Buscar errores de carga

3. **Verificar la base de datos:**
   ```sql
   SELECT content FROM site_sections WHERE section = 'hero';
   ```
   Debe contener el campo `image`

4. **Verificar el servidor:**
   - El servidor debe estar corriendo
   - La API debe responder en `/api/sections`

### **La imagen se ve rota:**

1. **URL incorrecta:**
   - Verificar que la URL sea válida
   - Verificar que la imagen exista

2. **CORS:**
   - Si es URL externa, verificar que permita CORS
   - Usar URLs de dominios que permitan embedding

3. **Formato:**
   - Usar formatos soportados: JPG, PNG, GIF, WebP, SVG

---

## 📁 **Archivos Modificados**

- ✅ `src/components/Hero.jsx` - Componente Hero con datos dinámicos

---

## 🎨 **Ejemplo de Uso Completo**

### **En el Panel Admin:**

```
┌─────────────────────────────────────────┐
│ Sección de Inicio (Hero)                │
├─────────────────────────────────────────┤
│ Título Principal:                       │
│ [Imparables_____________________]       │
│                                         │
│ Subtítulo:                              │
│ [Mujeres que transforman..._____]       │
│                                         │
│ Descripción:                            │
│ [Somos una organización...______]       │
│                                         │
│ URL de la Imagen: ← NUEVO               │
│ [/images/hero-doll.png__________]       │
│ URL de la imagen que se mostrará...     │
│                                         │
│ Texto del Botón:                        │
│ [Conoce más_____________________]       │
│                                         │
│ Enlace del Botón:                       │
│ [#historia______________________]       │
│                                         │
│         [Guardar Cambios]               │
└─────────────────────────────────────────┘
```

### **En la Página Principal:**

```
┌─────────────────────────────────────────┐
│                                         │
│  "Imparables"                    [IMG] │
│  Mujeres que transforman...       ││   │
│                                   ││   │
│  [Conoce más]                     ││   │
│                                   ││   │
│                                   \/   │
│                              Imagen    │
│                              Dinámica  │
└─────────────────────────────────────────┘
```

---

## 🚀 **Resultado Final**

✅ **Imagen editable** desde el panel admin  
✅ **Carga dinámica** desde la base de datos  
✅ **Fallback** a imagen por defecto  
✅ **Todos los datos** del Hero son editables  
✅ **Sin recargar** la página (React state)  

**¡Todo funcionando correctamente!** 🎉
