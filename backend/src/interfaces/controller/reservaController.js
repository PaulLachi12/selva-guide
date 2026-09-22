import { Reserva, Paquete, Guia, Usuario, Tracking } from '../../infrastructure/models.js';
import { getIo } from '../socket/index.js';

export const crearReserva = async (req, res, next) => {
  try {
    const { paquete_id, fecha_hora, personas, lat_origen, lng_origen } = req.body;

    if (!paquete_id || !fecha_hora) {
      return res.status(400).json({ message: 'Paquete y fecha son obligatorios' });
    }

    const paquete = await Paquete.findByPk(paquete_id, { include: [{ model: Guia, as: 'guia' }] });
    if (!paquete) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }

    const reserva = await Reserva.create({
      turista_id: req.user.id,
      paquete_id,
      fecha_hora,
      personas: personas || 1,
      estado: 'pendiente',
      lat_origen: lat_origen || null,
      lng_origen: lng_origen || null
    });

    // Notificar al guía vía socket
    const io = getIo();
    const guiaUsuarioId = paquete.guia.usuario_id;
    io.to(`user-${guiaUsuarioId}`).emit('nueva_reserva', {
      reserva_id: reserva.id,
      paquete: paquete.titulo,
      fecha_hora
    });

    const creada = await Reserva.findByPk(reserva.id, {
      include: [{ model: Paquete, as: 'paquete', include: [{ model: Guia, as: 'guia', include: [{ model: Usuario, as: 'usuario' }] }] }]
    });

    return res.status(201).json(creada);
  } catch (error) {
    return next(error);
  }
};

export const misReservas = async (req, res, next) => {
  try {
    const reservas = await Reserva.findAll({
      where: { turista_id: req.user.id },
      include: [
        { model: Paquete, as: 'paquete', include: [{ model: Guia, as: 'guia', include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'foto'] }] }] },
        { model: Tracking, as: 'tracking', attributes: ['id', 'lat', 'lng', 'timestamp'] }
      ],
      order: [['fecha_hora', 'DESC']]
    });
    return res.json(reservas);
  } catch (error) {
    return next(error);
  }
};

export const reservasDeGuia = async (req, res, next) => {
  try {
    const guia = await Guia.findOne({ where: { usuario_id: req.user.id } });
    if (!guia) {
      return res.status(403).json({ message: 'Debes ser guía' });
    }

    const reservas = await Reserva.findAll({
      where: { paquete_id: [...(await Paquete.findAll({ where: { guia_id: guia.id }, attributes: ['id'] })).map(p => p.id)] },
      include: [
        { model: Paquete, as: 'paquete' },
        { model: Usuario, as: 'turista', attributes: ['id', 'nombre', 'foto', 'email'] },
        { model: Tracking, as: 'tracking', attributes: ['id', 'lat', 'lng', 'timestamp'] }
      ],
      order: [['fecha_hora', 'DESC']]
    });
    return res.json(reservas);
  } catch (error) {
    return next(error);
  }
};

export const actualizarEstadoReserva = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: `Estado inválido. Usa: ${estadosValidos.join(', ')}` });
    }

    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const guia = await Guia.findOne({ where: { usuario_id: req.user.id } });

    // Solo el guía dueño del paquete o el turista dueño de la reserva pueden cambiar estado
    if (req.user.rol === 'guia') {
      const paquete = await Paquete.findByPk(reserva.paquete_id);
      if (!guia || paquete.guia_id !== guia.id) {
        return res.status(403).json({ message: 'No autorizado' });
      }
    } else if (req.user.rol === 'turista') {
      if (reserva.turista_id !== req.user.id) {
        return res.status(403).json({ message: 'No autorizado' });
      }
      // Un turista solo puede cancelar sus reservas pendientes
      if (estado === 'cancelada' && reserva.estado !== 'pendiente') {
        return res.status(400).json({ message: 'Solo puedes cancelar reservas pendientes' });
      }
      if (estado !== 'cancelada') {
        return res.status(400).json({ message: 'Los turistas solo pueden cancelar reservas' });
      }
    } else if (req.user.rol === 'admin') {
      // admin puede hacer todo
    }

    reserva.estado = estado;
    await reserva.save();

    // Notificar vía socket
    const io = getIo();
    io.to(`user-${reserva.turista_id}`).emit('estado_reserva', { reserva_id: reserva.id, estado });
    const paquete = await Paquete.findByPk(reserva.paquete_id).catch(() => null);
    if (paquete) {
      const guiaOwner = await Guia.findByPk(paquete.guia_id).catch(() => null);
      if (guiaOwner) {
        io.to(`user-${guiaOwner.usuario_id}`).emit('estado_reserva', { reserva_id: reserva.id, estado });
      }
    }

    return res.json({ message: 'Reserva actualizada', reserva });
  } catch (error) {
    return next(error);
  }
};