const db = require('../config/db');

const publicColumns = 'id, name, email, role, created_at';

async function create({ name, email, passwordHash }) {
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING ${publicColumns}`,
    [name, email, passwordHash]
  );
  return result.rows[0];
}

async function findByEmail(email) {
  const result = await db.query(
    `SELECT ${publicColumns}, password_hash FROM users WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  return result.rows[0] || null;
}

async function findPublicById(id) {
  const result = await db.query(
    `SELECT ${publicColumns} FROM users WHERE id = $1`, [id]
  );
  return result.rows[0] || null;
}

module.exports = { create, findByEmail, findPublicById };
