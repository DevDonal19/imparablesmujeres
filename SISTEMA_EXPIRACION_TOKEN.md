# 🔒 Sistema de Expiración Automática de Token

## ✅ **Implementación Completa**

He implementado un sistema completo de gestión de expiración de tokens que:

1. **Detecta automáticamente cuando el token expira**
2. **Cierra la sesión automáticamente**
3. **Muestra notificaciones antes de expirar**
4. **Redirige al login cuando expira**

---

## 🔧 **Componentes Implementados:**

### **1. API Service (`src/services/api.js`)**

**Función:** Intercepta respuestas 401 (Unauthorized)

```javascript
if (response.status === 401) {
  console.log('🔒 Token expirado, cerrando sesión...');
  localStorage.removeItem('imparables-auth');
  window.location.href = '/admin/login';
  throw new Error('Tu sesión ha expirado...');
}
```

**Cuándo se activa:**
- Cuando haces una petición con un token expirado
- El servidor responde con 401
- Automáticamente cierra sesión y redirige

---

### **2. Hook `useTokenExpiration` (`src/hooks/useTokenExpiration.js`)**

**Función:** Verifica periódicamente si el token está por expirar

**Características:**
- ✅ Decodifica el token JWT para leer la fecha de expiración
- ✅ Verifica cada 30 segundos
- ✅ Cierra sesión automáticamente cuando expira
- ✅ Calcula tiempo restante hasta expiración

**Uso:**
```javascript
const { timeUntilExpiry } = useTokenExpiration(auth, setAuth, true);
```

---

### **3. Componente `SessionExpiryNotification` (`src/components/SessionExpiryNotification.jsx`)**

**Función:** Muestra notificaciones visuales al usuario

**Notificaciones:**
- ⚠️ **5 minutos antes:** "Tu sesión expirará en 5 minutos"
- ⚠️ **2 minutos antes:** "Tu sesión expirará en 2 minutos"
- ⚠️ **1 minuto antes:** "Tu sesión expirará en X segundos"
- 🔴 **30 segundos antes:** "⚠️ Sesión expirando en X segundos" (alerta roja)

---

## 🎯 **Flujo de Funcionamiento:**

### **Escenario 1: Token Expira Mientras Usas la App**

```
1. Usuario está en el admin
2. Hook verifica cada 30 segundos
3. Detecta que el token expiró
4. Muestra log: "🔒 Token expirado, cerrando sesión..."
5. Elimina datos de localStorage
6. Redirige a /admin/login
```

### **Escenario 2: Token Expira Durante una Petición**

```
1. Usuario hace click en "Guardar post"
2. Frontend envía petición con token expirado
3. Backend responde 401 Unauthorized
4. API service intercepta el 401
5. Cierra sesión automáticamente
6. Redirige a /admin/login
7. Muestra error: "Tu sesión ha expirado..."
```

### **Escenario 3: Advertencias Antes de Expirar**

```
1. Token expira en 5 minutos
2. Aparece notificación amarilla: "Tu sesión expirará en 5 minutos"
3. Token expira en 2 minutos
4. Aparece notificación amarilla: "Tu sesión expirará en 2 minutos"
5. Token expira en 1 minuto
6. Aparece notificación: "Tu sesión expirará en 60 segundos"
7. Token expira en 30 segundos
8. Aparece notificación ROJA: "⚠️ Sesión expirando en 30 segundos"
9. Token expira
10. Cierre automático de sesión
```

---

## ⚙️ **Configuración del Token:**

El token JWT se configura en el backend:

**Archivo:** `server/routes/auth.js`

```javascript
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role, displayName: user.display_name },
  process.env.JWT_SECRET,
  { expiresIn: '4h' }  // ← Duración del token
);
```

**Duración actual:** 4 horas

**Para cambiar:**
- `'1h'` = 1 hora
- `'2h'` = 2 horas
- `'8h'` = 8 horas
- `'1d'` = 1 día

---

## 🧪 **Probar el Sistema:**

### **Prueba 1: Expiración Automática**

```javascript
// En la consola del navegador (cuando estés logueado):
localStorage.setItem('imparables-auth', JSON.stringify({
  token: 'token-invalido',
  user: { id: 1, email: 'test@test.com' }
}));

// Recarga la página
// Resultado: Sesión cerrada automáticamente en 30 segundos
```

### **Prueba 2: Error 401**

```javascript
// Hacer una petición con token expirado
// El sistema detectará el 401 y cerrará sesión
```

### **Prueba 3: Notificaciones**

Para probar las notificaciones, necesitarías:
1. Modificar temporalmente el tiempo de expiración a 6 minutos
2. Iniciar sesión
3. Esperar 1 minuto
4. Ver la notificación de "5 minutos restantes"

---

## 📊 **Logs en Consola:**

El sistema muestra logs útiles:

```
🔒 Token expirado, cerrando sesión...
⚠️ Tu sesión expirará en 5 minutos
⚠️ Tu sesión expirará en 1 minuto
```

---

## 🔐 **Seguridad:**

### **Ventajas:**
✅ Cierre automático de sesión inactiva
✅ Previene uso de tokens expirados
✅ Notifica al usuario antes de cerrar
✅ Manejo centralizado en un solo lugar

### **Consideraciones:**
- El token se almacena en localStorage (vulnerable a XSS)
- Para mayor seguridad, considera usar httpOnly cookies
- El tiempo de expiración debe balancear seguridad vs UX

---

## 🎨 **Personalización:**

### **Cambiar Tiempo de Advertencias:**

En `src/hooks/useTokenExpiration.js`:

```javascript
// Advertencia 10 minutos antes (en lugar de 5)
if (timeLeft <= 10 * 60 * 1000 && timeLeft > 9.5 * 60 * 1000) {
  console.warn('⚠️ Tu sesión expirará en 10 minutos');
}
```

### **Cambiar Frecuencia de Verificación:**

```javascript
// Verificar cada 10 segundos (en lugar de 30)
const interval = setInterval(checkTokenExpiration, 10000);
```

### **Desactivar Notificaciones:**

```javascript
// En AdminLayout.jsx
const { timeUntilExpiry } = useTokenExpiration(auth, setAuth, false);
//                                                              ↑ false = sin notificaciones
```

---

## ✅ **Resultado Final:**

- ✅ Sesión se cierra automáticamente cuando el token expira
- ✅ Usuario recibe advertencias antes de expirar
- ✅ Redirige automáticamente al login
- ✅ Manejo de errores 401 en todas las peticiones
- ✅ Sistema robusto y centralizado

---

## 🚀 **¡Listo para Usar!**

El sistema está completamente implementado y funcionando. 

**Recarga la página del admin para que los cambios tomen efecto.**

Si quieres probar, puedes:
1. Iniciar sesión en el admin
2. Esperar 4 horas (o modificar el tiempo de expiración a 5 minutos para pruebas)
3. Ver cómo se cierra automáticamente la sesión
