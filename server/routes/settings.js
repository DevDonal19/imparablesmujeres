import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { getSiteSettings, updateSiteSettings } from '../models/settings.js';

const router = Router();

const validatePayload = (payload = {}) => {
  const errors = [];
  const requiredFields = ['siteName', 'siteDescription', 'contactEmail', 'siteStatus', 'siteVersion'];
  requiredFields.forEach((field) => {
    if (!payload[field] || typeof payload[field] !== 'string' || !payload[field].trim()) {
      errors.push(`El campo ${field} es requerido`);
    }
  });

  if (payload.siteStatus && !['active', 'maintenance'].includes(payload.siteStatus)) {
    errors.push('siteStatus debe ser "active" o "maintenance"');
  }

  return errors;
};

router.get('/', async (_req, res, next) => {
  try {
    const settings = await getSiteSettings();
    return res.json(settings);
  } catch (error) {
    return next(error);
  }
});

router.put('/', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const payload = req.body || {};
    const errors = validatePayload(payload);
    if (errors.length) {
      return res.status(400).json({ message: errors.join('. ') });
    }

    const normalizedPayload = {
      siteName: payload.siteName.trim(),
      siteDescription: payload.siteDescription.trim(),
      contactEmail: payload.contactEmail.trim(),
      socialFacebook: payload.socialFacebook?.trim() || '',
      socialInstagram: payload.socialInstagram?.trim() || '',
      socialTiktok: payload.socialTiktok?.trim() || '',
      socialWhatsapp: payload.socialWhatsapp?.trim() || '',
      enableComments: Boolean(payload.enableComments),
      enableNewsletter: Boolean(payload.enableNewsletter),
      enableNotifications: Boolean(payload.enableNotifications),
      maintenanceMode: Boolean(payload.maintenanceMode),
      siteStatus: payload.siteStatus,
      siteVersion: payload.siteVersion.trim(),
    };

    const updated = await updateSiteSettings(normalizedPayload);
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

export default router;
