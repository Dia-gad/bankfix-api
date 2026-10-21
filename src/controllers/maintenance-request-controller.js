const service = require('../services/maintenance-request-service');
const { createSchema, updateSchema } = require('../validators/maintenance-request');

function parseId(value) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    const error = new Error('id must be a positive integer');
    error.status = 400;
    error.code = 'INVALID_ID';
    throw error;
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    const error = new Error('id must be a positive integer');
    error.status = 400;
    error.code = 'INVALID_ID';
    throw error;
  }
  return id;
}

function sendValidationError(res, parsed) {
  return res.status(400).json({
    error: { code: 'VALIDATION_ERROR', message: 'Request validation failed', details: parsed.error.flatten() }
  });
}

function canAccess(row, user) {
  return user.role === 'admin' || String(row.created_by_user_id) === String(user.id);
}

function sendNotFound(res) {
  return res.status(404).json({ error: { code: 'MAINTENANCE_REQUEST_NOT_FOUND', message: 'Maintenance request not found' } });
}

function sendForbidden(res) {
  return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'You are not allowed to access or change this maintenance request' } });
}

async function list(req, res, next) {
  const rawLimit = req.query.limit === undefined ? 20 : Number(req.query.limit);
  const rawOffset = req.query.offset === undefined ? 0 : Number(req.query.offset);
  if (!Number.isSafeInteger(rawLimit) || !Number.isSafeInteger(rawOffset)) {
    return res.status(400).json({
      error: { code: 'INVALID_PAGINATION', message: 'limit and offset must be whole numbers' }
    });
  }
  try {
    const limit = Math.min(Math.max(rawLimit || 20, 1), 100);
    const offset = Math.max(rawOffset, 0);
    const rows = await service.list({ limit, offset, user: req.user });
    return res.status(200).json({ data: rows, pagination: { limit, offset, count: rows.length } });
  } catch (err) { return next(err); }
}

async function getById(req, res, next) {
  try {
    const row = await service.getById(parseId(req.params.id));
    if (!row) return sendNotFound(res);
    if (!canAccess(row, req.user)) return sendForbidden(res);
    return res.status(200).json({ data: row });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed);
  try {
    const row = await service.create({
      ...parsed.data,
      reported_by: req.user.name,
      created_by_user_id: req.user.id
    });
    return res.status(201).json({ data: row });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  let id;
  try { id = parseId(req.params.id); } catch (err) { return next(err); }
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed);
  if (Object.keys(parsed.data).length === 0) {
    return res.status(400).json({ error: { code: 'EMPTY_UPDATE', message: 'Provide at least one field to update' } });
  }
  try {
    const existing = await service.getById(id);
    if (!existing) return sendNotFound(res);
    if (!canAccess(existing, req.user)) return sendForbidden(res);
    const row = await service.update(id, parsed.data);
    if (!row) return sendNotFound(res);
    return res.status(200).json({ data: row });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const existing = await service.getById(id);
    if (!existing) return sendNotFound(res);
    if (!canAccess(existing, req.user)) return sendForbidden(res);
    const row = await service.remove(id);
    if (!row) return sendNotFound(res);
    return res.status(200).json({ data: row, message: 'Maintenance request deleted' });
  } catch (err) { next(err); }
}

async function listAssignments(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const request = await service.getById(id);
    if (!request) return sendNotFound(res);
    if (!canAccess(request, req.user)) return sendForbidden(res);
    const rows = await service.listAssignments(id);
    return res.status(200).json({ data: rows, maintenance_request_id: id, count: rows.length });
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove, listAssignments };
