import { Usuario, Guia, Reserva, Paquete, sequelize } from '../../infrastructure/models.js';

export const stats = async (req, res, next) => {
  try {
    const [totalUsuarios] = await sequelize.query('SELECT COUNT(*) AS total FROM usuarios');
    const [totalGuias] = await sequelize.query('SELECT COUNT(*) AS total FROM guias');
    const [totalReservas] = await sequelize.query('SELECT COUNT(*) AS total FROM reservas');
    const [totalPendientes] = await sequelize.query("SELECT COUNT(*) AS total FROM reservas WHERE estado = 'pendiente'");
    const [ingresos] = await sequelize.query(`
      SELECT COALESCE(SUM(p.precio * r.personas), 0) AS total
      FROM reservas r
      JOIN paquetes p ON p.id = r.paquete_id
      WHERE r.estado IN ('confirmada', 'en_curso', 'completada')
    `);

    return res.json({
      total_usuarios: Number(totalUsuarios[0].total),
      total_guias: Number(totalGuias[0].total),
      total_reservas: Number(totalReservas[0].total),
      reservas_pendientes: Number(totalPendientes[0].total),
      ingresos: Number(ingresos[0].total)
    });
  } catch (error) {
    return next(error);
  }
};

export const listarGuias = async (req, res, next) => {
  try {
    const guias = await Guia.findAll({
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'foto', 'email'] }]
    });
    return res.json(guias);
  } catch (error) {
    return next(error);
  }
};

export const cambiarVerificacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verificado } = req.body;
    const guia = await Guia.findByPk(id);
    if (!guia) {
      return res.status(404).json({ message: 'Guía no encontrado' });
    }
    guia.verificado = verificado !== undefined ? verificado : !guia.verificado;
    await guia.save();
    return res.json(guia);
  } catch (error) {
    return next(error);
  }
};

export const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: ['id', 'email', 'nombre', 'rol', 'foto'], order: [['id', 'ASC']] });
    return res.json(usuarios);
  } catch (error) {
    return next(error);
  }
};