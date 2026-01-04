import bcrypt from 'bcryptjs';
import db from '../db/knex.js';

const TABLE = 'users';

export const findByEmail = (email) => db(TABLE).where({ email }).first();

export const createUser = async ({ email, passwordHash, displayName, role = 'editor' }) => {
  await db(TABLE).insert({ email, password_hash: passwordHash, display_name: displayName, role });
};

export const ensureAdminSeed = async ({
  email,
  password,
  displayName = process.env.ADMIN_DISPLAY_NAME || 'Editora Imparable',
}) => {
  if (!email || !password) {
    console.warn('⚠️ No se proporcionaron credenciales de admin para el seed inicial');
    return null;
  }

  const existing = await findByEmail(email);
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(password, 10);
  await createUser({ email, passwordHash, displayName, role: 'admin' });
  return findByEmail(email);
};
