const errorHandlerMiddleware = (err, req, res, next) => {
  console.error('ERROR:', err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido' });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'El recurso ya existe (duplicado)' });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: err.errors.map(e => e.message).join(', ') });
  }

  if (err.name === 'ValidationError' && err.errors) {
    return res.status(400).json({ message: 'Validación fallida', errors: err.errors.array ? err.errors.array() : err.errors });
  }

  if (err.message && err.error) {
    // error de multer
    return res.status(400).json({ message: err.message });
  }

  return res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
};

export default errorHandlerMiddleware;