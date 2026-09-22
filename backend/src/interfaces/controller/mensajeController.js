import { Op } from 'sequelize';
import { Mensaje, Usuario, sequelize } from '../../infrastructure/models.js';
import { getIo } from '../socket/index.js';

export const enviarMensaje = async (req, res, next) => {
  try {
    const { receptor_id, reserva_id, contenido } = req.body;
    if (!receptor_id || !contenido) {
      return res.status(400).json({ message: 'receptor_id y contenido son obligatorios' });
    }

    const mensaje = await Mensaje.create({
      emisor_id: req.user.id,
      receptor_id,
      reserva_id: reserva_id || null,
      contenido
    });

    const conUsuario = await Mensaje.findByPk(mensaje.id, {
      include: [{ model: Usuario, as: 'emisor', attributes: ['id', 'nombre', 'foto'] }]
    });

    // Emitir vía socket
    const io = getIo();
    io.to(`user-${receptor_id}`).emit('chat_new_message', conUsuario);

    return res.status(201).json(conUsuario);
  } catch (error) {
    return next(error);
  }
};

export const conversacion = async (req, res, next) => {
  try {
    const { otro_id } = req.params;
    const mensajes = await Mensaje.findAll({
      where: {
        [Op.or]: [
          { emisor_id: req.user.id, receptor_id: otro_id },
          { emisor_id: otro_id, receptor_id: req.user.id }
        ]
      },
      include: [
        { model: Usuario, as: 'emisor', attributes: ['id', 'nombre', 'foto'] },
        { model: Usuario, as: 'receptor', attributes: ['id', 'nombre', 'foto'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    // Marcar como leídos los del otro usuario
    await Mensaje.update(
      { leido: true },
      { where: { emisor_id: otro_id, receptor_id: req.user.id, leido: false } }
    );

    return res.json(mensajes);
  } catch (error) {
    return next(error);
  }
};

export const misConversaciones = async (req, res, next) => {
  try {
    // Obtener últimos mensajes agrupados por interlocutor
    const sql = `
      SELECT m.*, u.nombre AS otro_nombre, u.foto AS otro_foto
      FROM mensajes m
      JOIN usuarios u ON u.id = CASE WHEN m.emisor_id = :userId THEN m.receptor_id ELSE m.emisor_id END
      WHERE m.emisor_id = :userId OR m.receptor_id = :userId
      ORDER BY m."createdAt" DESC
    `;

    const [rows] = await sequelize.query(sql, { replacements: { userId: req.user.id } });

    // Agrupar por otro usuario
    const map = new Map();
    for (const r of rows) {
      const otroId = r.emisor_id === req.user.id ? r.receptor_id : r.emisor_id;
      if (!map.has(otroId)) {
        map.set(otroId, { otro_id: otroId, otro_nombre: r.otro_nombre, otro_foto: r.otro_foto, ultimo_mensaje: r.contenido, cantidad_no_leidos: 0, fecha: r.createdAt });
      }
      if (r.receptor_id === req.user.id && !r.leido) {
        map.get(otroId).cantidad_no_leidos += 1;
      }
    }

    return res.json(Array.from(map.values()));
  } catch (error) {
    return next(error);
  }
};