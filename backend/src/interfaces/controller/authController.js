import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario, Guia } from '../../infrastructure/models.js';

const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

export const registro = async (req, res, next) => {
  try {
    const { email, password, nombre, telefono, rol } = req.body;

    if (!email || !password || !nombre) {
      return res.status(400).json({ message: 'Email, contraseña y nombre son obligatorios' });
    }

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const rolFinal = rol === 'guia' ? 'guia' : 'turista';
    const hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      email,
      password: hash,
      nombre,
      telefono,
      rol: rolFinal
    });

    // Si se registra como guía, se crea su perfil de guía
    if (rolFinal === 'guia') {
      await Guia.create({
        usuario_id: usuario.id,
        disponible: false,
        verificado: false
      });
    }

    const token = generarToken(usuario);
    return res.status(201).json({ token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol, foto: usuario.foto } });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);
    return res.json({
      token,
      usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol, foto: usuario.foto }
    });
  } catch (error) {
    return next(error);
  }
};

export const perfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json({ id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol, foto: usuario.foto, telefono: usuario.telefono });
  } catch (error) {
    return next(error);
  }
};

export const actualizarPerfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { nombre, telefono } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : usuario.foto;

    if (nombre) usuario.nombre = nombre;
    if (telefono) usuario.telefono = telefono;
    if (foto) usuario.foto = foto;

    await usuario.save();
    return res.json({ message: 'Perfil actualizado', usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol, foto: usuario.foto, telefono: usuario.telefono } });
  } catch (error) {
    return next(error);
  }
};