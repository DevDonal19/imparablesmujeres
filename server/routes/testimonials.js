import express from 'express';
import { findAll, findApproved, create, approve, deleteById } from '../models/testimonials.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const sanitizeMessage = (message = '') =>
  message
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .trim();

// Obtener testimonios aprobados (público)
router.get('/approved', async (req, res, next) => {
  try {
    const testimonials = await findApproved();
    const sanitized = testimonials.map((t) => ({
      ...t,
      message: sanitizeMessage(t.message),
    }));
    res.json(sanitized);
  } catch (error) {
    next(error);
  }
});

// Obtener todos los testimonios (admin)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const testimonials = await findAll();
    const sanitized = testimonials.map((t) => ({
      ...t,
      message: sanitizeMessage(t.message),
    }));
    res.json(sanitized);
  } catch (error) {
    next(error);
  }
});

// Crear testimonial (público)
router.post('/', async (req, res, next) => {
  try {
    const { name, message } = req.body;
    
    if (!name || !message) {
      return res.status(400).json({ message: 'Nombre y mensaje son obligatorios' });
    }

    console.log('💬 Creating testimonial:', { name, message: message.substring(0, 50) });
    
    const testimonial = await create({ name, message: sanitizeMessage(message) });

    const sanitized = { ...testimonial, message: sanitizeMessage(testimonial.message) };
    console.log('✅ Testimonial created:', sanitized);
    res.status(201).json(sanitized);
  } catch (error) {
    console.error('❌ Error creating testimonial:', error);
    next(error);
  }
});

// Aprobar testimonial (admin)
router.put('/:id/approve', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await approve(id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial no encontrado' });
    }
    
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
});

// Eliminar testimonial (admin)
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteById(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Testimonial no encontrado' });
    }
    
    res.json(deleted);
  } catch (error) {
    next(error);
  }
});

export default router;
