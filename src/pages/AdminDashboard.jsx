import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getPosts } from '../services/api';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      border: `2px solid ${color}30`,
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 40px ${color}30`,
      },
      transition: 'all 0.3s ease',
    }}
  >
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}20`,
              color: color,
              display: 'flex',
            }}
          >
            {icon}
          </Box>
        </Stack>
        <Typography variant="h3" fontWeight={800} color={color}>
          {value}
        </Typography>
        {trend && (
          <Chip
            label={trend}
            size="small"
            sx={{
              bgcolor: `${color}20`,
              color: color,
              fontWeight: 600,
              alignSelf: 'flex-start',
            }}
          />
        )}
      </Stack>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = [
    {
      title: 'Total Publicaciones',
      value: posts.length,
      icon: <ArticleIcon fontSize="large" />,
      color: '#9f3876',
      trend: '+12% este mes',
    },
    {
      title: 'Vistas Totales',
      value: '2,847',
      icon: <TrendingUpIcon fontSize="large" />,
      color: '#bd1d82',
      trend: '+23% esta semana',
    },
    {
      title: 'Comunidad',
      value: '1,234',
      icon: <PeopleIcon fontSize="large" />,
      color: '#f6a4fd',
      trend: '+45 nuevas',
    },
    {
      title: 'Publicaciones Recientes',
      value: posts.filter((p) => {
        const postDate = new Date(p.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return postDate >= weekAgo;
      }).length,
      icon: <ScheduleIcon fontSize="large" />,
      color: '#a8a8a8',
      trend: 'Última semana',
    },
  ];

  const recentPosts = posts.slice(0, 5);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Panel de Administración
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenida al centro de control de Imparables
          </Typography>
        </Box>

        {loading && <LinearProgress sx={{ borderRadius: 2 }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Stats Grid */}
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid key={stat.title} item xs={12} sm={6} lg={3}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(159,56,118,0.05), rgba(246,164,253,0.05))',
                border: '1px solid rgba(159,56,118,0.2)',
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Publicaciones Recientes
              </Typography>
              <Divider sx={{ my: 2 }} />
              {recentPosts.length > 0 ? (
                <List>
                  {recentPosts.map((post, index) => (
                    <ListItem
                      key={post.id}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'rgba(159,56,118,0.08)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight={600}>
                            {post.title}
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <Chip
                              label={post.category}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(159,56,118,0.15)',
                                color: '#9f3876',
                                fontWeight: 600,
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(post.date).toLocaleDateString('es-CO')}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  No hay publicaciones recientes
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(189,29,130,0.05), rgba(168,168,168,0.05))',
                border: '1px solid rgba(189,29,130,0.2)',
                height: '100%',
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Acciones Rápidas
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: '0 8px 24px rgba(159,56,118,0.2)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      📝 Nueva Publicación
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Crear un nuevo artículo
                    </Typography>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: '0 8px 24px rgba(189,29,130,0.2)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      📊 Ver Estadísticas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Analíticas detalladas
                    </Typography>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: '0 8px 24px rgba(246,164,253,0.2)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      👥 Gestionar Comunidad
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ver miembros activos
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default AdminDashboard;
