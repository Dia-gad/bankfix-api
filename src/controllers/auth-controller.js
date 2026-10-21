const authService = require('../services/auth-service');
const { registerSchema, loginSchema } = require('../validators/auth');

function validationError(res, parsed) {
  return res.status(400).json({
    error: { code: 'VALIDATION_ERROR', message: 'Request validation failed', details: parsed.error.flatten() }
  });
}

async function register(req, res, next) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return validationError(res, parsed);

  try {
    const result = await authService.register(parsed.data);
    return res.status(201).json({ data: result });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: { code: 'EMAIL_ALREADY_REGISTERED', message: 'An account with this email already exists' } });
    }
    return next(err);
  }
}

async function login(req, res, next) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return validationError(res, parsed);

  try {
    const result = await authService.login(parsed.data);
    if (!result) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect' } });
    }
    return res.status(200).json({ data: result });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getPublicUser(req.user.id);
    if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'User account no longer exists' } });
    return res.status(200).json({ data: user });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, me };
