require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');
const sqlFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.PG_CONNECTION });

async function run() {
  if (!pool) {
    console.error('No Postgres configuration found. Set DATABASE_URL or PG_CONNECTION.');
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    for (const file of sqlFiles) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log('--- running', file);
      await client.query(sql);
    }
    console.log('migrations applied');
  } catch (err) {
    console.error('migration failed', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
