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
import { bootstrapAdmin } from './utils/bootstrap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));

// Servir archivos estáticos (imágenes subidas)
// La carpeta uploads está en la raíz del proyecto, no en server/
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) =>
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
);

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

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`API de Imparables escuchando en el puerto ${PORT}`);
  await bootstrapAdmin();
});
