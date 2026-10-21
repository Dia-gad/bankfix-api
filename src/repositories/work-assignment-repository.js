const db = require('../config/db');

async function listByRequestId(maintenanceRequestId) {
  const result = await db.query(
    `SELECT id, maintenance_request_id, assignee_label, assigned_at, notes
     FROM work_assignments
     WHERE maintenance_request_id = $1
     ORDER BY assigned_at DESC, id DESC`,
    [maintenanceRequestId]
  );
  return result.rows;
}

module.exports = { listByRequestId };
