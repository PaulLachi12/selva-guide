import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Tracking from '../../infrastructure/data_access/Tracking.js';
import Reserva from '../../infrastructure/data_access/Reserva.js';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Sin token'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    socket.join(`user-${userId}`);
    console.log(`Socket conectado: usuario ${userId}`);

    // El guía envía su ubicación durante un tour
    socket.on('tracking_update', async ({ reserva_id, lat, lng }) => {
      try {
        const reserva = await Reserva.findByPk(reserva_id);
        if (!reserva) return;

        await Tracking.create({ reserva_id, lat, lng, timestamp: new Date() });

        // Avisar al turista de la reserva
        io.to(`user-${reserva.turista_id}`).emit('tracking_position', { reserva_id, lat, lng, timestamp: Date.now() });
        // El admin también puede ver todos
        socket.to(`role-admin`).emit('tracking_position', { reserva_id, lat, lng, timestamp: Date.now() });
      } catch (err) {
        console.error('Error tracking_update:', err.message);
      }
    });

    // Chat: enviar mensaje
    socket.on('chat_message', ({ reserva_id, receptor_id, contenido }) => {
      const mensaje = { emisor_id: userId, receptor_id, reserva_id, contenido, createdAt: new Date() };
      io.to(`user-${receptor_id}`).emit('chat_new_message', mensaje);
      io.to(`user-${userId}`).emit('chat_new_message', mensaje);
    });

    socket.on('disconnect', () => {
      console.log(`Socket desconectado: usuario ${userId}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) throw new Error('Socket no inicializado');
  return io;
};