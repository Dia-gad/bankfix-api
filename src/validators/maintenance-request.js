const { z } = require('zod');

const positiveId = z.number().int().positive();
const title = z.string().trim().min(3).max(160);
const description = z.string().trim().max(2000).optional().nullable();
const priority = z.enum(['low', 'medium', 'high', 'urgent']);
const status = z.enum(['open', 'in_progress', 'resolved', 'cancelled']);

const createSchema = z.object({
  facility_id: positiveId,
  asset_id: positiveId.optional().nullable(),
  title,
  description,
  priority: priority.optional(),
  status: status.optional()
}).strict();

const updateSchema = z.object({
  facility_id: positiveId.optional(),
  asset_id: positiveId.optional().nullable(),
  title: title.optional(),
  description,
  priority: priority.optional(),
  status: status.optional()
}).strict();

module.exports = { createSchema, updateSchema };
