# Guía de Despliegue - Imparables

## Requisitos Previos

- Node.js 18+ instalado en el servidor
- MySQL/MariaDB configurado
- PM2 instalado globalmente: `npm install -g pm2`
- Nginx o Apache configurado

## Pasos para Desplegar en Producción

### 1. Preparar el Proyecto Localmente

```bash
# Compilar el frontend
npm run build

# Verificar que la carpeta dist/ se haya creado correctamente
```

### 2. Subir Archivos al Servidor

Sube los siguientes archivos/carpetas al servidor:

```
/server/          # Backend completo
/dist/            # Frontend compilado
/uploads/         # Carpeta para archivos subidos
/node_modules/    # Dependencias (o ejecuta npm install en el servidor)
/.env             # Variables de entorno
/package.json
/ecosystem.config.cjs  # Configuración de PM2
```

### 3. Configurar Variables de Entorno (.env)

Asegúrate de que el archivo `.env` tenga la configuración correcta:

```env
PORT=4000
NODE_ENV=production

CLIENT_ORIGIN=https://imparablesmujeres.org,https://www.imparablesmujeres.org

JWT_SECRET=tu_jwt_secret_seguro

ADMIN_EMAIL=editor@imparables.com
ADMIN_SEED_PASSWORD=tu_password_seguro
ADMIN_DISPLAY_NAME=Editora Imparable

DB_HOST=tu_host_mysql
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=Imparables4

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contacto@imparablesmujeres.org
SMTP_PASS=tu_smtp_password
```

### 4. Ejecutar Migraciones de Base de Datos

```bash
# En el servidor, ejecuta:
npm run migrate
```

### 5. Iniciar el Backend con PM2

```bash
# Instalar PM2 si no está instalado
npm install -g pm2

# Iniciar la aplicación
pm2 start ecosystem.config.cjs

# Guardar la configuración para que se inicie automáticamente
pm2 save
pm2 startup
```

### 6. Configurar el Servidor Web

#### Opción A: Apache (.htaccess)

El archivo `.htaccess` ya está incluido en la raíz del proyecto. Asegúrate de que:

1. Los archivos de `dist/` estén en el directorio raíz del dominio
2. El módulo `mod_rewrite` esté habilitado
3. El backend esté corriendo en el puerto 4000

#### Opción B: Nginx

1. Copia el contenido de `nginx.conf` a tu configuración de Nginx
2. Ajusta las rutas según tu servidor:
   - `root /path/to/imparablesmujeres/dist;`
   - Rutas de certificados SSL
   - Ruta de uploads
3. Reinicia Nginx: `sudo systemctl restart nginx`

### 7. Verificar el Despliegue

1. Accede a https://imparablesmujeres.org
2. Verifica que el sitio cargue correctamente
3. Prueba el login en https://imparablesmujeres.org/admin/login
4. Verifica que las APIs funcionen correctamente

## Comandos Útiles de PM2

```bash
# Ver estado de la aplicación
pm2 status

# Ver logs
pm2 logs imparables-backend

# Reiniciar la aplicación
pm2 restart imparables-backend

# Detener la aplicación
pm2 stop imparables-backend

# Eliminar la aplicación
pm2 delete imparables-backend
```

## Estructura de Archivos en Producción

```
/var/www/imparablesmujeres/
├── dist/                    # Frontend compilado (servido por Nginx/Apache)
│   ├── index.html
│   ├── assets/
│   └── images/
├── server/                  # Backend Node.js
│   ├── index.js
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── db/
├── uploads/                 # Archivos subidos por usuarios
├── logs/                    # Logs de PM2
├── node_modules/
├── .env
├── package.json
└── ecosystem.config.cjs
```

## Solución de Problemas

### El sitio muestra 404

- Verifica que los archivos de `dist/` estén en el directorio correcto
- Verifica la configuración de Nginx/Apache
- Revisa los logs del servidor web

### Las APIs no funcionan

- Verifica que el backend esté corriendo: `pm2 status`
- Revisa los logs: `pm2 logs imparables-backend`
- Verifica la conexión a la base de datos
- Verifica que el puerto 4000 esté abierto

### Error de CORS

- Verifica que `CLIENT_ORIGIN` en `.env` incluya los dominios correctos
- Verifica la configuración de Nginx/Apache para permitir CORS

### Base de datos no conecta

- Verifica las credenciales en `.env`
- Verifica que el host de MySQL sea accesible
- Ejecuta las migraciones: `npm run migrate`

## Actualizar el Sitio

```bash
# 1. Compilar localmente
npm run build

# 2. Subir la carpeta dist/ al servidor

# 3. Si hay cambios en el backend, reiniciar PM2
pm2 restart imparables-backend

# 4. Si hay nuevas migraciones
npm run migrate
```

## Credenciales de Acceso Admin

```
URL: https://imparablesmujeres.org/admin/login
Email: editor@imparables.com
Password: (configurado en ADMIN_SEED_PASSWORD)
```
