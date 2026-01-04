export const API_BASE_URL = '/api';

export const getApiUrl = (path = '') => {
  if (!path) return API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const getAbsoluteUrl = (relativePath = '') => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http')) return relativePath;
  if (typeof window === 'undefined') return relativePath;
  try {
    return new URL(relativePath, window.location.origin).toString();
  } catch (_error) {
    return relativePath;
  }
};
