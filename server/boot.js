require('dotenv').config();

const hasPostgresConfig = Boolean(
  process.env.DATABASE_URL ||
  process.env.PGHOST ||
  process.env.PGUSER ||
  process.env.PGPORT ||
  process.env.PGDATABASE
);

if (hasPostgresConfig) {
  require('./index-postgres');
} else {
  require('./index');
}
