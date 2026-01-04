import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { create, deleteById, findAll, updateById, findById } from '../models/posts.js';
import db from '../db/index.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const posts = await findAll();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// Obtener un post por ID (sin incrementar vistas automáticamente)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// Incrementar vista de un post (una por usuario)
router.post('/:id/view', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Incrementar contador de vistas
    await db('posts').where({ id }).increment('views', 1);
    
    res.json({ message: 'Vista registrada' });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, excerpt, content, image, category, date, author } = req.body;
    if (!title || !excerpt) {
      return res.status(400).json({ message: 'Título y resumen son obligatorios' });
    }

    console.log('📝 Creating post with data:', { title, excerpt, content: content?.substring(0, 50), image, category, author });

    const newPost = await create({
      title,
      excerpt,
      content,
      image,
      category,
      date,
      author,
      authorId: req.user?.id,
    });
    
    console.log('✅ Post created:', newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('❌ Error creating post:', error);
    next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('📝 Updating post:', id);
    console.log('📤 Update data:', { 
      title: req.body.title, 
      content: req.body.content?.substring(0, 50), 
      image: req.body.image 
    });
    
    const post = await updateById(id, req.body);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    console.log('✅ Post updated:', { id: post.id, content: post.content?.substring(0, 50), image: post.image });
    res.json(post);
  } catch (error) {
    console.error('❌ Error updating post:', error);
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteById(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.json(deleted);
  } catch (error) {
    next(error);
  }
});

export default router;
