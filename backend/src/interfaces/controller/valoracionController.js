import { Valoracion, Usuario, Reserva, Guia } from '../../infrastructure/models.js';

export const crearValoracion = async (req, res, next) => {
  try {
    const { guia_id, reserva_id, estrellas, comentario } = req.body;

    if (!guia_id || !reserva_id || !estrellas) {
      return res.status(400).json({ message: 'guia_id, reserva_id y estrellas son obligatorios' });
    }
    if (estrellas < 1 || estrellas > 5) {
      return res.status(400).json({ message: 'Las estrellas deben estar entre 1 y 5' });
    }

    // Solo se puede valorar una reserva terminada propia
    const reserva = await Reserva.findByPk(reserva_id);
    if (!reserva || reserva.turista_id !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para valorar esta reserva' });
    }
    if (reserva.estado !== 'completada') {
      return res.status(400).json({ message: 'Solo se pueden valorar reservas completadas' });
    }

    const yaExiste = await Valoracion.findOne({ where: { reserva_id } });
    if (yaExiste) {
      return res.status(409).json({ message: 'Esta reserva ya fue valorada' });
    }

    const valoracion = await Valoracion.create({
      turista_id: req.user.id,
      guia_id,
      reserva_id,
      estrellas,
      comentario: comentario || null
    });

    const creada = await Valoracion.findByPk(valoracion.id, {
      include: [{ model: Usuario, as: 'turista', attributes: ['id', 'nombre', 'foto'] }]
    });
    return res.status(201).json(creada);
  } catch (error) {
    return next(error);
  }
};

export const valoracionesDeGuia = async (req, res, next) => {
  try {
    const { guia_id } = req.params;
    const valoraciones = await Valoracion.findAll({
      where: { guia_id },
      include: [{ model: Usuario, as: 'turista', attributes: ['id', 'nombre', 'foto'] }],
      order: [['createdAt', 'DESC']]
    });
    return res.json(valoraciones);
  } catch (error) {
    return next(error);
  }
};