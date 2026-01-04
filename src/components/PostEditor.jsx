import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Alert,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { apiFetch, getAbsoluteUrl } from '../utils/api';

const PostEditor = ({ open, onClose, post, onSave, saving }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    category: post?.category || '',
    date: post?.date ? new Date(post.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    image: post?.image || '',
    author: post?.author || 'Equipo Imparables',
  });
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        category: post.category || '',
        date: post.date ? new Date(post.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: post.image || '',
        author: post.author || 'Equipo Imparables',
      });
    }
  }, [post]);

  const loadCategories = async () => {
    try {
      const response = await apiFetch('/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        // Si no hay categoría seleccionada, usar la primera
        if (!formData.category && data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0].name }));
        }
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no debe superar 5MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setUploadError('Solo se permiten imágenes');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await apiFetch('/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        // Construir URL completa
        const imageUrl = getAbsoluteUrl(data.url);
        setFormData({ ...formData, image: imageUrl });
      } else {
        setUploadError('Error al subir la imagen');
      }
    } catch (error) {
      setUploadError('Error de conexión al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'color',
    'background',
    'link',
  ];

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h5" fontWeight={800}>
            {post ? 'Editar Publicación' : 'Nueva Publicación'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Título */}
            <TextField
              label="Título"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={saving}
            />

            {/* Categoría y Fecha */}
            <Stack direction="row" spacing={2}>
              <Autocomplete
                fullWidth
                freeSolo
                options={categories.map((cat) => cat.name)}
                value={formData.category}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, category: newValue || '' });
                }}
                onInputChange={(event, newInputValue) => {
                  setFormData({ ...formData, category: newInputValue });
                }}
                disabled={saving}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categoría"
                    required
                    helperText="Selecciona o escribe una nueva categoría"
                  />
                )}
              />
              <TextField
                label="Fecha"
                type="date"
                fullWidth
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                disabled={saving}
              />
            </Stack>

            {/* Autor */}
            <TextField
              label="Autor"
              fullWidth
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              disabled={saving}
            />

            {/* Resumen */}
            <TextField
              label="Resumen"
              multiline
              rows={3}
              fullWidth
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              disabled={saving}
              helperText="Breve descripción que aparecerá en la lista de artículos"
            />

            {/* Imagen */}
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Imagen Principal
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || saving}
                >
                  {uploading ? 'Subiendo...' : 'Subir Imagen'}
                </Button>
                {uploadError && <Alert severity="error">{uploadError}</Alert>}
                {formData.image && (
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: 300,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      onClick={() => setFormData({ ...formData, image: '' })}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Contenido */}
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Contenido del Artículo
              </Typography>
              <Box
                sx={{
                  '& .quill': {
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                  },
                  '& .ql-container': {
                    minHeight: 300,
                    fontSize: '16px',
                  },
                  '& .ql-editor': {
                    minHeight: 300,
                  },
                }}
              >
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={modules}
                  formats={formats}
                  readOnly={saving}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving || uploading}
            startIcon={<SaveIcon />}
            sx={{
              background: 'linear-gradient(120deg, #9f3876, #bd1d82)',
              fontWeight: 700,
            }}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>

        {saving && <LinearProgress />}
      </form>
    </Dialog>
  );
};

export default PostEditor;
