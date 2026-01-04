import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArticleIcon from '@mui/icons-material/Article';
import useLocalStorage from '../hooks/useLocalStorage';

const AdminComments = () => {
  const [auth] = useLocalStorage('imparables-auth', null);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, commentId: null });
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadComments();
    loadPosts();
  }, []);

  const loadComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/pending`, {
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
      if (response.ok) {
        const data = await response.json();
        const postsMap = {};
        data.forEach(post => {
          postsMap[post.id] = post.title;
        });
        setPosts(postsMap);
      }
    } catch (error) {
      console.error('Error cargando posts:', error);
    }
  };

  const handleApprove = async (commentId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/${commentId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
        },
      });

      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId));
        setFeedback({
          open: true,
          message: 'Comentario aprobado exitosamente',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error aprobando comentario:', error);
      setFeedback({
        open: true,
        message: 'Error al aprobar comentario',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/${deleteDialog.commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
        },
      });

      if (response.ok) {
        setComments(comments.filter(c => c.id !== deleteDialog.commentId));
        setFeedback({
          open: true,
          message: 'Comentario eliminado exitosamente',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error eliminando comentario:', error);
      setFeedback({
        open: true,
        message: 'Error al eliminar comentario',
        severity: 'error',
      });
    } finally {
      setDeleteDialog({ open: false, commentId: null });
    }
  };

  const formattedDate = (value) => {
    if (!value) return 'Fecha desconocida';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-CO', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Gestión de Comentarios
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Aprueba o elimina comentarios pendientes de moderación
      </Typography>

      {loading ? (
        <Typography>Cargando...</Typography>
      ) : comments.length === 0 ? (
        <Alert severity="info">
          No hay comentarios pendientes de aprobación
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {comments.map((comment) => (
            <Grid item xs={12} key={comment.id}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{
                  border: '2px solid rgba(159,56,118,0.2)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(159,56,118,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    {/* Header con info del post */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Stack spacing={1} sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ArticleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          <Typography variant="subtitle2" color="primary" fontWeight={600}>
                            {posts[comment.postId] || `Post #${comment.postId}`}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {comment.name}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {formattedDate(comment.createdAt)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                      <Chip 
                        label="Pendiente" 
                        size="small" 
                        sx={{ 
                          bgcolor: 'warning.light',
                          color: 'warning.dark',
                          fontWeight: 600,
                        }} 
                      />
                    </Box>

                    <Divider />

                    {/* Contenido del comentario */}
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                      </Typography>
                    </Paper>

                    {/* Acciones */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleApprove(comment.id)}
                        sx={{
                          bgcolor: 'success.main',
                          '&:hover': {
                            bgcolor: 'success.dark',
                          },
                        }}
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialog({ open: true, commentId: comment.id })}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, commentId: null })}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, commentId: null })}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de feedback */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default AdminComments;
