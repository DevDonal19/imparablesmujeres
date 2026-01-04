import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getPosts } from '../services/api';

const BlogPublic = () => {
  const navigate = useNavigate();
  const cardRefs = useRef([]);
  const [posts, setPosts] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    // Agregar T00:00:00 para evitar problemas de zona horaria
    const dateStr = value.includes('T') ? value : value + 'T00:00:00';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <Box
      component="section"
      id="blog"
      sx={{
        py: { xs: 8, md: 12 },
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
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 3, md: 6 },
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
          {posts.slice(0, 6).map((post, index) => (
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
                <CardActionArea 
                  onClick={() => navigate(`/blog/${post.id}`)}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                  {post.image && (
                    <Box sx={{ position: 'relative', overflow: 'hidden', height: 220, bgcolor: 'grey.200' }}>
                      <CardMedia
                        component="img"
                        loading="lazy"
                        image={post.image}
                        alt={post.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
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

        {!loading && posts.length > 6 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/blog')}
              sx={{
                background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(120deg, #8a2f65, #a51871)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(159,56,118,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Ver Todos los Artículos
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BlogPublic;
