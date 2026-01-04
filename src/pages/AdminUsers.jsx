import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import useLocalStorage from '../hooks/useLocalStorage';
import { getApiUrl } from '../utils/api';

const ROLES = [
  { value: 'admin', label: 'Administrador', color: 'error' },
  { value: 'editor', label: 'Editor', color: 'primary' },
  { value: 'viewer', label: 'Visualizador', color: 'default' },
];

const AdminUsers = () => {
  const [auth] = useLocalStorage('imparables-auth', null);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    role: 'editor',
  });
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  const currentUserRole = auth?.user?.role || 'viewer';
  const isAdmin = currentUserRole === 'admin';

  useEffect(() => {
    loadUsers();
  }, []);

  const apiFetch = (path, options) => fetch(getApiUrl(path), options);

  const loadUsers = async () => {
    try {
      const response = await apiFetch('/users', {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        email: user.email,
        displayName: user.displayName,
        password: '',
        role: user.role,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        email: '',
        displayName: '',
        password: '',
        role: 'editor',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      email: '',
      displayName: '',
      password: '',
      role: 'editor',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = getApiUrl(selectedUser ? `/users/${selectedUser.id}` : '/users');
      
      const method = selectedUser ? 'PUT' : 'POST';
      
      const body = selectedUser
        ? { displayName: formData.displayName, role: formData.role, ...(formData.password && { password: formData.password }) }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setFeedback({
          open: true,
          message: selectedUser ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente',
          severity: 'success',
        });
        loadUsers();
        handleCloseDialog();
      } else {
        const error = await response.json();
        setFeedback({
          open: true,
          message: error.message || 'Error al guardar usuario',
          severity: 'error',
        });
      }
    } catch (error) {
      setFeedback({
        open: true,
        message: 'Error de conexión',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiFetch(`/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });

      if (response.ok) {
        setFeedback({
          open: true,
          message: 'Usuario eliminado exitosamente',
          severity: 'success',
        });
        loadUsers();
        setOpenDeleteDialog(false);
        setSelectedUser(null);
      } else {
        const error = await response.json();
        setFeedback({
          open: true,
          message: error.message || 'Error al eliminar usuario',
          severity: 'error',
        });
      }
    } catch (error) {
      setFeedback({
        open: true,
        message: 'Error de conexión',
        severity: 'error',
      });
    }
  };

  const getRoleInfo = (role) => {
    return ROLES.find((r) => r.value === role) || ROLES[1];
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Gestión de Usuarios
          </Typography>
          <Typography color="text.secondary">
            Administra los usuarios y sus permisos en la plataforma
          </Typography>
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
              fontWeight: 700,
            }}
          >
            Nuevo Usuario
          </Button>
        )}
      </Stack>

      {!isAdmin && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Solo los administradores pueden crear, editar o eliminar usuarios.
        </Alert>
      )}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              background: 'linear-gradient(135deg, rgba(159,56,118,0.1), rgba(246,164,253,0.1))',
              border: '2px solid rgba(159,56,118,0.2)',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                  <AdminPanelSettingsIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800}>
                    {users.filter((u) => u.role === 'admin').length}
                  </Typography>
                  <Typography color="text.secondary">Administradores</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            sx={{
              background: 'linear-gradient(135deg, rgba(33,150,243,0.1), rgba(100,181,246,0.1))',
              border: '2px solid rgba(33,150,243,0.2)',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800}>
                    {users.filter((u) => u.role === 'editor').length}
                  </Typography>
                  <Typography color="text.secondary">Editores</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{
              background: 'linear-gradient(135deg, rgba(76,175,80,0.1), rgba(129,199,132,0.1))',
              border: '2px solid rgba(76,175,80,0.2)',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <VerifiedUserIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800}>
                    {users.length}
                  </Typography>
                  <Typography color="text.secondary">Total Usuarios</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{
          border: '2px solid rgba(159,56,118,0.2)',
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(159,56,118,0.05)' }}>
            <TableRow>
              <TableCell>
                <Typography fontWeight={700}>Usuario</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={700}>Email</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={700}>Rol</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={700}>Acciones</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const roleInfo = getRoleInfo(user.role);
              return (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography fontWeight={600}>{user.displayName || 'Sin nombre'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={roleInfo.label} color={roleInfo.color} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(user)}
                        disabled={!isAdmin}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenDeleteDialog(true);
                        }}
                        disabled={!isAdmin || user.id === auth?.user?.id}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar usuario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {selectedUser ? <EditIcon /> : <AddIcon />}
            </Avatar>
            <Typography variant="h5" fontWeight={800}>
              {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </Typography>
          </Stack>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                label="Nombre completo"
                fullWidth
                required
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
                type="email"
                fullWidth
                required
                disabled={!!selectedUser}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label={selectedUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                type="password"
                fullWidth
                required={!selectedUser}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                helperText={selectedUser ? 'Dejar en blanco para mantener la contraseña actual' : ''}
              />
              <TextField
                label="Rol"
                select
                fullWidth
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                fontWeight: 700,
              }}
            >
              {selectedUser ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás segura de eliminar al usuario <strong>{selectedUser?.displayName || selectedUser?.email}</strong>?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

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

export default AdminUsers;
