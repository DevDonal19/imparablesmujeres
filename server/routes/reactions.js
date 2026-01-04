import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// Obtener reacciones de un post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Contar reacciones por tipo
    const reactions = await db('reactions')
      .where({ postId })
      .select('type')
      .count('* as count')
      .groupBy('type');
    
    // Convertir a objeto
    const reactionsObj = reactions.reduce((acc, { type, count }) => {
      acc[type] = parseInt(count);
      return acc;
    }, {});
    
    res.json(reactionsObj);
  } catch (error) {
    console.error('Error obteniendo reacciones:', error);
    res.status(500).json({ message: 'Error al obtener reacciones' });
  }
});

// Agregar o quitar reacción
router.post('/', async (req, res) => {
  try {
    const { postId, type, userIdentifier } = req.body;
    
    if (!postId || !type || !userIdentifier) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    
    // Verificar si ya existe la reacción
    const existing = await db('reactions')
      .where({ postId, userIdentifier, type })
      .first();
    
    if (existing) {
      // Si existe, eliminarla (toggle)
      await db('reactions')
        .where({ postId, userIdentifier, type })
        .del();
      
      res.json({ message: 'Reacción eliminada', action: 'removed' });
    } else {
      // Si no existe, agregarla
      await db('reactions').insert({
        postId,
        type,
        userIdentifier,
      });
      
      res.json({ message: 'Reacción agregada', action: 'added' });
    }
  } catch (error) {
    console.error('Error procesando reacción:', error);
    res.status(500).json({ message: 'Error al procesar reacción' });
  }
});

// Obtener reacción del usuario para un post
router.get('/post/:postId/user/:userIdentifier', async (req, res) => {
  try {
    const { postId, userIdentifier } = req.params;
    
    const reaction = await db('reactions')
      .where({ postId, userIdentifier })
      .first();
    
    res.json(reaction || null);
  } catch (error) {
    console.error('Error obteniendo reacción del usuario:', error);
    res.status(500).json({ message: 'Error al obtener reacción del usuario' });
  }
});

export default router;
