import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { login as loginRequest } from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';

const AdminLogin = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [, setAuth] = useLocalStorage('imparables-auth', null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError('');
    try {
      const result = await loginRequest(loginForm);
      console.log('🔑 Login - Response from API:', result);
      
      setAuth(result);
      console.log('✅ Login - Auth saved to localStorage');
      console.log('🔑 Login - LocalStorage after save:', localStorage.getItem('imparables-auth'));
      
      navigate('/admin');
    } catch (err) {
      console.error('❌ Login - Error:', err);
      setError(err.message || 'No se pudo iniciar sesión');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #9f3876, #bd1d82, #f6a4fd)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        position: 'relative',
      }}
    >
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          bgcolor: 'rgba(255,255,255,0.2)',
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.3)',
          },
        }}
      >
        <HomeIcon />
      </IconButton>

      <Container maxWidth="sm">
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Stack spacing={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src="/images/imparable_logo.png"
                  alt="Imparables"
                  sx={{
                    height: { xs: 100, sm: 120, md: 140 },
                    width: 'auto',
                    maxWidth: { xs: '280px', sm: '350px', md: '400px' },
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                  }}
                />
                <Typography variant="h5" fontWeight={600} color="text.secondary">
                  Panel de Administración
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Ingresa tus credenciales para continuar
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Correo electrónico"
                    type="email"
                    autoComplete="email"
                    required
                    fullWidth
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                    disabled={processing}
                  />
                  <TextField
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    fullWidth
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                    disabled={processing}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={processing}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={processing}
                    startIcon={<LoginIcon />}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                    }}
                  >
                    {processing ? 'Ingresando...' : 'Iniciar Sesión'}
                  </Button>
                </Stack>
              </Box>

              <Box sx={{ textAlign: 'center', pt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Olvidaste tu contraseña? Contacta al administrador del sistema.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminLogin;
