import { ensureAdminSeed } from '../models/users.js';

export const bootstrapAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  const displayName = process.env.ADMIN_DISPLAY_NAME || 'Editora Imparable';

  if (!email || !password) {
    console.warn('⚠️ ADMIN_EMAIL y ADMIN_SEED_PASSWORD no están definidos. No se creó usuario inicial.');
    return;
  }

  try {
    const admin = await ensureAdminSeed({ email, password, displayName });
    if (admin) {
      console.info(`✓ Usuario admin verificado (${admin.email}).`);
    }
  } catch (error) {
    console.error('No se pudo crear/verificar el usuario admin inicial:', error.message);
  }
};
