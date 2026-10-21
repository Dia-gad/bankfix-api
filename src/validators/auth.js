const { z } = require('zod');

const password = z.string().min(8).max(72).refine(
  (value) => Buffer.byteLength(value, 'utf8') <= 72,
  'Password must be no more than 72 bytes when encoded as UTF-8'
);

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password
}).strict();

const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: password
}).strict();

module.exports = { registerSchema, loginSchema };
