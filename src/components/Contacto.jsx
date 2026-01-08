import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { apiFetch } from '../utils/api';
import { useSiteSettings } from '../context/SiteSettingsContext.jsx';

const Contacto = () => {
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { settings } = useSiteSettings();

  const socialLinks = useMemo(() => {
    const defaultLinks = [
      { label: 'Facebook', key: 'socialFacebook', icon: <FacebookIcon />, color: '#1877F2' },
      { label: 'Instagram', key: 'socialInstagram', icon: <InstagramIcon />, color: '#E1306C' },
      { label: 'TikTok', key: 'socialTiktok', icon: <MusicNoteIcon />, color: '#010101' },
      { label: 'WhatsApp', key: 'socialWhatsapp', icon: <WhatsAppIcon />, color: '#25D366' },
    ];

    return defaultLinks
      .map((link) => ({
        ...link,
        href: settings?.[link.key] || '',
      }))
      .filter((link) => Boolean(link.href));
  }, [settings]);

  const contactEmail = settings?.contactEmail || 'contacto@imparables.com';

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await apiFetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        setSnackbar({ 
          open: true, 
          message: '¡Gracias por escribirnos! Hemos enviado una confirmación a tu correo. Muy pronto nos pondremos en contacto.' 
        });
        setForm({ nombre: '', correo: '', mensaje: '' });
      } else {
        setSnackbar({ 
          open: true, 
          message: 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.' 
        });
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error de conexión. Por favor, verifica tu internet e intenta nuevamente.' 
      });
    }
  };

  return (
    <Box component="section" id="contacto" sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, md: 6 } }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          component={motion.h2}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', md: '3rem' }, mb: 2 }}
        >
          Conversemos
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          component={motion.p}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Estamos listas para acompañar tus procesos
        </Typography>
      </Box>

      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(159,56,118,0.08), rgba(246,164,253,0.08))',
              border: '2px solid rgba(159,56,118,0.2)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={4}>
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h5" fontWeight={700}>
                      Información de Contacto
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                    Estamos listas para acompañar tus procesos comunitarios, institucionales o personales. Escríbenos a{' '}
                    <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {contactEmail}
                    </Box>{' '}
                    o completa el formulario y nos pondremos en contacto contigo.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Síguenos en redes sociales
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" aria-label="Redes sociales" sx={{ mt: 2 }}>
                    {socialLinks.length === 0 && (
                      <Typography color="text.secondary">Pronto compartiremos nuestras redes.</Typography>
                    )}
                    {socialLinks.map((social) => (
                      <IconButton
                        key={social.label}
                        component="a"
                        href={social.href}
                        target="_blank"
                        rel="noopener"
                        aria-label={`Ir a ${social.label}`}
                        sx={{
                          border: '2px solid',
                          borderColor: social.color,
                          color: social.color,
                          width: 56,
                          height: 56,
                          '&:hover': {
                            backgroundColor: `${social.color}20`,
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 20px ${social.color}40`,
                          },
                          transition: 'all 0.3s',
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                  </Stack>
                </Box>

                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(189,29,130,0.1), rgba(159,56,118,0.05))',
                    border: '2px solid rgba(189,29,130,0.2)',
                  }}
                >
                  <Typography variant="body1" fontWeight={600} color="primary.dark" gutterBottom>
                    💜 Horario de atención
                  </Typography>
                  <Typography color="text.secondary">
                    Lunes a Viernes: 8:00 AM - 5:00 PM
                  </Typography>
                  <Typography color="text.secondary">
                    Sábados: 9:00 AM - 1:00 PM
                  </Typography>
                </Paper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #fff, rgba(246,164,253,0.05))',
              border: '2px solid rgba(189,29,130,0.2)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Envíanos un mensaje
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Completa el formulario y te responderemos pronto
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Nombre completo"
                    value={form.nombre}
                    onChange={handleChange('nombre')}
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Correo electrónico"
                    type="email"
                    value={form.correo}
                    onChange={handleChange('correo')}
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Mensaje"
                    multiline
                    minRows={5}
                    value={form.mensaje}
                    onChange={handleChange('mensaje')}
                    required
                    variant="outlined"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                      '&:hover': {
                        background: 'linear-gradient(120deg, #bd1d82, #9f3876)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(159,56,118,0.4)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Enviar Mensaje
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbar({ open: false, message: '' })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contacto;
