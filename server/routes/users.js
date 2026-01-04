import express from 'express';
import bcrypt from 'bcryptjs';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import db from '../db/index.js';

const router = express.Router();

// Obtener todos los usuarios (requiere autenticación)
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'email', 'display_name as displayName', 'role', 'created_at as createdAt')
      .orderBy('created_at', 'desc');
    
    res.json(users);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario específico
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await db('users')
      .select('id', 'email', 'display_name as displayName', 'role', 'created_at as createdAt')
      .where({ id: req.params.id })
      .first();
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

// Crear nuevo usuario (solo admin)
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { email, password, displayName, role } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    
    // Verificar si el email ya existe
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const [userId] = await db('users').insert({
      email,
      password_hash: hashedPassword,
      display_name: displayName || email.split('@')[0],
      role: role || 'editor',
    });
    
    const newUser = await db('users')
      .select('id', 'email', 'display_name as displayName', 'role', 'created_at as createdAt')
      .where({ id: userId })
      .first();
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// Actualizar usuario
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, password, role } = req.body;
    
    // Solo admin puede cambiar roles o editar otros usuarios
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para editar este usuario' });
    }
    
    // Solo admin puede cambiar roles
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores pueden cambiar roles' });
    }
    
    const updateData = {};
    if (displayName) updateData.display_name = displayName;
    if (role && req.user.role === 'admin') updateData.role = role;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password_hash = hashedPassword;
    }
    
    await db('users').where({ id }).update(updateData);
    
    const updatedUser = await db('users')
      .select('id', 'email', 'display_name as displayName', 'role', 'created_at as createdAt')
      .where({ id })
      .first();
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // No permitir que el admin se elimine a sí mismo
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
    }
    
    const deleted = await db('users').where({ id }).del();
    
    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

// Actualizar perfil propio
router.put('/profile/me', authenticate, async (req, res) => {
  try {
    const { displayName, currentPassword, newPassword } = req.body;
    
    const updateData = {};
    
    if (displayName) {
      updateData.display_name = displayName;
    }
    
    // Si quiere cambiar la contraseña, verificar la actual
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Debes proporcionar tu contraseña actual' });
      }
      
      const user = await db('users').where({ id: req.user.id }).first();
      const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
      
      if (!validPassword) {
        return res.status(400).json({ message: 'Contraseña actual incorrecta' });
      }
      
      updateData.password_hash = await bcrypt.hash(newPassword, 10);
    }
    
    if (Object.keys(updateData).length > 0) {
      await db('users').where({ id: req.user.id }).update(updateData);
    }
    
    const updatedUser = await db('users')
      .select('id', 'email', 'display_name as displayName', 'role', 'created_at as createdAt')
      .where({ id: req.user.id })
      .first();
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

export default router;
