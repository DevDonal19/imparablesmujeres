import { useState } from 'react';
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
} from '@mui/material';
import { motion } from 'framer-motion';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
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
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular guardado (aquí conectarías con tu API)
    setTimeout(() => {
      setFeedback({
        open: true,
        message: 'Configuración guardada exitosamente',
        severity: 'success',
      });
      setLoading(false);
    }, 1000);
  };

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
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
                <TextField
                  label="Descripción del Sitio"
                  fullWidth
                  multiline
                  rows={3}
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                />
                <TextField
                  label="Email de Contacto"
                  type="email"
                  fullWidth
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </Stack>
            </SettingSection>

            {/* Redes Sociales */}
            <SettingSection title="Redes Sociales" icon={<EmailIcon />}>
              <Stack spacing={3}>
                <TextField
                  label="Facebook"
                  fullWidth
                  value={settings.socialFacebook}
                  onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                  placeholder="https://facebook.com/tu-pagina"
                />
                <TextField
                  label="Instagram"
                  fullWidth
                  value={settings.socialInstagram}
                  onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                  placeholder="https://instagram.com/tu-cuenta"
                />
                <TextField
                  label="TikTok"
                  fullWidth
                  value={settings.socialTiktok}
                  onChange={(e) => setSettings({ ...settings, socialTiktok: e.target.value })}
                  placeholder="https://tiktok.com/@tu-cuenta"
                />
                <TextField
                  label="WhatsApp"
                  fullWidth
                  value={settings.socialWhatsapp}
                  onChange={(e) => setSettings({ ...settings, socialWhatsapp: e.target.value })}
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
                      checked={settings.enableComments}
                      onChange={(e) => setSettings({ ...settings, enableComments: e.target.checked })}
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
                      checked={settings.enableNewsletter}
                      onChange={(e) => setSettings({ ...settings, enableNewsletter: e.target.checked })}
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
                      checked={settings.enableNotifications}
                      onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
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
                        label={settings.maintenanceMode ? 'Mantenimiento' : 'Activo'}
                        color={settings.maintenanceMode ? 'warning' : 'success'}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Versión
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        v1.0.0
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Última actualización
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {new Date().toLocaleDateString('es-CO')}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
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

                  {settings.maintenanceMode && (
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
              disabled={loading}
              startIcon={<SaveIcon />}
              sx={{
                mt: 3,
                background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                fontWeight: 700,
                py: 1.5,
              }}
            >
              {loading ? 'Guardando...' : 'Guardar Configuración'}
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
