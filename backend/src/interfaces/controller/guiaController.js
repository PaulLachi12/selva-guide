import { Guia, Usuario, Paquete, Valoracion } from '../../infrastructure/models.js';

export const listarGuia = async (req, res, next) => {
  try {
    const { disponible } = req.query;
    const where = {};
    if (disponible === 'true') where.disponible = true;

    const guias = await Guia.findAll({
      where,
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'foto', 'email'] },
        { model: Paquete, as: 'paquetes', where: { estado: 'activo' }, required: false }
      ],
      order: [['id', 'ASC']]
    });

    // Calcular rating promedio
    const resultado = await Promise.all(guias.map(async (g) => {
      const guiaJSON = g.toJSON();
      const valoraciones = await Valoracion.findAll({ where: { guia_id: g.id }, attributes: ['estrellas'] });
      const promedio = valoraciones.length
        ? (valoraciones.reduce((s, v) => s + v.estrellas, 0) / valoraciones.length).toFixed(1)
        : '0';
      guiaJSON.rating = Number(promedio);
      guiaJSON.total_valoraciones = valoraciones.length;
      return guiaJSON;
    }));

    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const detalleGuia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guia = await Guia.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'foto', 'email'] },
        { model: Paquete, as: 'paquetes', where: { estado: 'activo' }, required: false }
      ]
    });

    if (!guia) {
      return res.status(404).json({ message: 'Guía no encontrado' });
    }

    const guiaJSON = guia.toJSON();
    const valoraciones = await Valoracion.findAll({
      where: { guia_id: id },
      include: { model: Usuario, as: 'turista', attributes: ['nombre', 'foto'] },
      order: [['createdAt', 'DESC']]
    });

    const promedio = valoraciones.length
      ? (valoraciones.reduce((s, v) => s + v.estrellas, 0) / valoraciones.length).toFixed(1)
      : '0';

    return res.json({ ...guiaJSON, rating: Number(promedio), total_valoraciones: valoraciones.length, valoraciones });
  } catch (error) {
    return next(error);
  }
};

export const miPerfilGuia = async (req, res, next) => {
  try {
    const guia = await Guia.findOne({
      where: { usuario_id: req.user.id },
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'foto', 'email'] }]
    });

    if (!guia) {
      return res.status(404).json({ message: 'No tienes perfil de guía' });
    }

    return res.json(guia);
  } catch (error) {
    return next(error);
  }
};

export const crearPerfilGuia = async (req, res, next) => {
  try {
    const { bio, especialidad, idiomas, tarifa_hora, lat, lng } = req.body;

    let guia = await Guia.findOne({ where: { usuario_id: req.user.id } });
    if (guia) {
      return res.status(409).json({ message: 'Ya tienes un perfil de guía creado' });
    }

    guia = await Guia.create({
      usuario_id: req.user.id,
      bio,
      especialidad,
      idiomas,
      tarifa_hora: tarifa_hora || 0,
      lat: lat || null,
      lng: lng || null,
      disponible: true,
      verificado: true
    });

    return res.status(201).json(guia);
  } catch (error) {
    return next(error);
  }
};

export const actualizarPerfilGuia = async (req, res, next) => {
  try {
    const guia = await Guia.findOne({ where: { usuario_id: req.user.id } });
    if (!guia) {
      return res.status(404).json({ message: 'No tienes perfil de guía' });
    }

    const { bio, especialidad, idiomas, tarifa_hora, lat, lng, disponible } = req.body;

    if (bio !== undefined) guia.bio = bio;
    if (especialidad !== undefined) guia.especialidad = especialidad;
    if (idiomas !== undefined) guia.idiomas = idiomas;
    if (tarifa_hora !== undefined) guia.tarifa_hora = tarifa_hora;
    if (lat !== undefined) guia.lat = lat;
    if (lng !== undefined) guia.lng = lng;
    if (disponible !== undefined) guia.disponible = disponible;

    await guia.save();
    return res.json(guia);
  } catch (error) {
    return next(error);
  }
};

export const toggleDisponibilidad = async (req, res, next) => {
  try {
    const guia = await Guia.findOne({ where: { usuario_id: req.user.id } });
    if (!guia) {
      return res.status(404).json({ message: 'No tienes perfil de guía' });
    }
    guia.disponible = !guia.disponible;
    await guia.save();
    return res.json({ disponible: guia.disponible });
  } catch (error) {
    return next(error);
  }
};