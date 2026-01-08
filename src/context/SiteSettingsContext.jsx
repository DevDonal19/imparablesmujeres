import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getSiteSettings } from '../services/api';

const SiteSettingsContext = createContext({
  settings: null,
  loading: true,
  error: null,
  refresh: () => {},
});

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSiteSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando configuración del sitio:', err);
      setError(err.message || 'No se pudo cargar la configuración del sitio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const value = useMemo(
    () => ({
      settings,
      loading,
      error,
      refresh: fetchSettings,
    }),
    [settings, loading, error, fetchSettings]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
