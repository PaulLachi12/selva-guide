import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

import { registro, login, perfil, actualizarPerfil } from '../controller/authController.js';
import {
  listarGuia, detalleGuia, miPerfilGuia, crearPerfilGuia,
  actualizarPerfilGuia, toggleDisponibilidad
} from '../controller/guiaController.js';
import {
  listarPaquetes, detallePaquete, crearPaquete,
  actualizarPaquete, eliminarPaquete
} from '../controller/paqueteController.js';
import {
  crearReserva, misReservas, reservasDeGuia, actualizarEstadoReserva
} from '../controller/reservaController.js';
import { registrarPosicion, historialReserva } from '../controller/trackingController.js';
import { crearValoracion, valoracionesDeGuia } from '../controller/valoracionController.js';
import { enviarMensaje, conversacion, misConversaciones } from '../controller/mensajeController.js';
import { stats, listarGuias, cambiarVerificacion, listarUsuarios } from '../controller/adminController.js';
import rolesAllow from '../middleware/rolesMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = Router();

// ---- Auth ----
router.post('/auth/registro', registro);
router.post('/auth/login', login);
router.get('/auth/perfil', authMiddleware, perfil);
router.put('/auth/perfil', authMiddleware, upload.single('foto'), actualizarPerfil);

// ---- Guías ----
router.get('/guias', listarGuia);
router.get('/guias/mi-perfil', authMiddleware, miPerfilGuia);
router.post('/guias/perfil', authMiddleware, crearPerfilGuia);
router.put('/guias/perfil', authMiddleware, actualizarPerfilGuia);
router.put('/guias/disponibilidad', authMiddleware, toggleDisponibilidad);
router.get('/guias/:id', detalleGuia);

// ---- Paquetes ----
router.get('/paquetes', listarPaquetes);
router.get('/paquetes/:id', detallePaquete);
router.post('/paquetes', authMiddleware, crearPaquete);
router.put('/paquetes/:id', authMiddleware, actualizarPaquete);
router.delete('/paquetes/:id', authMiddleware, eliminarPaquete);

// ---- Reservas ----
router.post('/reservas', authMiddleware, crearReserva);
router.get('/reservas/mias', authMiddleware, misReservas);
router.get('/reservas/guia', authMiddleware, reservasDeGuia);
router.put('/reservas/:id/estado', authMiddleware, actualizarEstadoReserva);

// ---- Tracking ----
router.post('/tracking', authMiddleware, registrarPosicion);
router.get('/tracking/:reserva_id', authMiddleware, historialReserva);

// ---- Valoraciones ----
router.post('/valoraciones', authMiddleware, crearValoracion);
router.get('/valoraciones/guia/:guia_id', valoracionesDeGuia);

// ---- Mensajes ----
router.post('/mensajes', authMiddleware, enviarMensaje);
router.get('/mensajes/conversaciones', authMiddleware, misConversaciones);
router.get('/mensajes/:otro_id', authMiddleware, conversacion);

// ---- Admin ----
router.get('/admin/stats', authMiddleware, rolesAllow('admin'), stats);
router.get('/admin/guias', authMiddleware, rolesAllow('admin'), listarGuias);
router.put('/admin/guias/:id/verificacion', authMiddleware, rolesAllow('admin'), cambiarVerificacion);
router.get('/admin/usuarios', authMiddleware, rolesAllow('admin'), listarUsuarios);

export default router;