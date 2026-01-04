import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
  LinearProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SendIcon from '@mui/icons-material/Send';
import CategoryIcon from '@mui/icons-material/Category';
import { getApiUrl } from '../utils/api';

const REACTIONS = [
  { type: 'like', icon: ThumbUpIcon, label: 'Me gusta', color: '#2196f3' },
  { type: 'love', icon: FavoriteIcon, label: 'Me encanta', color: '#e91e63' },
  { type: 'celebrate', icon: CelebrationIcon, label: 'Celebrar', color: '#ff9800' },
];

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState({});
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', severity: 'success' });

  // Generar identificador único para el usuario (basado en localStorage)
  const getUserIdentifier = () => {
    let identifier = localStorage.getItem('user-identifier');
    if (!identifier) {
      identifier = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user-identifier', identifier);
    }
    return identifier;
  };

  useEffect(() => {
    loadPost();
    loadComments();
    loadReactions();
  }, [id]);

  const apiFetch = (path, options) => fetch(getApiUrl(path), options);

  const loadPost = async () => {
    try {
      const response = await apiFetch(`/posts/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('📰 Post cargado:', data);
        console.log('🖼️ URL de imagen:', data.image);
        console.log('📝 Contenido:', data.content?.substring(0, 100));
        setPost(data);
        
        // Registrar vista (una por usuario)
        const viewKey = `post-${id}-viewed`;
        const hasViewed = localStorage.getItem(viewKey);
        
        if (!hasViewed) {
          // Incrementar vista en el backend
          try {
            await apiFetch(`/posts/${id}/view`, {
              method: 'POST',
            });
            // Marcar como visto en localStorage
            localStorage.setItem(viewKey, 'true');
            // Actualizar el contador de vistas en el estado
            setPost(prev => ({ ...prev, views: (prev.views || 0) + 1 }));
          } catch (error) {
            console.error('Error registrando vista:', error);
          }
        }
        
        // Cargar posts relacionados (misma categoría)
        const allPostsResponse = await apiFetch('/posts');
        if (allPostsResponse.ok) {
          const allPosts = await allPostsResponse.json();
          const related = allPosts
            .filter((p) => p.id !== parseInt(id) && p.category === data.category)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      }
    } catch (error) {
      console.error('Error cargando post:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await apiFetch(`/comments/post/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    }
  };

  const loadReactions = async () => {
    try {
      const response = await apiFetch(`/reactions/post/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReactions(data);
      }
      
      // Cargar reacción del usuario
      const userIdentifier = getUserIdentifier();
      const userReactionResponse = await apiFetch(
        `/reactions/post/${id}/user/${userIdentifier}`
      );
      if (userReactionResponse.ok) {
        const data = await userReactionResponse.json();
        setUserReaction(data?.type || null);
      }
    } catch (error) {
      console.error('Error cargando reacciones:', error);
    }
  };

  const handleReaction = async (type) => {
    try {
      const userIdentifier = getUserIdentifier();
      const response = await apiFetch('/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: id,
          type,
          userIdentifier,
        }),
      });
      
      if (response.ok) {
        loadReactions();
      }
    } catch (error) {
      console.error('Error procesando reacción:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmittingComment(true);
    
    try {
      const response = await apiFetch('/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: id,
          ...commentForm,
        }),
      });
      
      if (response.ok) {
        setFeedback({
          show: true,
          message: 'Comentario enviado. Será visible después de ser aprobado.',
          severity: 'success',
        });
        setCommentForm({ name: '', email: '', content: '' });
      } else {
        setFeedback({
          show: true,
          message: 'Error al enviar comentario',
          severity: 'error',
        });
      }
    } catch (error) {
      setFeedback({
        show: true,
        message: 'Error de conexión',
        severity: 'error',
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const formattedDate = (value) => {
    if (!value) return 'Fecha por confirmar';
    // Agregar T00:00:00 para evitar problemas de zona horaria
    const dateStr = value.includes('T') ? value : value + 'T00:00:00';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <LinearProgress />
        </Container>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Alert severity="error">Artículo no encontrado</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Botón de regresar */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Volver al blog
        </Button>

        <Grid container spacing={4}>
          {/* Contenido principal */}
          <Grid item xs={12} md={8}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                border: '2px solid rgba(159,56,118,0.2)',
              }}
            >
              {post.image ? (
                <Box sx={{ position: 'relative', height: 400, bgcolor: 'grey.100', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image={post.image}
                    alt={post.title}
                    sx={{ 
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                    onError={(e) => {
                      console.error('❌ Error cargando imagen:', post.image);
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:1.2rem;">Imagen no disponible</div>';
                    }}
                    onLoad={() => console.log('✅ Imagen cargada:', post.image)}
                  />
                </Box>
              ) : (
                <Box sx={{ 
                  height: 400, 
                  bgcolor: 'grey.200', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'text.secondary',
                  fontSize: '1.2rem'
                }}>
                  Sin imagen
                </Box>
              )}
              
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                {/* Categoría */}
                <Chip
                  icon={<CategoryIcon />}
                  label={post.category}
                  sx={{
                    bgcolor: 'rgba(159,56,118,0.15)',
                    color: '#9f3876',
                    fontWeight: 700,
                    mb: 2,
                  }}
                />

                {/* Título */}
                <Typography variant="h3" fontWeight={800} gutterBottom sx={{ mb: 3 }}>
                  {post.title}
                </Typography>

                {/* Metadata */}
                <Stack direction="row" spacing={3} sx={{ mb: 3 }} flexWrap="wrap">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.author || 'Equipo Imparables'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarTodayIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formattedDate(post.date || post.createdAt)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VisibilityIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.views || 0} vistas
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Contenido */}
                <Box
                  sx={{
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    color: 'text.primary',
                    '& p': { mb: 2 },
                    '& img': { maxWidth: '100%', height: 'auto', borderRadius: 2, my: 2 },
                    '& h1, & h2, & h3': { mt: 3, mb: 2, fontWeight: 700 },
                    '& ul, & ol': { pl: 3, mb: 2 },
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {post.content && post.content.trim() ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  ) : post.excerpt ? (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {post.excerpt}
                    </Typography>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      Sin contenido disponible
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Reacciones */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    ¿Te gustó este artículo?
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    {REACTIONS.map((reaction) => {
                      const Icon = reaction.icon;
                      const count = reactions[reaction.type] || 0;
                      const isActive = userReaction === reaction.type;
                      
                      return (
                        <Button
                          key={reaction.type}
                          variant={isActive ? 'contained' : 'outlined'}
                          startIcon={<Icon />}
                          onClick={() => handleReaction(reaction.type)}
                          sx={{
                            borderColor: reaction.color,
                            color: isActive ? 'white' : reaction.color,
                            bgcolor: isActive ? reaction.color : 'transparent',
                            '&:hover': {
                              bgcolor: isActive ? reaction.color : `${reaction.color}20`,
                              borderColor: reaction.color,
                            },
                          }}
                        >
                          {reaction.label} {count > 0 && `(${count})`}
                        </Button>
                      );
                    })}
                  </Stack>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Comentarios */}
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Comentarios ({comments.length})
                  </Typography>

                  {/* Formulario de comentario */}
                  <Paper sx={{ p: 3, mt: 3, bgcolor: 'rgba(159,56,118,0.05)', borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                      Deja tu comentario
                    </Typography>
                    <form onSubmit={handleCommentSubmit}>
                      <Stack spacing={2.5}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Nombre"
                              fullWidth
                              required
                              value={commentForm.name}
                              onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                              variant="outlined"
                              sx={{ bgcolor: 'white' }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Email"
                              type="email"
                              fullWidth
                              required
                              value={commentForm.email}
                              onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                              variant="outlined"
                              sx={{ bgcolor: 'white' }}
                            />
                          </Grid>
                        </Grid>
                        <TextField
                          label="Comentario"
                          multiline
                          rows={4}
                          fullWidth
                          required
                          value={commentForm.content}
                          onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                          variant="outlined"
                          sx={{ bgcolor: 'white' }}
                        />
                        <Button
                          type="submit"
                          variant="contained"
                          endIcon={<SendIcon />}
                          disabled={submittingComment}
                          sx={{
                            background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                            fontWeight: 700,
                          }}
                        >
                          {submittingComment ? 'Enviando...' : 'Enviar Comentario'}
                        </Button>
                        {feedback.show && (
                          <Alert severity={feedback.severity} onClose={() => setFeedback({ ...feedback, show: false })}>
                            {feedback.message}
                          </Alert>
                        )}
                      </Stack>
                    </form>
                  </Paper>

                  {/* Lista de comentarios */}
                  <Stack spacing={2} sx={{ mt: 3 }}>
                    {comments.map((comment) => (
                      <Paper key={comment.id} sx={{ p: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {comment.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {comment.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formattedDate(comment.createdAt)}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                              {comment.content}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                    {comments.length === 0 && (
                      <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                        Sé el primero en comentar
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Artículos relacionados */}
            <Card
              sx={{
                border: '2px solid rgba(159,56,118,0.2)',
                position: 'sticky',
                top: 20,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Artículos Relacionados
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {relatedPosts.map((relatedPost) => (
                    <Card
                      key={relatedPost.id}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => navigate(`/blog/${relatedPost.id}`)}
                    >
                      <CardActionArea>
                        {relatedPost.image && (
                          <CardMedia
                            component="img"
                            height="120"
                            image={relatedPost.image}
                            alt={relatedPost.title}
                          />
                        )}
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight={700} noWrap>
                            {relatedPost.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formattedDate(relatedPost.date || relatedPost.createdAt)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  ))}
                  {relatedPosts.length === 0 && (
                    <Typography color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                      No hay artículos relacionados
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogPost;
