import express from 'express';
import db from '../db/index.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categories = await db('categories').orderBy('name', 'asc');
    res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});

// Obtener una categoría
router.get('/:id', async (req, res) => {
  try {
    const category = await db('categories').where({ id: req.params.id }).first();
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({ message: 'Error al obtener categoría' });
  }
});

// Crear categoría (solo admin)
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name, color, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }
    
    // Generar slug
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const [id] = await db('categories').insert({
      name,
      slug,
      color: color || '#9f3876',
      description,
    });
    
    const newCategory = await db('categories').where({ id }).first();
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
    }
    console.error('Error creando categoría:', error);
    res.status(500).json({ message: 'Error al crear categoría' });
  }
});

// Actualizar categoría (solo admin)
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, description } = req.body;
    
    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (color) updateData.color = color;
    if (description !== undefined) updateData.description = description;
    
    await db('categories').where({ id }).update(updateData);
    
    const updatedCategory = await db('categories').where({ id }).first();
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({ message: 'Error al actualizar categoría' });
  }
});

// Eliminar categoría (solo admin)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay posts con esta categoría
    const postsCount = await db('posts').where({ category: db('categories').where({ id }).select('name') }).count('* as count').first();
    
    if (postsCount && postsCount.count > 0) {
      return res.status(400).json({ 
        message: `No se puede eliminar. Hay ${postsCount.count} publicación(es) con esta categoría.` 
      });
    }
    
    await db('categories').where({ id }).del();
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({ message: 'Error al eliminar categoría' });
  }
});

export default router;
