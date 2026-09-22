import { Paquete, Guia, Usuario } from '../../infrastructure/models.js';

export const listarPaquetes = async (req, res, next) => {
  try {
    const { guia_id } = req.query;
    const where = { estado: 'activo' };
    if (guia_id) where.guia_id = guia_id;

    const paquetes = await Paquete.findAll({
      where,
      include: [
        { model: Guia, as: 'guia', include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'foto'] }] }
      ],
      order: [['id', 'ASC']]
    });

    return res.json(paquetes);
  } catch (error) {
    return next(error);
  }
};

export const detallePaquete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paquete = await Paquete.findByPk(id, {
      include: [
        { model: Guia, as: 'guia', include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'foto'] }] }
      ]
    });

    if (!paquete) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }
    return res.json(paquete);
  } catch (error) {
    return next(error);
  }
};

export const crearPaquete = async (req, res, next) => {
  try {
    const guia = await Guia.findOne({ where: { usuario_id: req.user.id } });
    if (!guia) {
      return res.status(403).json({ message: 'Debes tener perfil de guía para crear paquetes' });
    }

    const { titulo, descripcion, duracion, precio, capacidad } = req.body;
    if (!titulo || precio === undefined) {
      return res.status(400).json({ message: 'Título y precio son obligatorios' });
    }

    const paquete = await Paquete.create({
      guia_id: guia.id,
      titulo,
      descripcion,
      duracion: duracion || 1,
      precio,
      capacidad: capacidad || 1
    });

    return res.status(201).json(paquete);
  } catch (error) {
    return next(error);
  }
};

export const actualizarPaquete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guia = await Guia.findOne({ where: { usuario_id: req.user.id } });

    const paquete = await Paquete.findByPk(id);
    if (!paquete) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }
    if (guia.id !== paquete.guia_id) {
      return res.status(403).json({ message: 'Solo el dueño del paquete puede editarlo' });
    }

    const { titulo, descripcion, duracion, precio, capacidad, estado } = req.body;
    if (titulo !== undefined) paquete.titulo = titulo;
    if (descripcion !== undefined) paquete.descripcion = descripcion;
    if (duracion !== undefined) paquete.duracion = duracion;
    if (precio !== undefined) paquete.precio = precio;
    if (capacidad !== undefined) paquete.capacidad = capacidad;
    if (estado !== undefined) paquete.estado = estado;

    await paquete.save();
    return res.json(paquete);
  } catch (error) {
    return next(error);
  }
};

export const eliminarPaquete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guia = await Guia.findOne({ where: { usuario_id: req.user.id } });

    const paquete = await Paquete.findByPk(id);
    if (!paquete) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }
    if (guia.id !== paquete.guia_id) {
      return res.status(403).json({ message: 'Solo el dueño del paquete puede eliminarlo' });
    }

    await paquete.destroy();
    return res.json({ message: 'Paquete eliminado' });
  } catch (error) {
    return next(error);
  }
};