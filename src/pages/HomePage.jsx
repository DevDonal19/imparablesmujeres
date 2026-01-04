import { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Fab,
  Fade,
  GlobalStyles,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import Hero from '../components/Hero';
import Historia from '../components/Historia';
import MisionVision from '../components/MisionVision';
import Servicios from '../components/Servicios';
import Muro from '../components/Muro';
import BlogPublic from '../components/BlogPublic';
import Contacto from '../components/Contacto';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Historia', href: '#historia' },
  { label: 'Misión y Visión', href: '#mision-vision' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Testimonios', href: '#muro' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contacto', href: '#contacto' },
];

const ScrollTopFab = () => {
  const trigger = useScrollTrigger({ threshold: 400, disableHysteresis: true });
  return (
    <Fade in={trigger}>
      <Box role="presentation" sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Fab color="primary" aria-label="Ir al inicio" href="#inicio">
          <ArrowUpwardIcon />
        </Fab>
      </Box>
    </Fade>
  );
};

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [auth, setAuth] = useLocalStorage('imparables-auth', null);
  const navigate = useNavigate();

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
  
  const menu = useMemo(
    () =>
      navLinks.map((link) => (
        <Button key={link.href} component="a" href={link.href} color="inherit" sx={{ fontWeight: 600 }}>
          {link.label}
        </Button>
      )),
    []
  );

  const drawer = (
    <Box sx={{ width: 260, p: 2 }} role="presentation" onClick={() => setOpen(false)}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box
          component="img"
          src="/images/imparable_logo.png"
          alt="Imparables"
          sx={{ 
            height: 80, 
            width: 'auto',
            maxWidth: '220px',
          }}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        {navLinks.map((link) => (
          <ListItemButton component="a" href={link.href} key={link.href}>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 2 }} />
        {auth?.token ? (
          <>
            <ListItemButton onClick={() => navigate('/admin')}>
              <DashboardIcon sx={{ mr: 1 }} fontSize="small" />
              <ListItemText primary="Panel Admin" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </>
        ) : (
          <ListItemButton onClick={() => navigate('/admin/login')}>
            <LoginIcon sx={{ mr: 1 }} fontSize="small" />
            <ListItemText primary="Iniciar Sesión" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <GlobalStyles
        styles={{
          html: { scrollBehavior: 'smooth' },
          '::selection': { backgroundColor: '#f6a4fd', color: '#000' },
        }}
      />
      <AppBar
        position="fixed"
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
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <Stack spacing={2} direction="row" alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {menu}
            {auth?.token ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ ml: 2 }}
                  aria-label="Menú de usuario"
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'primary.main',
                      fontSize: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    {auth?.user?.displayName?.charAt(0)?.toUpperCase() || 
                     auth?.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                    <DashboardIcon sx={{ mr: 1 }} fontSize="small" />
                    Panel Admin
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton
                color="primary"
                onClick={() => navigate('/admin/login')}
                aria-label="Iniciar sesión"
                sx={{ ml: 2 }}
              >
                <LoginIcon />
              </IconButton>
            )}
          </Stack>
          <IconButton
            color="primary"
            edge="end"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            aria-label="Abrir menú de navegación"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Toolbar id="back-to-top-anchor" />

      <main>
        <Hero />
        <Container maxWidth="lg">
          <Historia />
          <MisionVision />
          <Servicios />
        </Container>
        <Muro />
        <BlogPublic />
        <Container maxWidth="lg">
          <Contacto />
        </Container>
      </main>

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

      <ScrollTopFab />

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        {drawer}
      </Drawer>
    </Box>
  );
};

export default HomePage;
