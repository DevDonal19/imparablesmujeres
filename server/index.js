import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import usersRoutes from './routes/users.js';
import contactRoutes from './routes/contact.js';
import uploadRoutes from './routes/upload.js';
import commentsRoutes from './routes/comments.js';
import reactionsRoutes from './routes/reactions.js';
import categoriesRoutes from './routes/categories.js';
import sectionsRoutes from './routes/sections.js';
import testimonialsRoutes from './routes/testimonials.js';
import settingsRoutes from './routes/settings.js';
import { bootstrapAdmin } from './utils/bootstrap.js';

/**
 * Configuración __dirname para ES Modules
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cargar variables de entorno
 */
dotenv.config();

/**
 * Inicializar app
 */
const app = express();
const PORT = process.env.PORT || 4000;

/**
 * CORS dinámico desde .env
 * CLIENT_ORIGIN=https://dominio.com,https://www.dominio.com
 */
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/**
 * Middlewares
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * Servir archivos subidos
 * Carpeta /uploads está en la raíz del proyecto
 */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/**
 * Endpoint de salud
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Rutas API
 */
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/settings', settingsRoutes);

/**
 * ============================
 * SERVIR FRONTEND (REACT / VITE)
 * ============================
 * dist/ está en la raíz del proyecto
 */
const clientDistPath = path.join(__dirname, '..', 'dist');
const fs = await import('fs');

// Verificar si la carpeta dist existe
const distExists = fs.existsSync(clientDistPath);

if (distExists) {
  console.log('✓ Sirviendo archivos estáticos desde:', clientDistPath);
  app.use(express.static(clientDistPath));

  /**
   * Para cualquier ruta que NO sea /api ni /uploads,
   * devolver index.html (React Router)
   */
  app.get('*', (req, res) => {
    // Evitar que choque con la API
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }

    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  console.warn('⚠ Carpeta dist/ no encontrada. El frontend no se servirá.');
}

/**
 * Manejador de errores global
 */
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Error interno del servidor',
  });
});

/**
 * Arranque del servidor
 * OBLIGATORIO escuchar en 0.0.0.0 para EasyPanel / Docker
 */
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Imparables corriendo en el puerto ${PORT}`);
  await bootstrapAdmin();
});
