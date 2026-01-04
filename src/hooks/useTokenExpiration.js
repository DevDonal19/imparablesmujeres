import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para verificar la expiración del token JWT
 * Cierra sesión automáticamente cuando el token expira
 * Opcionalmente muestra advertencia antes de expirar
 */
const useTokenExpiration = (auth, setAuth) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.token) {
      return;
    }

    const checkTokenExpiration = () => {
      try {
        // Decodificar el token JWT (sin verificar la firma)
        const base64Url = auth.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        const payload = JSON.parse(jsonPayload);
        const expirationTime = payload.exp * 1000; // Convertir a milisegundos
        const currentTime = Date.now();
        const timeLeft = expirationTime - currentTime;

        if (timeLeft <= 0) {
          console.log(' Token expirado, cerrando sesión...');
          localStorage.removeItem('imparables-auth');
          setAuth(null);
          navigate('/admin/login');
          return;
        }
      } catch (error) {
        console.error('Error verificando expiración del token:', error);
      }
    };

    // Verificar cada 30 segundos
    const interval = setInterval(checkTokenExpiration, 30000);

    // Comprobar una vez al montar
    checkTokenExpiration();

    return () => clearInterval(interval);
  }, [auth?.token, setAuth, navigate]);

  return {};
};

export default useTokenExpiration;
