const db = require('../config/db');

const columns = `id, facility_id, asset_id, title, description, priority, status,
  reported_by, created_by_user_id, reported_at, updated_at`;

async function list({ limit, offset, user }) {
  if (user.role === 'admin') {
    const result = await db.query(
      `SELECT ${columns} FROM maintenance_requests ORDER BY reported_at DESC, id DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }
  const result = await db.query(
    `SELECT ${columns} FROM maintenance_requests WHERE created_by_user_id = $1
     ORDER BY reported_at DESC, id DESC LIMIT $2 OFFSET $3`,
    [user.id, limit, offset]
  );
  return result.rows;
}

async function getById(id) {
  const result = await db.query(`SELECT ${columns} FROM maintenance_requests WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function create(data) {
  const result = await db.query(
    `INSERT INTO maintenance_requests
      (facility_id, asset_id, title, description, priority, status, reported_by, created_by_user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${columns}`,
    [data.facility_id, data.asset_id ?? null, data.title, data.description ?? null,
      data.priority ?? 'medium', data.status ?? 'open', data.reported_by, data.created_by_user_id]
  );
  return result.rows[0];
}

async function update(id, data) {
  const allowed = ['facility_id', 'asset_id', 'title', 'description', 'priority', 'status'];
  const fields = Object.keys(data).filter((key) => allowed.includes(key));
  if (!fields.length) return getById(id);
  const values = fields.map((key) => data[key]);
  const assignments = fields.map((key, index) => `${key} = $${index + 1}`);
  values.push(id);
  const result = await db.query(
    `UPDATE maintenance_requests SET ${assignments.join(', ')}, updated_at = NOW()
     WHERE id = $${values.length} RETURNING ${columns}`,
    values
  );
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await db.query(
    `DELETE FROM maintenance_requests WHERE id = $1 RETURNING ${columns}`, [id]
  );
  return result.rows[0] || null;
}

module.exports = { list, getById, create, update, remove };
