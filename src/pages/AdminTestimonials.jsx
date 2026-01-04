import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import useLocalStorage from '../hooks/useLocalStorage';

const AdminTestimonials = () => {
  const [auth] = useLocalStorage('imparables-auth', null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/testimonials`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error cargando testimonios:', error);
      showFeedback('Error cargando testimonios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (message, severity = 'success') => {
    setFeedback({ open: true, message, severity });
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/testimonials/${id}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });

      if (response.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, approved: true } : t))
        );
        showFeedback('Testimonio aprobado');
      } else {
        throw new Error('Error al aprobar');
      }
    } catch (error) {
      console.error('Error aprobando testimonio:', error);
      showFeedback('Error al aprobar testimonio', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/testimonials/${deleteTarget}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });

      if (response.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget));
        showFeedback('Testimonio eliminado');
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      console.error('Error eliminando testimonio:', error);
      showFeedback('Error al eliminar testimonio', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const pendingCount = testimonials.filter((t) => !t.approved).length;
  const approvedCount = testimonials.filter((t) => t.approved).length;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Testimonios
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Chip
          label={`${pendingCount} Pendientes`}
          color="warning"
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label={`${approvedCount} Aprobados`}
          color="success"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      {loading ? (
        <Typography>Cargando...</Typography>
      ) : testimonials.length === 0 ? (
        <Alert severity="info">No hay testimonios aún</Alert>
      ) : (
        <Stack spacing={2}>
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              sx={{
                border: testimonial.approved ? '2px solid #4caf50' : '2px solid #ff9800',
                bgcolor: testimonial.approved ? 'rgba(76,175,80,0.05)' : 'rgba(255,152,0,0.05)',
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body1" fontWeight={600}>
                          {testimonial.name}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(testimonial.created_at).toLocaleDateString('es-CO')}
                        </Typography>
                      </Stack>
                      {testimonial.approved ? (
                        <Chip
                          label="Aprobado"
                          color="success"
                          size="small"
                          icon={<CheckCircleIcon />}
                        />
                      ) : (
                        <Chip label="Pendiente" color="warning" size="small" />
                      )}
                    </Stack>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                      "{testimonial.message}"
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {!testimonial.approved && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleApprove(testimonial.id)}
                      >
                        Aprobar
                      </Button>
                    )}
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => setDeleteTarget(testimonial.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar este testimonio? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert severity={feedback.severity}>{feedback.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminTestimonials;
