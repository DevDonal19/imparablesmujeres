import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Avatar,
  LinearProgress,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import useLocalStorage from '../hooks/useLocalStorage';
import { apiFetch } from '../utils/api';

const AdminAnalytics = () => {
  const [auth] = useLocalStorage('imparables-auth', null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalContacts: 0,
    recentPosts: [],
    recentContacts: [],
    postsByCategory: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Cargar publicaciones
      const postsResponse = await apiFetch('/posts');
      const posts = postsResponse.ok ? await postsResponse.json() : [];

      // Cargar usuarios
      const usersResponse = await apiFetch('/users', {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const users = usersResponse.ok ? await usersResponse.json() : [];

      // Cargar contactos
      const contactsResponse = await apiFetch('/contact', {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const contacts = contactsResponse.ok ? await contactsResponse.json() : [];

      // Calcular estadísticas por categoría
      const postsByCategory = posts.reduce((acc, post) => {
        const category = post.category || 'Sin categoría';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalPosts: posts.length,
        totalUsers: users.length,
        totalContacts: contacts.length,
        recentPosts: posts.slice(0, 5),
        recentContacts: contacts.slice(0, 5),
        postsByCategory,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend, delay = 0 }) => (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      sx={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `2px solid ${color}30`,
        height: '100%',
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
              {value}
            </Typography>
            {trend && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main" fontWeight={600}>
                  {trend}
                </Typography>
              </Stack>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );

  const CategoryBar = ({ category, count, total, color }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {count} ({percentage.toFixed(0)}%)
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: `${color}20`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
              borderRadius: 4,
            },
          }}
        />
      </Box>
    );
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Estadísticas
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  const categoryColors = [
    '#9f3876',
    '#bd1d82',
    '#f6a4fd',
    '#2196f3',
    '#4caf50',
    '#ff9800',
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Estadísticas y Análisis
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Resumen general de la actividad en la plataforma
      </Typography>

      {/* Tarjetas de Estadísticas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Publicaciones"
            value={stats.totalPosts}
            icon={<ArticleIcon />}
            color="#9f3876"
            trend="+12% este mes"
            delay={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Usuarios"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            color="#2196f3"
            trend="+5% este mes"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mensajes Recibidos"
            value={stats.totalContacts}
            icon={<EmailIcon />}
            color="#4caf50"
            trend="+8% este mes"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Visitas Totales"
            value="1,234"
            icon={<VisibilityIcon />}
            color="#ff9800"
            trend="+15% este mes"
            delay={0.3}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Publicaciones por Categoría */}
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{
              border: '2px solid rgba(159,56,118,0.2)',
              height: '100%',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <ArticleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Publicaciones por Categoría
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distribución de contenido
                  </Typography>
                </Box>
              </Stack>

              {Object.entries(stats.postsByCategory).length > 0 ? (
                Object.entries(stats.postsByCategory).map(([category, count], index) => (
                  <CategoryBar
                    key={category}
                    category={category}
                    count={count}
                    total={stats.totalPosts}
                    color={categoryColors[index % categoryColors.length]}
                  />
                ))
              ) : (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No hay datos disponibles
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Actividad Reciente */}
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{
              border: '2px solid rgba(159,56,118,0.2)',
              height: '100%',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <FavoriteIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Actividad Reciente
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Últimas acciones en la plataforma
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                {stats.recentPosts.slice(0, 5).map((post) => (
                  <Paper
                    key={post.id}
                    sx={{
                      p: 2,
                      background: 'rgba(159,56,118,0.05)',
                      border: '1px solid rgba(159,56,118,0.1)',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 250 }}>
                          {post.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.createdAt).toLocaleDateString('es-CO')}
                        </Typography>
                      </Box>
                      <Chip label={post.category} size="small" color="primary" />
                    </Stack>
                  </Paper>
                ))}
                
                {stats.recentPosts.length === 0 && (
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    No hay actividad reciente
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Mensajes de Contacto Recientes */}
        <Grid item xs={12}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            sx={{
              border: '2px solid rgba(159,56,118,0.2)',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <EmailIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Mensajes de Contacto Recientes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Últimos mensajes recibidos
                  </Typography>
                </Box>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: 'rgba(159,56,118,0.05)' }}>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight={700}>Nombre</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>Email</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>Mensaje</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>Fecha</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentContacts.map((contact) => (
                      <TableRow key={contact.id} hover>
                        <TableCell>{contact.nombre}</TableCell>
                        <TableCell>{contact.correo}</TableCell>
                        <TableCell>
                          <Typography noWrap sx={{ maxWidth: 300 }}>
                            {contact.mensaje}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(contact.createdAt).toLocaleDateString('es-CO')}
                        </TableCell>
                      </TableRow>
                    ))}
                    {stats.recentContacts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography color="text.secondary" sx={{ py: 4 }}>
                            No hay mensajes recientes
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAnalytics;
