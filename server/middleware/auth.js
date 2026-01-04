import jwt from 'jsonwebtoken';

const { JWT_SECRET = 'super-secret' } = process.env;

// Middleware de autenticación
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar rol de administrador
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

// Middleware para verificar rol de editor o superior
const authorizeEditor = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'editor') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de editor.' });
  }
  next();
};

// Alias para compatibilidad
const requireAuth = authenticate;

export {
  authenticate,
  authorizeAdmin,
  authorizeEditor,
  requireAuth,
};
