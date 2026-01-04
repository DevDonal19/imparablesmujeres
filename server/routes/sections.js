import express from 'express';
import db from '../db/index.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Obtener todas las secciones
router.get('/', async (req, res) => {
  try {
    const sections = await db('site_sections').select('*');
    
    // Parsear JSON content
    const parsedSections = sections.map(section => ({
      ...section,
      content: typeof section.content === 'string' ? JSON.parse(section.content) : section.content,
    }));
    
    res.json(parsedSections);
  } catch (error) {
    console.error('Error obteniendo secciones:', error);
    res.status(500).json({ message: 'Error al obtener secciones' });
  }
});

// Obtener una sección específica
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const sectionData = await db('site_sections').where({ section }).first();
    
    if (!sectionData) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }
    
    res.json({
      ...sectionData,
      content: typeof sectionData.content === 'string' ? JSON.parse(sectionData.content) : sectionData.content,
    });
  } catch (error) {
    console.error('Error obteniendo sección:', error);
    res.status(500).json({ message: 'Error al obtener sección' });
  }
});

// Actualizar una sección (solo admin)
router.put('/:section', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'El contenido es requerido' });
    }
    
    // Verificar si la sección existe
    const existing = await db('site_sections').where({ section }).first();
    
    if (!existing) {
      // Crear nueva sección
      await db('site_sections').insert({
        section,
        content: JSON.stringify(content),
      });
    } else {
      // Actualizar sección existente
      await db('site_sections').where({ section }).update({
        content: JSON.stringify(content),
        updatedAt: db.fn.now(),
      });
    }
    
    const updated = await db('site_sections').where({ section }).first();
    
    res.json({
      ...updated,
      content: typeof updated.content === 'string' ? JSON.parse(updated.content) : updated.content,
    });
  } catch (error) {
    console.error('Error actualizando sección:', error);
    res.status(500).json({ message: 'Error al actualizar sección' });
  }
});

export default router;
