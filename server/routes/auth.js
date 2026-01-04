import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findByEmail } from '../models/users.js';

const router = Router();
const { JWT_SECRET = 'super-secret' } = process.env;

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const user = await findByEmail(email);

    if (!user || !user.active) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.display_name,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '4h' });
    res.json({ token, user: payload });
  } catch (error) {
    next(error);
  }
});

export default router;
