import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Menu,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { getPosts } from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';

const BlogPage = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useLocalStorage('imparables-auth', null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedCategory, selectedYear]);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error cargando posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filtro de año
    if (selectedYear !== 'all') {
      filtered = filtered.filter((post) => {
        const postYear = new Date(post.date || post.createdAt).getFullYear().toString();
        return postYear === selectedYear;
      });
    }

    setFilteredPosts(filtered);
  };

  const categories = [...new Set(posts.map((post) => post.category))];
  const years = [...new Set(posts.map((post) => new Date(post.date || post.createdAt).getFullYear()))].sort(
    (a, b) => b - a
  );

  const formattedDate = (value) => {
    if (!value) return 'Fecha por confirmar';
    const dateStr = value.includes('T') ? value : value + 'T00:00:00';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAuth(null);
    handleMenuClose();
    navigate('/');
  };

  const navLinks = [
    { label: 'Inicio', href: '/#inicio' },
    { label: 'Historia', href: '/#historia' },
    { label: 'Misión y Visión', href: '/#mision-vision' },
    { label: 'Servicios', href: '/#servicios' },
    { label: 'Testimonios', href: '/#muro' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contacto', href: '/#contacto' },
  ];

  const drawer = (
    <Box sx={{ width: 260, p: 2 }} role="presentation" onClick={() => setMobileOpen(false)}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box
          component="img"
          src="/images/imparable_logo.png"
          alt="Imparables"
          sx={{ height: 80, width: 'auto', maxWidth: '220px' }}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        {navLinks.map((link) => (
          <ListItemButton component="a" href={link.href} key={link.href}>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        {drawer}
      </Drawer>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(255,255,255,0.8)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 60, md: 64 }, py: 1 }}>
          <Box
            component="img"
            src="/images/imparable_logo.png"
            alt="Imparables"
            sx={{
              height: { xs: 40, sm: 50, md: 60, lg: 70 },
              width: 'auto',
              maxWidth: { xs: '150px', sm: '200px', md: '250px', lg: '300px' },
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
            onClick={() => navigate('/')}
          />
          <Stack spacing={3} direction="row" alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map((link) => (
              <Button
                key={link.href}
                href={link.href}
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'transparent',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
            {auth?.token ? (
              <>
                <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                    {(auth.user?.displayName || auth.user?.email || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                    <DashboardIcon sx={{ mr: 1 }} /> Panel Admin
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} /> Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton onClick={() => navigate('/admin/login')} color="primary">
                <LoginIcon />
              </IconButton>
            )}
          </Stack>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flex: 1, py: 6 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Blog Imparables
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Historias, noticias y reflexiones desde el Pacífico colombiano
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Categoría"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="all">Todas las categorías</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Año</InputLabel>
                <Select value={selectedYear} label="Año" onChange={(e) => setSelectedYear(e.target.value)}>
                  <MenuItem value="all">Todos los años</MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Results Count */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {filteredPosts.length} {filteredPosts.length === 1 ? 'artículo encontrado' : 'artículos encontrados'}
        </Typography>

        {/* Posts Grid */}
        <Grid container spacing={4}>
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
                  border: '2px solid rgba(159,56,118,0.15)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 50px rgba(159,56,118,0.25)',
                    borderColor: 'rgba(159,56,118,0.3)',
                  },
                  transition: 'all 0.4s ease',
                }}
              >
                <CardActionArea onClick={() => navigate(`/blog/${post.id}`)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                  {post.image && (
                    <Box sx={{ position: 'relative', overflow: 'hidden', height: 220, bgcolor: 'grey.200' }}>
                      <CardMedia
                        component="img"
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

        {filteredPosts.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              No se encontraron artículos
            </Typography>
            <Typography color="text.secondary">
              Intenta con otros términos de búsqueda o filtros
            </Typography>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, textAlign: 'center', bgcolor: '#000', color: '#fff', mt: 6 }}>
        <Box
          component="img"
          src="/images/imparable_logo.png"
          alt="Imparables"
          sx={{
            height: { xs: 60, sm: 70, md: 80 },
            width: 'auto',
            maxWidth: { xs: '200px', sm: '250px', md: '300px' },
            mx: 'auto',
            mb: 2,
            filter: 'brightness(0) invert(1)',
            transition: 'all 0.3s ease',
          }}
        />
        <Typography variant="body1" fontWeight={600}>
          Mujeres que transforman el mundo desde el Pacífico colombiano
        </Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.7)">
          © {new Date().getFullYear()} Imparables. Todas las voces, todos los territorios.
        </Typography>
      </Box>
    </Box>
  );
};

export default BlogPage;
