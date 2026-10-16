function notFoundHandler(req, res, _next) {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
}

function errorHandler(err, _req, res, _next) {
  console.error(err.message);
  if (err.code === '23503') {
    return res.status(400).json({ error: { message: 'Referenced facility or asset does not exist, or asset does not belong to facility' } });
  }
  if (err.code === '23514' || err.code === '23502') {
    return res.status(400).json({ error: { message: 'Data violates a database constraint' } });
  }
  const status = Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({
    error: { message: status === 500 ? 'Internal server error' : err.message }
  });
}

module.exports = { notFoundHandler, errorHandler };
