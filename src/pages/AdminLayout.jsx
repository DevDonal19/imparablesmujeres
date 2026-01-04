import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  BarChart as BarChartIcon,
  Category as CategoryIcon,
  Edit as EditIcon,
  Comment as CommentIcon,
  RateReview as RateReviewIcon,
} from '@mui/icons-material';
import useLocalStorage from '../hooks/useLocalStorage';
import useTokenExpiration from '../hooks/useTokenExpiration';
import SessionExpiryNotification from '../components/SessionExpiryNotification';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Publicaciones', icon: <ArticleIcon />, path: '/admin/posts' },
  { text: 'Categorías', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'Comentarios', icon: <CommentIcon />, path: '/admin/comments' },
  { text: 'Testimonios', icon: <RateReviewIcon />, path: '/admin/testimonials' },
  { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Secciones del Sitio', icon: <EditIcon />, path: '/admin/sections' },
  { text: 'Estadísticas', icon: <BarChartIcon />, path: '/admin/analytics' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/admin/settings' },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [auth, setAuth] = useLocalStorage('imparables-auth', null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Verificar expiración del token automáticamente
  const { timeUntilExpiry } = useTokenExpiration(auth, setAuth, true);

  useEffect(() => {
    console.log('Auth state:', auth);
  }, [auth]);

  useEffect(() => {
    console.log('📍 Ubicación cambió a:', location.pathname);
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    setAuth(null);
    navigate('/');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #9f3876, #bd1d82)',
          color: 'white',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            component="img"
            src="/images/imparable_logo.png"
            alt="Imparables"
            sx={{
              height: { xs: 80, sm: 100, md: 120 },
              width: 'auto',
              maxWidth: '240px',
              mb: 2,
              filter: 'brightness(0) invert(1)',
              transition: 'all 0.3s ease',
            }}
          />
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'rgba(255,255,255,0.2)',
              fontSize: '2rem',
              fontWeight: 800,
            }}
          >
            {auth?.user?.displayName?.charAt(0)?.toUpperCase() || auth?.user?.email?.charAt(0)?.toUpperCase() || 'A'}
          </Avatar>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              {auth?.user?.displayName || auth?.user?.email || 'Administrador'}
            </Typography>
            <Chip
              label={auth?.user?.role === 'admin' ? 'Administrador' : 'Editor'}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                mt: 1,
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={() => {
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'rgba(159,56,118,0.15)' : 'transparent',
                  color: isActive ? '#9f3876' : 'text.primary',
                  fontWeight: isActive ? 700 : 400,
                  '&:hover': {
                    bgcolor: 'rgba(159,56,118,0.1)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#9f3876' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={NavLink}
            to="/admin/profile"
            sx={{
              borderRadius: 2,
              '&.active': {
                bgcolor: 'rgba(159,56,118,0.15)',
                color: '#9f3876',
                fontWeight: 700,
              },
              '&:hover': {
                bgcolor: 'rgba(159,56,118,0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Mi Perfil" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={NavLink}
            to="/"
            sx={{
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(159,56,118,0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Ir al Sitio" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'rgba(211,47,47,0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menú"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight={700}>
            Panel de Administración - Imparables
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(0,0,0,0.08)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet key={location.pathname} />
      </Box>

      {/* Notificación de expiración de sesión */}
      <SessionExpiryNotification timeUntilExpiry={timeUntilExpiry} />
    </Box>
  );
};

export default AdminLayout;
