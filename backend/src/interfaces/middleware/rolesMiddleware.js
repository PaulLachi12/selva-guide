const rolesAllow = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ message: 'No tienes permisos para esta acción' });
  }
  next();
};

export default rolesAllow;