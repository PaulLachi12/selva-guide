import { Tracking, Reserva, Paquete, Guia } from '../../infrastructure/models.js';

export const registrarPosicion = async (req, res, next) => {
  try {
    const { reserva_id, lat, lng } = req.body;
    if (!reserva_id || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'reserva_id, lat y lng son obligatorios' });
    }

    const tracking = await Tracking.create({ reserva_id, lat, lng });
    return res.status(201).json(tracking);
  } catch (error) {
    return next(error);
  }
};

export const historialReserva = async (req, res, next) => {
  try {
    const { reserva_id } = req.params;
    const reserva = await Reserva.findByPk(reserva_id);

    // Verificación: solo turista dueño, guía del paquete o admin
    if (req.user.rol === 'turista' && (!reserva || reserva.turista_id !== req.user.id)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    if (req.user.rol === 'guia') {
      const paquete = await Paquete.findByPk(reserva.paquete_id);
      const guia = await Guia.findOne({ where: { usuario_id: req.user.id } });
      if (!guia || !paquete || paquete.guia_id !== guia.id) {
        return res.status(403).json({ message: 'No autorizado' });
      }
    }

    const points = await Tracking.findAll({
      where: { reserva_id },
      order: [['timestamp', 'ASC']]
    });

    return res.json(points);
  } catch (error) {
    return next(error);
  }
};