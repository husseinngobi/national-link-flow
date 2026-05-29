-- Create schema for Postgres
BEGIN;

CREATE TABLE IF NOT EXISTS citizens (
  nin TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dob TEXT NOT NULL,
  sex TEXT NOT NULL,
  district TEXT NOT NULL,
  parish TEXT NOT NULL,
  village TEXT NOT NULL,
  tribe TEXT NOT NULL,
  religion TEXT NOT NULL,
  marital_status TEXT NOT NULL,
  mother TEXT NOT NULL,
  father TEXT NOT NULL,
  spouse TEXT NOT NULL,
  dependants INTEGER NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  photo_initial TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  face_match_confidence REAL NOT NULL,
  records_json TEXT NOT NULL,
  vehicles_json TEXT NOT NULL,
  properties_json TEXT NOT NULL,
  tax_history_json TEXT NOT NULL,
  criminal_json TEXT NOT NULL,
  education_json TEXT NOT NULL,
  employment_json TEXT NOT NULL,
  health_json TEXT NOT NULL,
  telecom_json TEXT NOT NULL,
  travel_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  nin TEXT NOT NULL,
  service TEXT NOT NULL,
  status TEXT NOT NULL,
  date_label TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  detail TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS citizen_accounts (
  nin TEXT PRIMARY KEY,
  pin TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS citizen_sessions (
  token TEXT PRIMARY KEY,
  nin TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

COMMIT;
