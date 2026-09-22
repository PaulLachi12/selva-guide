import { useEffect, useState } from 'react';

// Geolocalización en vivo (GPS del dispositivo). Funciona sin internet en móviles.
export function useGeolocation(activo = false) {
  const [estado, setEstado] = useState('inactivo'); // inactivo | buscando | activo | error
  const [pos, setPos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activo) {
      setEstado('inactivo');
      return;
    }
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setEstado('error');
      setError('Tu dispositivo no soporta GPS');
      return;
    }
    setEstado('buscando');
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPos({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          accuracy: p.coords.accuracy,
          heading: p.coords.heading,
          speed: p.coords.speed,
          ts: p.timestamp
        });
        setEstado('activo');
        setError(null);
      },
      (e) => {
        setError(e.message);
        setEstado('error');
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [activo]);

  return { estado, pos, error };
}

// Estado de conexión (online/offline)
export function useOnline() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}
