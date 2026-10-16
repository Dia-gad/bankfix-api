const service = require('../services/maintenance-request-service');
const { createSchema, updateSchema } = require('../validators/maintenance-request');

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    const error = new Error('id must be a positive integer');
    error.status = 400;
    throw error;
  }
  return id;
}

async function list(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const rows = await service.list({ limit, offset });
    res.status(200).json({ data: rows, pagination: { limit, offset, count: rows.length } });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const row = await service.getById(parseId(req.params.id));
    if (!row) return res.status(404).json({ error: { message: 'Maintenance request not found' } });
    res.status(200).json({ data: row });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: { message: 'Validation failed', details: parsed.error.flatten() } });
    const row = await service.create(parsed.data);
    res.status(201).json({ data: row });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: { message: 'Validation failed', details: parsed.error.flatten() } });
    if (Object.keys(parsed.data).length === 0) return res.status(400).json({ error: { message: 'Provide at least one field to update' } });
    const row = await service.update(id, parsed.data);
    if (!row) return res.status(404).json({ error: { message: 'Maintenance request not found' } });
    res.status(200).json({ data: row });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const row = await service.remove(parseId(req.params.id));
    if (!row) return res.status(404).json({ error: { message: 'Maintenance request not found' } });
    res.status(200).json({ data: row, message: 'Maintenance request deleted' });
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove };
