require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, '../db/seeds/001_demo_data.sql'), 'utf8');
  await db.query(sql);
  console.log('Fictional demo data seeded.');
}
main().catch((err) => { console.error('Seeding failed:', err.message); process.exitCode = 1; })
  .finally(() => db.pool.end());
