import { useState, useEffect } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';

/**
 * Componente que muestra notificaciones cuando la sesión está por expirar
 */
const SessionExpiryNotification = ({ timeUntilExpiry, onExtendSession }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    if (!timeUntilExpiry) return;

    const minutes = Math.floor(timeUntilExpiry / 60000);
    const seconds = Math.floor((timeUntilExpiry % 60000) / 1000);

    // Mostrar advertencia 5 minutos antes
    if (timeUntilExpiry <= 5 * 60 * 1000 && timeUntilExpiry > 4.5 * 60 * 1000) {
      setWarningMessage('Tu sesión expirará en 5 minutos');
      setShowWarning(true);
    }
    // Mostrar advertencia 2 minutos antes
    else if (timeUntilExpiry <= 2 * 60 * 1000 && timeUntilExpiry > 1.5 * 60 * 1000) {
      setWarningMessage('Tu sesión expirará en 2 minutos');
      setShowWarning(true);
    }
    // Mostrar advertencia 1 minuto antes
    else if (timeUntilExpiry <= 60 * 1000 && timeUntilExpiry > 30 * 1000) {
      setWarningMessage(`Tu sesión expirará en ${seconds} segundos`);
      setShowWarning(true);
    }
    // Advertencia crítica últimos 30 segundos
    else if (timeUntilExpiry <= 30 * 1000 && timeUntilExpiry > 0) {
      setWarningMessage(`⚠️ Sesión expirando en ${seconds} segundos`);
      setShowWarning(true);
    }
  }, [timeUntilExpiry]);

  const handleClose = () => {
    setShowWarning(false);
  };

  return (
    <Snackbar
      open={showWarning}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={timeUntilExpiry <= 60000 ? 'error' : 'warning'}
        sx={{ width: '100%' }}
        action={
          onExtendSession && (
            <Button color="inherit" size="small" onClick={onExtendSession}>
              Extender
            </Button>
          )
        }
      >
        {warningMessage}
      </Alert>
    </Snackbar>
  );
};

export default SessionExpiryNotification;
