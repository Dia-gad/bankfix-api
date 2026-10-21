const authService = require('../services/auth-service');

function sendAuthError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

function authenticate(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return sendAuthError(res, 401, 'UNAUTHORIZED', 'A valid Bearer token is required');

  try {
    const payload = authService.verifyToken(match[1]);
    if (!payload.sub || !['requester', 'admin'].includes(payload.role)) {
      return sendAuthError(res, 401, 'INVALID_TOKEN', 'The access token is invalid or expired');
    }
    req.user = { id: String(payload.sub), role: payload.role, name: payload.name };
    return next();
  } catch (err) {
    if (err.code === 'JWT_SECRET_NOT_CONFIGURED') return next(err);
    return sendAuthError(res, 401, 'INVALID_TOKEN', 'The access token is invalid or expired');
  }
}

module.exports = { authenticate };
