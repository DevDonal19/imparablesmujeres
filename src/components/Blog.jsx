import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import useLocalStorage from '../hooks/useLocalStorage';
import { createPost, deletePost, getPosts, login as loginRequest, updatePost } from '../services/api';

const createEmptyDraft = () => ({
  title: '',
  category: 'Innovación feminista',
  date: new Date().toISOString().slice(0, 10),
  excerpt: '',
  image: '',
});

const Blog = () => {
  const cardRefs = useRef([]);
  const [posts, setPosts] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [auth, setAuth] = useLocalStorage('imparables-auth', null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [processingLogin, setProcessingLogin] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState(() => createEmptyDraft());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, severity: 'success', message: '' });
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const isAuthenticated = Boolean(auth?.token);
  const token = auth?.token;
  const userName = auth?.user?.displayName || auth?.user?.email?.split('@')[0] || 'Editor';
  const userEmail = auth?.user?.email || '';

  const showFeedback = (message, severity = 'success') =>
    setFeedback({ open: true, severity, message });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
      setVisible(data.map(() => false));
      setError('');
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    setVisible((prev) => posts.map((_, index) => prev[index] ?? false));
  }, [posts]);

  const observer = useMemo(
    () =>
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = Number(entry.target.getAttribute('data-index'));
              setVisible((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }
          });
        },
        { threshold: 0.3 }
      ),
    []
  );

  useEffect(() => {
    const currentRefs = cardRefs.current;
    currentRefs.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [observer, posts.length]);

  const formattedDate = (value) => {
    if (!value) return 'Fecha por confirmar';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Validar token al cargar
  useEffect(() => {
    if (auth?.token) {
      // Verificar si el token ha expirado (validación básica)
      try {
        const tokenParts = auth.token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const expirationTime = payload.exp * 1000;
          if (Date.now() >= expirationTime) {
            setAuth(null);
            showFeedback('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'warning');
          }
        }
      } catch (err) {
        console.error('Error validando token:', err);
      }
    }
  }, [auth, setAuth]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setProcessingLogin(true);
    try {
      const result = await loginRequest(loginForm);
      setAuth(result);
      setLoginOpen(false);
      setLoginForm({ email: '', password: '' });
      setShowPassword(false);
      showFeedback(`¡Bienvenida, ${result.user?.displayName || 'Editora'}!`, 'success');
    } catch (err) {
      showFeedback(err.message || 'No se pudo iniciar sesión', 'error');
    } finally {
      setProcessingLogin(false);
    }
  };

  const handleLogout = () => {
    setUserMenuAnchor(null);
    setAuth(null);
    showFeedback('Sesión cerrada exitosamente', 'info');
  };

  const openEditor = (post = null) => {
    setEditingId(post?.id ?? null);
    setDraft(
      post
        ? {
            ...post,
            date: post.date ? post.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
          }
        : createEmptyDraft()
    );
    setEditorOpen(true);
  };

  const handleSavePost = async (event) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.excerpt.trim()) {
      showFeedback('Completa al menos título y resumen', 'warning');
      return;
    }

    const payload = {
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      category: draft.category?.trim() || 'General',
      image: draft.image?.trim(),
      date: draft.date ? new Date(draft.date).toISOString() : undefined,
    };

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
        setPosts((prev) => {
          const next = [created, ...prev];
          setVisible((old) => [true, ...old]);
          return next;
        });
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
    <Box
      component="section"
      id="blog"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 6 },
        background: 'linear-gradient(180deg, rgba(246,164,253,0.12), rgba(159,56,118,0.05))',
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(159,56,118,0.15)',
          p: { xs: 3, md: 5 },
          border: '2px solid rgba(159,56,118,0.2)',
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.2rem', md: '3rem' },
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Imparables te informa
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '1.1rem', maxWidth: 700, mx: 'auto', mb: 3 }}>
            Artículos y noticias creadas desde el territorio para visibilizar la innovación feminista, las comunidades y la
            cultura viva que defendemos.
          </Typography>

        </Box>

        {loading && <LinearProgress sx={{ mt: 4 }} color="secondary" />}
        {error && !loading && (
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4} sx={{ mt: 1 }}>
          {posts.map((post, index) => (
            <Grid key={post.id} item xs={12} md={4}>
              <Card
                component={motion.div}
                data-index={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={visible[index] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  height: '100%',
                  position: 'relative',
                  background: 'linear-gradient(135deg, #fff, rgba(246,164,253,0.08))',
                  border: '2px solid rgba(159,56,118,0.15)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 50px rgba(159,56,118,0.25)',
                    borderColor: 'rgba(159,56,118,0.3)',
                  },
                  transition: 'all 0.4s ease',
                }}
              >
                <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                  {visible[index] && post.image && (
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        loading="lazy"
                        height="220"
                        image={post.image}
                        alt={post.title}
                        sx={{
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Chip
                          icon={<CategoryIcon />}
                          label={post.category}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(159,56,118,0.15)',
                            color: '#9f3876',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        />
                        <Chip
                          icon={<CalendarTodayIcon />}
                          label={formattedDate(post.date)}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: 'rgba(159,56,118,0.3)',
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                          }}
                        />
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3, color: '#000' }}>
                        {post.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.95rem' }}>
                        {post.excerpt.length > 150 ? `${post.excerpt.substring(0, 150)}...` : post.excerpt}
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Box>

      {loading && <LinearProgress sx={{ mt: 4 }} color="secondary" />}
      {error && !loading && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mt: 1 }}>
        {posts.map((post, index) => (
          <Grid key={post.id} item xs={12} md={4}>
            <Card
              component={motion.div}
              data-index={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={visible[index] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              sx={{
                height: '100%',
                position: 'relative',
                background: 'linear-gradient(135deg, #fff, rgba(246,164,253,0.08))',
                border: '2px solid rgba(159,56,118,0.15)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 50px rgba(159,56,118,0.25)',
                  borderColor: 'rgba(159,56,118,0.3)',
                },
                transition: 'all 0.4s ease',
              }}
            >
              <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                {visible[index] && post.image && (
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      loading="lazy"
                      height="220"
                      image={post.image}
                      alt={post.title}
                      sx={{
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Chip
                        icon={<CategoryIcon />}
                        label={post.category}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(159,56,118,0.15)',
                          color: '#9f3876',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      />
                      <Chip
                        icon={<CalendarTodayIcon />}
                        label={formattedDate(post.date)}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: 'rgba(159,56,118,0.3)',
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                        }}
                      />
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3, color: '#000' }}>
                      {post.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.95rem' }}>
                      {post.excerpt.length > 150 ? `${post.excerpt.substring(0, 150)}...` : post.excerpt}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!loading && posts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Aún no hay publicaciones.
          </Typography>
          <Typography color="text.secondary">Pronto compartiremos historias Imparables.</Typography>
        </Box>
      )}
        <Alert
          severity={feedback.severity}
          onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Blog;
