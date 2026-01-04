import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { createPost, deletePost, getPosts, updatePost } from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';
import PostEditor from '../components/PostEditor';

const createEmptyDraft = () => ({
  title: '',
  category: 'Innovación feminista',
  date: new Date().toISOString().slice(0, 10),
  excerpt: '',
  image: '',
});

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState(() => createEmptyDraft());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, severity: 'success', message: '' });
  const [auth] = useLocalStorage('imparables-auth', null);

  const token = auth?.token;

  const showFeedback = (message, severity = 'success') =>
    setFeedback({ open: true, severity, message });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      showFeedback(err.message || 'Error al cargar publicaciones', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  const openEditor = (post = null) => {
    console.log('📝 Abriendo editor con post:', JSON.stringify(post, null, 2));
    setEditingId(post?.id ?? null);
    const draftData = post
      ? {
          title: post.title || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          category: post.category || 'General',
          image: post.image || '',
          author: post.author || 'Equipo Imparables',
          date: post.date ? post.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        }
      : createEmptyDraft();
    console.log('📋 Draft creado:', JSON.stringify(draftData, null, 2));
    console.log('🔍 Campos del draft:');
    console.log('  - title:', draftData.title);
    console.log('  - excerpt:', draftData.excerpt);
    console.log('  - content:', draftData.content?.substring(0, 50));
    console.log('  - image:', draftData.image);
    console.log('  - author:', draftData.author);
    setDraft(draftData);
    setEditorOpen(true);
  };

  const handleSavePost = async (formData) => {
    if (!formData.title.trim() || !formData.excerpt.trim()) {
      showFeedback('Completa al menos título y resumen', 'warning');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content?.trim() || null,
      category: formData.category?.trim() || 'General',
      image: formData.image?.trim() || null,
      author: formData.author?.trim() || 'Equipo Imparables',
      date: formData.date ? new Date(formData.date).toISOString() : undefined,
    };

    console.log('📤 Sending post data:', payload);

    setSaving(true);
    try {
      if (!token) {
        throw new Error('La sesión expiró, vuelve a iniciar sesión');
      }

      if (editingId) {
        const updated = await updatePost(editingId, payload, token);
        setPosts((prev) => prev.map((post) => (post.id === editingId ? updated : post)));
        showFeedback('Publicación actualizada');
      } else {
        const created = await createPost(payload, token);
        setPosts((prev) => [created, ...prev]);
        showFeedback('Nueva publicación creada');
      }
      setEditorOpen(false);
    } catch (err) {
      showFeedback(err.message || 'No se pudo guardar la publicación', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (!token) {
        throw new Error('La sesión expiró, vuelve a iniciar sesión');
      }
      await deletePost(deleteTarget.id, token);
      setPosts((prev) => prev.filter((post) => post.id !== deleteTarget.id));
      showFeedback('Publicación eliminada');
      setDeleteTarget(null);
    } catch (err) {
      showFeedback(err.message || 'No se pudo eliminar la publicación', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Gestión de Publicaciones
            </Typography>
            <Typography color="text.secondary">
              {filteredPosts.length} publicación{filteredPosts.length !== 1 ? 'es' : ''}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openEditor()}
            sx={{
              background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
              fontWeight: 600,
            }}
          >
            Nueva Publicación
          </Button>
        </Stack>

        {/* Search and View Controls */}
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TextField
              placeholder="Buscar publicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flexGrow: 1, minWidth: 250 }}
            />
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="grid">
                <ViewModuleIcon />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Paper>

        {loading && <LinearProgress />}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <Grid container spacing={3}>
            {filteredPosts.map((post, index) => (
              <Grid key={post.id} item xs={12} sm={6} md={4}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(159,56,118,0.2)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'rgba(159,56,118,0.1)' },
                      }}
                      onClick={() => openEditor(post)}
                    >
                      <EditIcon fontSize="small" color="primary" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'rgba(211,47,47,0.1)' },
                      }}
                      onClick={() => setDeleteTarget(post)}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Stack>
                  <Box sx={{ position: 'relative', height: 180, bgcolor: 'grey.100' }}>
                    {post.image ? (
                      <CardMedia
                        component="img"
                        height="180"
                        image={post.image}
                        alt={post.title}
                        sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;">Sin imagen</div>';
                        }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                        Sin imagen
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={1.5}>
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          bgcolor: 'rgba(159,56,118,0.15)',
                          color: '#9f3876',
                          fontWeight: 600,
                        }}
                      />
                      <Typography variant="h6" fontWeight={700}>
                        {post.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.date + 'T00:00:00').toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {post.excerpt.substring(0, 120)}
                        {post.excerpt.length > 120 ? '...' : ''}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(159,56,118,0.05)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Título</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow
                    key={post.id}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(159,56,118,0.03)' },
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={600}>{post.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.excerpt.substring(0, 80)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(159,56,118,0.15)',
                          color: '#9f3876',
                        }}
                      />
                    </TableCell>
                    <TableCell>{new Date(post.date).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" color="primary" onClick={() => openEditor(post)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(post)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && filteredPosts.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No se encontraron publicaciones' : 'Aún no hay publicaciones'}
            </Typography>
          </Paper>
        )}
      </Stack>

      {/* Editor Dialog */}
      <PostEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        post={editingId ? draft : null}
        onSave={handleSavePost}
        saving={saving}
      />

      {/* Delete Dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={deleting ? undefined : () => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar Publicación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Seguro que deseas eliminar "<strong>{deleteTarget?.title}</strong>"? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancelar
          </Button>
          <Button color="error" variant="contained" onClick={handleDeletePost} disabled={deleting}>
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={feedback.severity}
          onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPosts;
