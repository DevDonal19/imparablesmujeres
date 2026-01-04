import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import useLocalStorage from '../hooks/useLocalStorage';

const AdminProfile = () => {
  const [auth, setAuth] = useLocalStorage('imparables-auth', null);
  const [formData, setFormData] = useState({
    displayName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (auth?.user) {
      setFormData((prev) => ({
        ...prev,
        displayName: auth.user.displayName || '',
      }));
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar contraseñas si se está cambiando
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setFeedback({
          open: true,
          message: 'Debes ingresar tu contraseña actual para cambiarla',
          severity: 'error',
        });
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setFeedback({
          open: true,
          message: 'Las contraseñas nuevas no coinciden',
          severity: 'error',
        });
        return;
      }
      
      if (formData.newPassword.length < 6) {
        setFeedback({
          open: true,
          message: 'La contraseña debe tener al menos 6 caracteres',
          severity: 'error',
        });
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const body = {
        displayName: formData.displayName,
      };
      
      if (formData.newPassword) {
        body.currentPassword = formData.currentPassword;
        body.newPassword = formData.newPassword;
      }
      
      console.log('👤 Profile Update - Sending:', body);
      console.log('👤 Profile Update - Token:', auth?.token ? 'Present' : 'Missing');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token}`,
        },
        body: JSON.stringify(body),
      });
      
      console.log('👤 Profile Update - Response status:', response.status);
      
      if (response.ok) {
        const updatedUser = await response.json();
        console.log('✅ Profile Update - Success:', updatedUser);
        
        // Actualizar auth con los nuevos datos
        setAuth({
          ...auth,
          user: updatedUser,
        });
        
        setFeedback({
          open: true,
          message: 'Perfil actualizado exitosamente',
          severity: 'success',
        });
        
        // Limpiar campos de contraseña
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        const error = await response.json();
        console.error('❌ Profile Update - Error:', error);
        setFeedback({
          open: true,
          message: error.message || 'Error al actualizar perfil',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('❌ Profile Update - Exception:', error);
      setFeedback({
        open: true,
        message: 'Error de conexión',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrador',
      editor: 'Editor',
      viewer: 'Visualizador',
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'error',
      editor: 'primary',
      viewer: 'default',
    };
    return colors[role] || 'default';
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Mi Perfil
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Gestiona tu información personal y seguridad de la cuenta
      </Typography>

      <Grid container spacing={3}>
        {/* Información del Usuario */}
        <Grid item xs={12} md={4}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{
              background: 'linear-gradient(135deg, rgba(159,56,118,0.1), rgba(246,164,253,0.1))',
              border: '2px solid rgba(159,56,118,0.2)',
            }}
          >
            <CardContent>
              <Stack spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    fontWeight: 800,
                  }}
                >
                  {auth?.user?.displayName?.charAt(0) || auth?.user?.email?.charAt(0).toUpperCase()}
                </Avatar>
                
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {auth?.user?.displayName || 'Usuario'}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {auth?.user?.email}
                  </Typography>
                  <Chip
                    label={getRoleLabel(auth?.user?.role)}
                    color={getRoleColor(auth?.user?.role)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Divider sx={{ width: '100%' }} />

                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Estado
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <VerifiedUserIcon sx={{ fontSize: 18, color: 'success.main' }} />
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        Activo
                      </Typography>
                    </Stack>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Miembro desde
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {auth?.user?.createdAt
                        ? new Date(auth.user.createdAt).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                          })
                        : 'N/A'}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Formulario de Edición */}
        <Grid item xs={12} md={8}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{
              border: '2px solid rgba(159,56,118,0.2)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  {/* Información Personal */}
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Información Personal
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Stack spacing={3}>
                      <TextField
                        label="Nombre completo"
                        fullWidth
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <TextField
                        label="Email"
                        fullWidth
                        disabled
                        value={auth?.user?.email || ''}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                        helperText="El email no puede ser modificado"
                      />
                    </Stack>
                  </Box>

                  {/* Cambiar Contraseña */}
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Cambiar Contraseña
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Stack spacing={3}>
                      <TextField
                        label="Contraseña actual"
                        type={showCurrentPassword ? 'text' : 'password'}
                        fullWidth
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                edge="end"
                              >
                                {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <TextField
                        label="Nueva contraseña"
                        type={showNewPassword ? 'text' : 'password'}
                        fullWidth
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                edge="end"
                              >
                                {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        helperText="Mínimo 6 caracteres"
                      />
                      
                      <TextField
                        label="Confirmar nueva contraseña"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Botón de Guardar */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={<SaveIcon />}
                      sx={{
                        background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                        fontWeight: 700,
                        px: 4,
                      }}
                    >
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </Box>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar de feedback */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={feedback.severity} onClose={() => setFeedback({ ...feedback, open: false })}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProfile;
