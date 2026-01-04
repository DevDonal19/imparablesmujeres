import { useMemo, useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Grid,
  IconButton,
  Modal,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { getAssetUrl } from '../utils/assets';

const StickerButton = styled(ButtonBase)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(-4),
  right: theme.spacing(2),
  backgroundColor: '#fff',
  borderRadius: 24,
  padding: theme.spacing(0.5),
  boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px) rotate(-4deg) scale(1.05)',
  },
  '&:focus-visible': {
    outline: '3px solid rgba(159,56,118,0.4)',
    outlineOffset: 2,
  },
}));

const stickerImage = getAssetUrl('doll-imparables.png');

const stickerVariants = {
  idle: {
    rotate: [-6, 3, -2, 0],
    y: [0, -4, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(500px, 90vw)',
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const defaultTestimonials = [
  {
    name: 'Yurani',
    message: 'Ser Imparable es recordar que mis ancestras caminan conmigo cada vez que alzo la voz.',
  },
  {
    name: 'Luz Dary',
    message: 'Aquí aprendí a hackear el miedo con redes de amor propio y comunidad.',
  },
  {
    name: 'Alejandra',
    message: 'Nuestros cuerpos son territorios de dignidad. Imparables me enseñó a cuidarlo.',
  },
];

const ITEMS_PER_PAGE = 3;

const cleanMessage = (message = '') => {
  let cleaned = message
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&');

  // Eliminar bloques CSS inyectados como texto (ej. ';position:absolute...}}')
  cleaned = cleaned.replace(/;position:absolute[\s\S]*?}}/gi, '');

  // Si aún quedan dobles llaves, quedarse con lo que sigue al último '}}'
  if (cleaned.includes('}}')) {
    cleaned = cleaned.substring(cleaned.lastIndexOf('}}') + 2);
  }

  return cleaned.trim();
};

const Muro = () => {
  const [testimonios, setTestimonios] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', mensaje: '' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/testimonials/approved`);
      if (response.ok) {
        const data = await response.json();
        const sanitized = data.map((item) => ({
          ...item,
          message: cleanMessage(item.message || ''),
        }));
        setTestimonios(sanitized);
      }
    } catch (error) {
      console.error('Error cargando testimonios:', error);
      // Fallback a testimonios por defecto
      setTestimonios(defaultTestimonials.map((item) => ({
        ...item,
        message: cleanMessage(item.message),
      })));
    }
  };

  const totalPages = Math.max(1, Math.ceil(testimonios.length / ITEMS_PER_PAGE));

  const testimoniosPagina = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return testimonios.slice(start, start + ITEMS_PER_PAGE);
  }, [page, testimonios]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.mensaje.trim()) return;

    setLoading(true);
    try {
      console.log('📤 Enviando testimonio a:', `${import.meta.env.VITE_API_URL}/testimonials`);
      console.log('📝 Datos:', { name: form.nombre.trim(), message: form.mensaje.trim() });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.nombre.trim(),
          message: form.mensaje.trim(),
        }),
      });

      console.log('📥 Respuesta status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Testimonio creado:', data);
        setForm({ nombre: '', mensaje: '' });
        setOpen(false);
        setFeedback({
          open: true,
          message: '¡Gracias por tu testimonio! Será revisado y publicado pronto.',
          severity: 'success',
        });
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        console.error('❌ Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error al enviar testimonio');
      }
    } catch (error) {
      console.error('❌ Error enviando testimonio:', error);
      setFeedback({
        open: true,
        message: error.message || 'Hubo un error al enviar tu testimonio. Intenta de nuevo.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="section"
      id="muro"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 6 },
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(246,164,253,0.08), rgba(159,56,118,0.05))',
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        sx={{
          p: { xs: 3, md: 5 },
          position: 'relative',
          overflow: 'visible',
          background: 'linear-gradient(135deg, #fff, rgba(246,164,253,0.05))',
          border: '2px solid rgba(159,56,118,0.2)',
          boxShadow: '0 20px 60px rgba(159,56,118,0.15)',
        }}
        elevation={0}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', md: '3rem' }, mb: 2 }}>
            ¿Qué significa para ti ser Imparable?
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '1.1rem', maxWidth: 700, mx: 'auto' }}>
            Comparte tu voz y ayuda a inspirar a otras mujeres en el Pacífico y todo el mundo.
          </Typography>
        </Box>

        <StickerButton
          aria-label="Abrir formulario para compartir tu testimonio"
          onClick={() => setOpen(true)}
          focusRipple
        >
          <Box
            component={motion.div}
            initial={false}
            animate={prefersReducedMotion ? {} : 'idle'}
            variants={stickerVariants}
            sx={{ position: 'relative' }}
          >
            <Box
              component="img"
              src={stickerImage}
              alt="Sticker de la muñeca Imparables"
              sx={{ width: 120, height: 'auto', display: 'block' }}
            />
            <CampaignIcon
              fontSize="large"
              aria-hidden="true"
              color="primary"
              sx={{
                position: 'absolute',
                bottom: 6,
                right: 8,
                backgroundColor: '#fff',
                borderRadius: '50%',
                p: 0.5,
                boxShadow: '0 10px 20px rgba(159,56,118,0.25)',
              }}
            />
          </Box>
        </StickerButton>

        <Grid container spacing={3}>
          {testimoniosPagina.map((testimonio, index) => (
            <Grid item xs={12} md={4} key={`${testimonio.name}-${index}`}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, rgba(159,56,118,0.05), #fff)',
                  border: '2px solid rgba(159,56,118,0.15)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(159,56,118,0.2)',
                    borderColor: 'rgba(159,56,118,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
                    <Avatar
                      aria-hidden="true"
                      sx={{
                        bgcolor: 'primary.main',
                        width: 48,
                        height: 48,
                        fontWeight: 700,
                        fontSize: '1.2rem',
                      }}
                    >
                      {testimonio.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {testimonio.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        Comunidad Imparable
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography
                    component="pre"
                    color="text.primary"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                      position: 'relative',
                      pl: 2,
                    }}
                  >
                    {testimonio.message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            aria-label="Paginación testimonios"
          />
        </Box>
      </Paper>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-muro-title"
      >
        <Box component="form" onSubmit={handleSubmit} sx={modalStyle}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography id="modal-muro-title" variant="h5">
              Comparte tu testimonio
            </Typography>
            <IconButton onClick={() => setOpen(false)} aria-label="Cerrar">
              <CloseIcon />
            </IconButton>
          </Stack>
          <TextField
            fullWidth
            label="Nombre"
            value={form.nombre}
            onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            multiline
            label="Mensaje"
            minRows={4}
            value={form.mensaje}
            onChange={(event) => setForm((prev) => ({ ...prev, mensaje: event.target.value }))}
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setFeedback({ ...feedback, open: false })} 
          severity={feedback.severity}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Muro;
