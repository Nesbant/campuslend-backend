function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || 'Ocurrió un error inesperado.';

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
