import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useLocalStorage from '../hooks/useLocalStorage';
import { useSiteSettings } from '../context/SiteSettingsContext.jsx';
import { updateSiteSettings } from '../services/api.js';

const AdminSettings = () => {
  const { settings: currentSettings, loading: settingsLoading, error: loadError, refresh } = useSiteSettings();
  const [auth] = useLocalStorage('imparables-auth', null);
  const initialState = {
    siteName: 'Imparables',
    siteDescription: 'Mujeres que transforman el mundo desde el Pacífico colombiano',
    contactEmail: 'contacto@imparables.com',
    socialFacebook: 'https://facebook.com/imparables',
    socialInstagram: 'https://instagram.com/imparables',
    socialTiktok: 'https://tiktok.com/@imparables',
    socialWhatsapp: 'https://wa.me/573000000000',
    enableComments: true,
    enableNewsletter: true,
    enableNotifications: true,
    maintenanceMode: false,
    siteVersion: 'v1.0.0',
    siteStatus: 'active',
  };
  const [formValues, setFormValues] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (currentSettings) {
      setFormValues({
        siteName: currentSettings.siteName,
        siteDescription: currentSettings.siteDescription,
        contactEmail: currentSettings.contactEmail,
        socialFacebook: currentSettings.socialFacebook,
        socialInstagram: currentSettings.socialInstagram,
        socialTiktok: currentSettings.socialTiktok,
        socialWhatsapp: currentSettings.socialWhatsapp,
        enableComments: currentSettings.enableComments,
        enableNewsletter: currentSettings.enableNewsletter,
        enableNotifications: currentSettings.enableNotifications,
        maintenanceMode: currentSettings.maintenanceMode,
        siteVersion: currentSettings.siteVersion,
        siteStatus: currentSettings.siteStatus,
      });
    }
  }, [currentSettings]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggle = (field) => (event) => {
    const checked = event.target.checked;
    setFormValues((prev) => ({
      ...prev,
      [field]: checked,
      ...(field === 'maintenanceMode'
        ? { siteStatus: checked ? 'maintenance' : 'active' }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.token) {
      setFeedback({
        open: true,
        message: 'Tu sesión expiró. Inicia sesión nuevamente para guardar cambios.',
        severity: 'error',
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formValues,
        siteStatus: formValues.maintenanceMode ? 'maintenance' : 'active',
        siteVersion: formValues.siteVersion || 'v1.0.0',
      };
      await updateSiteSettings(payload, auth.token);
      setFeedback({
        open: true,
        message: 'Configuración guardada exitosamente',
        severity: 'success',
      });
      refresh();
    } catch (err) {
      console.error('Error guardando configuración:', err);
      setFeedback({
        open: true,
        message: err.message || 'No se pudo guardar la configuración',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const lastUpdatedLabel = useMemo(() => {
    if (!currentSettings?.updatedAt) return 'Sin cambios';
    return new Date(currentSettings.updatedAt).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [currentSettings?.updatedAt]);

  if (settingsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Alert severity="error">
        {loadError}
      </Alert>
    );
  }

  const SettingSection = ({ title, icon, children }) => (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        border: '2px solid rgba(159,56,118,0.2)',
        mb: 3,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {icon}
          </Avatar>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Configuración del Sitio
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Gestiona la configuración general de la plataforma
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* Información General */}
            <SettingSection title="Información General" icon={<LanguageIcon />}>
              <Stack spacing={3}>
                <TextField
                  label="Nombre del Sitio"
                  fullWidth
                  value={formValues.siteName}
                  onChange={handleChange('siteName')}
                />
                <TextField
                  label="Descripción del Sitio"
                  fullWidth
                  multiline
                  rows={3}
                  value={formValues.siteDescription}
                  onChange={handleChange('siteDescription')}
                />
                <TextField
                  label="Email de Contacto"
                  type="email"
                  fullWidth
                  value={formValues.contactEmail}
                  onChange={handleChange('contactEmail')}
                />
              </Stack>
            </SettingSection>

            {/* Redes Sociales */}
            <SettingSection title="Redes Sociales" icon={<EmailIcon />}>
              <Stack spacing={3}>
                <TextField
                  label="Facebook"
                  fullWidth
                  value={formValues.socialFacebook}
                  onChange={handleChange('socialFacebook')}
                  placeholder="https://facebook.com/tu-pagina"
                />
                <TextField
                  label="Instagram"
                  fullWidth
                  value={formValues.socialInstagram}
                  onChange={handleChange('socialInstagram')}
                  placeholder="https://instagram.com/tu-cuenta"
                />
                <TextField
                  label="TikTok"
                  fullWidth
                  value={formValues.socialTiktok}
                  onChange={handleChange('socialTiktok')}
                  placeholder="https://tiktok.com/@tu-cuenta"
                />
                <TextField
                  label="WhatsApp"
                  fullWidth
                  value={formValues.socialWhatsapp}
                  onChange={handleChange('socialWhatsapp')}
                  placeholder="https://wa.me/573000000000"
                />
              </Stack>
            </SettingSection>

            {/* Funcionalidades */}
            <SettingSection title="Funcionalidades" icon={<SettingsIcon />}>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.enableComments}
                      onChange={handleToggle('enableComments')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight={600}>Habilitar Comentarios</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Permite que los usuarios comenten en las publicaciones
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.enableNewsletter}
                      onChange={handleToggle('enableNewsletter')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight={600}>Newsletter</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Permite suscripciones al boletín informativo
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.enableNotifications}
                      onChange={handleToggle('enableNotifications')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight={600}>Notificaciones</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Envía notificaciones por email a los administradores
                      </Typography>
                    </Box>
                  }
                />
              </Stack>
            </SettingSection>
          </Grid>

          <Grid item xs={12} lg={4}>
            {/* Panel de Estado */}
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{
                background: 'linear-gradient(135deg, rgba(159,56,118,0.1), rgba(246,164,253,0.1))',
                border: '2px solid rgba(159,56,118,0.2)',
                position: 'sticky',
                top: 20,
              }}
            >
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <NotificationsIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700}>
                        Estado del Sistema
                      </Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                  </Box>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Estado del Sitio
                      </Typography>
                      <Chip
                        label={formValues.maintenanceMode ? 'Mantenimiento' : 'Activo'}
                        color={formValues.maintenanceMode ? 'warning' : 'success'}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Versión
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formValues.siteVersion || 'v1.0.0'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Última actualización
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {lastUpdatedLabel}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formValues.maintenanceMode}
                        onChange={handleToggle('maintenanceMode')}
                        color="warning"
                      />
                    }
                    label={
                      <Box>
                        <Typography fontWeight={600}>Modo Mantenimiento</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Desactiva el sitio temporalmente
                        </Typography>
                      </Box>
                    }
                  />

                  {formValues.maintenanceMode && (
                    <Alert severity="warning">
                      El sitio está en modo mantenimiento. Los visitantes verán un mensaje de mantenimiento.
                    </Alert>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Botón de Guardar */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={saving}
              startIcon={<SaveIcon />}
              sx={{
                mt: 3,
                background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                fontWeight: 700,
                py: 1.5,
              }}
            >
              {saving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar de feedback */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={feedback.severity} onClose={() => setFeedback({ ...feedback, open: false })}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSettings;
