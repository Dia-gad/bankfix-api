function notFoundHandler(req, res, _next) {
  return res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: `Route not found: ${req.method} ${req.path}` }
  });
}

function errorHandler(err, _req, res, _next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Request body contains invalid JSON' } });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: { code: 'BODY_TOO_LARGE', message: 'Request body is too large' } });
  }
  if (err.code === '23503') {
    return res.status(400).json({ error: { code: 'INVALID_REFERENCE', message: 'Referenced facility or asset does not exist, or asset does not belong to facility' } });
  }
  if (err.code === '23505') {
    return res.status(409).json({ error: { code: 'CONFLICT', message: 'A record with the supplied unique value already exists' } });
  }
  if (err.code === '23514' || err.code === '23502' || err.code === '22P02') {
    return res.status(400).json({ error: { code: 'INVALID_DATA', message: 'Request data violates a required field or database constraint' } });
  }

  const status = Number.isInteger(err.status) && err.status >= 400 && err.status <= 599 ? err.status : 500;
  const code = status === 400 ? (err.code || 'BAD_REQUEST') : status === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR';
  const message = status === 500 ? 'Internal server error' : err.message;
  if (status === 500) console.error('Request failed:', err.code || err.name || 'UNEXPECTED_ERROR');
  return res.status(status).json({ error: { code, message } });
}

module.exports = { notFoundHandler, errorHandler };
