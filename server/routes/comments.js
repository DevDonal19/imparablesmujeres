import express from 'express';
import db from '../db/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Obtener comentarios de un post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await db('comments')
      .where({ postId, approved: true })
      .orderBy('createdAt', 'desc');
    
    res.json(comments);
  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    res.status(500).json({ message: 'Error al obtener comentarios' });
  }
});

// Crear un comentario
router.post('/', async (req, res) => {
  try {
    const { postId, name, email, content } = req.body;
    
    if (!postId || !name || !email || !content) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    
    const [commentId] = await db('comments').insert({
      postId,
      name,
      email,
      content,
      approved: false, // Requiere aprobación del admin
    });
    
    res.status(201).json({
      message: 'Comentario enviado. Será visible después de ser aprobado.',
      id: commentId,
    });
  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({ message: 'Error al crear comentario' });
  }
});

// Aprobar comentario (requiere autenticación)
router.put('/:id/approve', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db('comments').where({ id }).update({ approved: true });
    
    res.json({ message: 'Comentario aprobado' });
  } catch (error) {
    console.error('Error aprobando comentario:', error);
    res.status(500).json({ message: 'Error al aprobar comentario' });
  }
});

// Eliminar comentario (requiere autenticación)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db('comments').where({ id }).del();
    
    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    console.error('Error eliminando comentario:', error);
    res.status(500).json({ message: 'Error al eliminar comentario' });
  }
});

// Obtener todos los comentarios pendientes (requiere autenticación)
router.get('/pending', authenticate, async (req, res) => {
  try {
    const comments = await db('comments')
      .where({ approved: false })
      .orderBy('createdAt', 'desc');
    
    res.json(comments);
  } catch (error) {
    console.error('Error obteniendo comentarios pendientes:', error);
    res.status(500).json({ message: 'Error al obtener comentarios pendientes' });
  }
});

export default router;
