require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function main() {
  const directory = path.join(__dirname, '../db/migrations');
  const migrations = fs.readdirSync(directory)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of migrations) {
    const sql = fs.readFileSync(path.join(directory, file), 'utf8');
    await db.query(sql);
    console.log(`Migration completed: ${file}`);
  }
}

main()
  .catch((err) => {
    console.error('Migration failed:', err.code || 'DATABASE_ERROR');
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());
