import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import SaveIcon from '@mui/icons-material/Save';
import HomeIcon from '@mui/icons-material/Home';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useLocalStorage from '../hooks/useLocalStorage';
import { apiFetch } from '../utils/api';

const AdminSections = () => {
  const [auth] = useLocalStorage('imparables-auth', null);
  const [activeTab, setActiveTab] = useState(0);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const response = await apiFetch('/sections');
      if (response.ok) {
        const data = await response.json();
        console.log('Secciones cargadas:', data);
        const sectionsObj = data.reduce((acc, section) => {
          acc[section.section] = section.content;
          return acc;
        }, {});
        console.log('Secciones procesadas:', sectionsObj);
        setSections(sectionsObj);
      } else {
        console.error('Error en respuesta:', response.status);
      }
    } catch (error) {
      console.error('Error cargando secciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (sectionName, content) => {
    setSaving(true);
    try {
      const response = await apiFetch(`/sections/${sectionName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setFeedback({
          open: true,
          message: 'Sección actualizada exitosamente',
          severity: 'success',
        });
        loadSections();
      } else {
        setFeedback({
          open: true,
          message: 'Error al actualizar sección',
          severity: 'error',
        });
      }
    } catch (error) {
      setFeedback({
        open: true,
        message: 'Error de conexión',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionName, field, value) => {
    setSections((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [field]: value,
      },
    }));
  };

  const updateArrayItem = (sectionName, arrayName, index, field, value) => {
    setSections((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [arrayName]: prev[sectionName][arrayName].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const addArrayItem = (sectionName, arrayName, newItem) => {
    setSections((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [arrayName]: [...(prev[sectionName][arrayName] || []), newItem],
      },
    }));
  };

  const removeArrayItem = (sectionName, arrayName, index) => {
    setSections((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [arrayName]: prev[sectionName][arrayName].filter((_, i) => i !== index),
      },
    }));
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Administración de Secciones
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Edita el contenido de las diferentes secciones del sitio web
      </Typography>

      {Object.keys(sections).length === 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No se encontraron secciones. Verifica que las migraciones se hayan ejecutado correctamente.
        </Alert>
      )}

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab icon={<HomeIcon />} label="Inicio/Hero" />
        <Tab icon={<HistoryEduIcon />} label="Historia" />
        <Tab icon={<PeopleIcon />} label="Fundadoras" />
        <Tab icon={<VisibilityIcon />} label="Misión y Visión" />
        <Tab icon={<WorkIcon />} label="Servicios" />
      </Tabs>

      {/* Tab 0: Hero/Inicio */}
      {activeTab === 0 && !sections.hero && (
        <Alert severity="info">No se encontró la sección Hero. Ejecuta las migraciones.</Alert>
      )}
      {activeTab === 0 && sections.hero && (
        <Card component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Sección de Inicio (Hero)
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={3}>
              <TextField
                label="Título Principal"
                fullWidth
                value={sections.hero.title || ''}
                onChange={(e) => updateSection('hero', 'title', e.target.value)}
              />
              <TextField
                label="Subtítulo"
                fullWidth
                value={sections.hero.subtitle || ''}
                onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
              />
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={sections.hero.description || ''}
                onChange={(e) => updateSection('hero', 'description', e.target.value)}
              />
              <TextField
                label="URL de la Imagen"
                fullWidth
                value={sections.hero.image || ''}
                onChange={(e) => updateSection('hero', 'image', e.target.value)}
                helperText="URL de la imagen que se mostrará en la tarjeta de inicio"
                placeholder="/images/hero-doll.png"
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Texto del Botón"
                    fullWidth
                    value={sections.hero.buttonText || ''}
                    onChange={(e) => updateSection('hero', 'buttonText', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Enlace del Botón"
                    fullWidth
                    value={sections.hero.buttonLink || ''}
                    onChange={(e) => updateSection('hero', 'buttonLink', e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave('hero', sections.hero)}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                  fontWeight: 700,
                  alignSelf: 'flex-start',
                }}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Tab 1: Historia */}
      {activeTab === 1 && !sections.historia && (
        <Alert severity="info">No se encontró la sección Historia. Ejecuta las migraciones.</Alert>
      )}
      {activeTab === 1 && sections.historia && (
        <Card component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Sección de Historia
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={3}>
              <TextField
                label="Título de la Sección"
                fullWidth
                value={sections.historia.title || ''}
                onChange={(e) => updateSection('historia', 'title', e.target.value)}
              />
              
              {sections.historia.cards?.map((card, index) => (
                <Paper key={index} sx={{ p: 3, bgcolor: 'rgba(159,56,118,0.05)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                      Tarjeta {index + 1}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => removeArrayItem('historia', 'cards', index)}
                      disabled={sections.historia.cards.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  <Stack spacing={2}>
                    <TextField
                      label="Título de la Tarjeta"
                      fullWidth
                      value={card.title || ''}
                      onChange={(e) => updateArrayItem('historia', 'cards', index, 'title', e.target.value)}
                    />
                    <TextField
                      label="Contenido"
                      fullWidth
                      multiline
                      rows={4}
                      value={card.content || ''}
                      onChange={(e) => updateArrayItem('historia', 'cards', index, 'content', e.target.value)}
                    />
                  </Stack>
                </Paper>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  addArrayItem('historia', 'cards', { title: '', content: '' })
                }
              >
                Agregar Tarjeta
              </Button>
              
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave('historia', sections.historia)}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                  fontWeight: 700,
                  alignSelf: 'flex-start',
                }}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Fundadoras */}
      {activeTab === 2 && !sections.fundadoras && (
        <Alert severity="info">No se encontró la sección Fundadoras. Ejecuta las migraciones.</Alert>
      )}
      {activeTab === 2 && sections.fundadoras && (
        <Card component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Sección de Fundadoras
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={3}>
              <TextField
                label="Título de la Sección"
                fullWidth
                value={sections.fundadoras.title || ''}
                onChange={(e) => updateSection('fundadoras', 'title', e.target.value)}
              />
              <TextField
                label="Subtítulo"
                fullWidth
                multiline
                rows={2}
                value={sections.fundadoras.subtitle || ''}
                onChange={(e) => updateSection('fundadoras', 'subtitle', e.target.value)}
                helperText="Texto descriptivo que aparece debajo del título"
              />
              
              <Typography variant="h6" fontWeight={600} mt={2}>
                Perfiles de Fundadoras
              </Typography>
              
              {sections.fundadoras.fundadoras?.map((fundadora, index) => (
                <Paper key={index} sx={{ p: 3, bgcolor: 'rgba(159,56,118,0.05)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                      Fundadora {index + 1}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => removeArrayItem('fundadoras', 'fundadoras', index)}
                      disabled={sections.fundadoras.fundadoras.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  <Stack spacing={2}>
                    <TextField
                      label="Nombre"
                      fullWidth
                      value={fundadora.name || ''}
                      onChange={(e) => updateArrayItem('fundadoras', 'fundadoras', index, 'name', e.target.value)}
                    />
                    <TextField
                      label="Rol / Descripción"
                      fullWidth
                      multiline
                      rows={2}
                      value={fundadora.role || ''}
                      onChange={(e) => updateArrayItem('fundadoras', 'fundadoras', index, 'role', e.target.value)}
                    />
                    <TextField
                      label="URL de la Imagen"
                      fullWidth
                      value={fundadora.image || ''}
                      onChange={(e) => updateArrayItem('fundadoras', 'fundadoras', index, 'image', e.target.value)}
                      helperText="Ruta de la imagen de la fundadora (ej: /images/fundadoras/nombre.jpg)"
                      placeholder="/images/fundadoras/nombre.jpg"
                    />
                  </Stack>
                </Paper>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  addArrayItem('fundadoras', 'fundadoras', { name: '', role: '', image: '' })
                }
              >
                Agregar Fundadora
              </Button>
              
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave('fundadoras', sections.fundadoras)}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                  fontWeight: 700,
                  alignSelf: 'flex-start',
                }}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Misión y Visión */}
      {activeTab === 3 && (!sections.mision || !sections.vision) && (
        <Alert severity="info">No se encontraron las secciones Misión y Visión. Ejecuta las migraciones.</Alert>
      )}
      {activeTab === 3 && sections.mision && sections.vision && (
        <Stack spacing={3}>
          <Card component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Misión
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                <TextField
                  label="Título"
                  fullWidth
                  value={sections.mision.title || ''}
                  onChange={(e) => updateSection('mision', 'title', e.target.value)}
                />
                <TextField
                  label="Contenido"
                  fullWidth
                  multiline
                  rows={4}
                  value={sections.mision.content || ''}
                  onChange={(e) => updateSection('mision', 'content', e.target.value)}
                />
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSave('mision', sections.mision)}
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                    fontWeight: 700,
                    alignSelf: 'flex-start',
                  }}
                >
                  {saving ? 'Guardando...' : 'Guardar Misión'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Visión
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                <TextField
                  label="Título"
                  fullWidth
                  value={sections.vision.title || ''}
                  onChange={(e) => updateSection('vision', 'title', e.target.value)}
                />
                <TextField
                  label="Contenido"
                  fullWidth
                  multiline
                  rows={4}
                  value={sections.vision.content || ''}
                  onChange={(e) => updateSection('vision', 'content', e.target.value)}
                />
                <TextField
                  label="Frase Destacada"
                  fullWidth
                  value={sections.vision.quote || ''}
                  onChange={(e) => updateSection('vision', 'quote', e.target.value)}
                  helperText="Frase inspiradora que se mostrará destacada"
                />
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSave('vision', sections.vision)}
                  disabled={saving}
                  sx={{
                    background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                    fontWeight: 700,
                    alignSelf: 'flex-start',
                  }}
                >
                  {saving ? 'Guardando...' : 'Guardar Visión'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Tab 4: Servicios */}
      {activeTab === 4 && !sections.servicios && (
        <Alert severity="info">No se encontró la sección Servicios. Ejecuta las migraciones.</Alert>
      )}
      {activeTab === 4 && sections.servicios && (
        <Card component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Sección de Servicios
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={3}>
              <TextField
                label="Título de la Sección"
                fullWidth
                value={sections.servicios.title || ''}
                onChange={(e) => updateSection('servicios', 'title', e.target.value)}
              />
              
              {sections.servicios.services?.map((service, index) => (
                <Paper key={index} sx={{ p: 3, bgcolor: 'rgba(159,56,118,0.05)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                      Servicio {index + 1}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => removeArrayItem('servicios', 'services', index)}
                      disabled={sections.servicios.services.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  <Stack spacing={2}>
                    <TextField
                      label="Título del Servicio"
                      fullWidth
                      value={service.title || ''}
                      onChange={(e) => updateArrayItem('servicios', 'services', index, 'title', e.target.value)}
                    />
                    <TextField
                      label="Descripción"
                      fullWidth
                      value={service.description || ''}
                      onChange={(e) => updateArrayItem('servicios', 'services', index, 'description', e.target.value)}
                    />
                    <TextField
                      label="Color"
                      type="color"
                      fullWidth
                      value={service.color || '#9f3876'}
                      onChange={(e) => updateArrayItem('servicios', 'services', index, 'color', e.target.value)}
                    />
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Items del Servicio
                      </Typography>
                      {service.items?.map((item, itemIndex) => (
                        <Stack key={itemIndex} direction="row" spacing={1} mb={1}>
                          <TextField
                            fullWidth
                            size="small"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...service.items];
                              newItems[itemIndex] = e.target.value;
                              updateArrayItem('servicios', 'services', index, 'items', newItems);
                            }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              const newItems = service.items.filter((_, i) => i !== itemIndex);
                              updateArrayItem('servicios', 'services', index, 'items', newItems);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          const newItems = [...(service.items || []), ''];
                          updateArrayItem('servicios', 'services', index, 'items', newItems);
                        }}
                      >
                        Agregar Item
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  addArrayItem('servicios', 'services', {
                    title: '',
                    description: '',
                    color: '#9f3876',
                    items: [],
                  })
                }
              >
                Agregar Servicio
              </Button>
              
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave('servicios', sections.servicios)}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
                  fontWeight: 700,
                  alignSelf: 'flex-start',
                }}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

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

export default AdminSections;
