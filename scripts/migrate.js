require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, '../db/migrations/001_initial_schema.sql'), 'utf8');
  await db.query(sql);
  console.log('Database migration completed.');
}
main().catch((err) => { console.error('Migration failed:', err.message); process.exitCode = 1; })
  .finally(() => db.pool.end());
