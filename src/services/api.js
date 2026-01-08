import { getApiUrl } from '../utils/api';

const API_BASE_URL = getApiUrl();

const defaultHeaders = { 'Content-Type': 'application/json' };

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Si el token expiró (401), cerrar sesión automáticamente
    if (response.status === 401) {
      console.log('🔒 Token expirado, cerrando sesión...');
      localStorage.removeItem('imparables-auth');
      // Redirigir al login
      window.location.href = '/admin/login';
      throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
    const message = data?.message || 'Error al comunicarse con el servidor';
    throw new Error(message);
  }
  return data;
};

const buildOptions = (options = {}) => ({
  ...options,
  headers: {
    ...defaultHeaders,
    ...(options.headers || {}),
  },
});

export const getPosts = () => fetch(`${API_BASE_URL}/posts`).then(handleResponse);

export const login = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ email, password }),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  let payload = null;

  try {
    payload = isJson ? await response.json() : await response.text();
  } catch (_error) {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (isJson && payload?.message) ||
      (response.status === 401 ? 'Credenciales inválidas' : 'No se pudo iniciar sesión');
    throw new Error(message);
  }

  if (!isJson || !payload?.token) {
    throw new Error('La API de login devolvió una respuesta no válida');
  }

  return payload;
};

export const createPost = (payload, token) =>
  fetch(`${API_BASE_URL}/posts`, buildOptions({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })).then(handleResponse);

export const updatePost = (id, payload, token) =>
  fetch(`${API_BASE_URL}/posts/${id}`, buildOptions({
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })).then(handleResponse);

export const deletePost = (id, token) =>
  fetch(`${API_BASE_URL}/posts/${id}`, buildOptions({
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })).then(handleResponse);

export const getSiteSettings = () =>
  fetch(`${API_BASE_URL}/settings`).then(handleResponse);

export const updateSiteSettings = async (payload, token) => {
  console.log('🌐 [API] updateSiteSettings - URL:', `${API_BASE_URL}/settings`);
  console.log('🌐 [API] updateSiteSettings - Payload:', payload);
  console.log('🌐 [API] updateSiteSettings - Token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
  
  const response = await fetch(`${API_BASE_URL}/settings`, buildOptions({
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }));
  
  console.log('🌐 [API] updateSiteSettings - Response status:', response.status);
  console.log('🌐 [API] updateSiteSettings - Response ok:', response.ok);
  
  return handleResponse(response);
};

export const getSections = () =>
  fetch(`${API_BASE_URL}/sections`).then(handleResponse);

export const getSection = (section) =>
  fetch(`${API_BASE_URL}/sections/${section}`).then(handleResponse);

export const updateSection = (section, content, token) =>
  fetch(`${API_BASE_URL}/sections/${section}`, buildOptions({
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  })).then(handleResponse);
