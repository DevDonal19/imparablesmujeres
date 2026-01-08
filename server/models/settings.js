import db from '../db/index.js';

const TABLE = 'site_settings';

const DEFAULT_SETTINGS = {
  site_name: 'Imparables',
  site_description: 'Mujeres que transforman el mundo desde el Pacífico colombiano',
  contact_email: 'contacto@imparables.com',
  social_facebook: 'https://facebook.com/imparables',
  social_instagram: 'https://instagram.com/imparables',
  social_tiktok: 'https://tiktok.com/@imparables',
  social_whatsapp: 'https://wa.me/573000000000',
  enable_comments: true,
  enable_newsletter: true,
  enable_notifications: true,
  maintenance_mode: false,
  site_status: 'active',
  site_version: 'v1.0.0',
};

const mapToResponse = (record) => ({
  id: record.id,
  siteName: record.site_name,
  siteDescription: record.site_description,
  contactEmail: record.contact_email,
  socialFacebook: record.social_facebook,
  socialInstagram: record.social_instagram,
  socialTiktok: record.social_tiktok,
  socialWhatsapp: record.social_whatsapp,
  enableComments: Boolean(record.enable_comments),
  enableNewsletter: Boolean(record.enable_newsletter),
  enableNotifications: Boolean(record.enable_notifications),
  maintenanceMode: Boolean(record.maintenance_mode),
  siteStatus: record.site_status,
  siteVersion: record.site_version,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

const mapToDatabase = (payload) => ({
  site_name: payload.siteName,
  site_description: payload.siteDescription,
  contact_email: payload.contactEmail,
  social_facebook: payload.socialFacebook,
  social_instagram: payload.socialInstagram,
  social_tiktok: payload.socialTiktok,
  social_whatsapp: payload.socialWhatsapp,
  enable_comments: payload.enableComments,
  enable_newsletter: payload.enableNewsletter,
  enable_notifications: payload.enableNotifications,
  maintenance_mode: payload.maintenanceMode,
  site_status: payload.siteStatus,
  site_version: payload.siteVersion,
});

const ensureSettingsRow = async () => {
  const existing = await db(TABLE).first();
  if (existing) return existing;
  const [insertedId] = await db(TABLE).insert(DEFAULT_SETTINGS);
  return db(TABLE).where({ id: insertedId }).first();
};

export const getSiteSettings = async () => {
  const settings = await ensureSettingsRow();
  return mapToResponse(settings);
};

export const updateSiteSettings = async (payload) => {
  const settings = await ensureSettingsRow();
  const data = mapToDatabase(payload);
  await db(TABLE).where({ id: settings.id }).update({
    ...data,
    updated_at: db.fn.now(),
  });
  const updated = await db(TABLE).where({ id: settings.id }).first();
  return mapToResponse(updated);
};
