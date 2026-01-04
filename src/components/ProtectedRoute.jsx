import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ProtectedRoute = ({ children }) => {
  const [auth] = useLocalStorage('imparables-auth', null);

  useEffect(() => {
    console.log('🔐 ProtectedRoute - Auth state:', auth);
    console.log('🔐 ProtectedRoute - Token exists:', !!auth?.token);
    console.log('🔐 ProtectedRoute - LocalStorage raw:', localStorage.getItem('imparables-auth'));
  }, [auth]);

  if (!auth?.token) {
    console.log('❌ ProtectedRoute - No token, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('✅ ProtectedRoute - Token valid, allowing access');
  return children;
};

export default ProtectedRoute;
