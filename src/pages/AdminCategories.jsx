import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import useLocalStorage from '../hooks/useLocalStorage';

const AdminCategories = () => {
  const [auth] = useLocalStorage('imparables-auth', null);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#9f3876',
    description: '',
  });
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        color: category.color || '#9f3876',
        description: category.description || '',
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        color: '#9f3876',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      color: '#9f3876',
      description: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = selectedCategory
        ? `${import.meta.env.VITE_API_URL}/categories/${selectedCategory.id}`
        : `${import.meta.env.VITE_API_URL}/categories`;
      
      const method = selectedCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFeedback({
          open: true,
          message: selectedCategory ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente',
          severity: 'success',
        });
        loadCategories();
        handleCloseDialog();
      } else {
        const error = await response.json();
        setFeedback({
          open: true,
          message: error.message || 'Error al guardar categoría',
          severity: 'error',
        });
      }
    } catch (error) {
      setFeedback({
        open: true,
        message: 'Error de conexión',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${selectedCategory.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });

      if (response.ok) {
        setFeedback({
          open: true,
          message: 'Categoría eliminada exitosamente',
          severity: 'success',
        });
        loadCategories();
        setOpenDeleteDialog(false);
        setSelectedCategory(null);
      } else {
        const error = await response.json();
        setFeedback({
          open: true,
          message: error.message || 'Error al eliminar categoría',
          severity: 'error',
        });
      }
    } catch (error) {
      setFeedback({
        open: true,
        message: 'Error de conexión',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Categorías del Blog
          </Typography>
          <Typography color="text.secondary">
            Gestiona las categorías para organizar tus publicaciones
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
            fontWeight: 700,
          }}
        >
          Nueva Categoría
        </Button>
      </Stack>

      <Grid container spacing={3} mb={4}>
        {categories.map((category, index) => (
          <Grid key={category.id} item xs={12} sm={6} md={4}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                border: `2px solid ${category.color}30`,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Avatar sx={{ bgcolor: category.color, width: 48, height: 48 }}>
                      <CategoryIcon />
                    </Avatar>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => handleOpenDialog(category)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedCategory(category);
                          setOpenDeleteDialog(true);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {category.name}
                    </Typography>
                    {category.description && (
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={`${category.postCount || 0} publicaciones`}
                      size="small"
                      sx={{ bgcolor: `${category.color}20`, color: category.color }}
                    />
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: category.color,
                        border: '2px solid white',
                        boxShadow: 1,
                      }}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {categories.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No hay categorías creadas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Crea tu primera categoría para organizar las publicaciones
          </Typography>
        </Paper>
      )}

      {/* Dialog para crear/editar categoría */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {selectedCategory ? <EditIcon /> : <AddIcon />}
            </Avatar>
            <Typography variant="h5" fontWeight={800}>
              {selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </Typography>
          </Stack>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                label="Nombre de la categoría"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Color"
                type="color"
                fullWidth
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ColorLensIcon />
                    </InputAdornment>
                  ),
                }}
                helperText="Selecciona un color para identificar la categoría"
              />
              <TextField
                label="Descripción (opcional)"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                helperText="Breve descripción de qué tipo de contenido incluye esta categoría"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                fontWeight: 700,
              }}
            >
              {selectedCategory ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás segura de eliminar la categoría <strong>{selectedCategory?.name}</strong>?
          </Typography>
          {selectedCategory?.postCount > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Esta categoría tiene {selectedCategory.postCount} publicación(es) asociada(s).
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

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

export default AdminCategories;
