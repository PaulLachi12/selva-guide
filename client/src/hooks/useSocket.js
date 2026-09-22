import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useSocket = () => {
  const { token, usuario } = useAuth();
  const [socket, setSocket] = useState(null);
  const ioRef = useRef(null);

  useEffect(() => {
    if (!token) return undefined;
    const s = io('http://localhost:9000', { auth: { token } });
    ioRef.current = s;
    setSocket(s);
    return () => s.disconnect();
  }, [token]);

  return socket;
};