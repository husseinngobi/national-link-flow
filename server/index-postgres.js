require('dotenv').config();
const http = require('http');
const { URL } = require('url');
const crypto = require('crypto');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION;

if (!connectionString) {
  console.error('Postgres configuration missing. Set DATABASE_URL or PG_CONNECTION in server/.env.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function query(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

const MINISTRIES = [
  { id: 'nira', code: 'NIRA', name: 'NIRA' },
  { id: 'ura', code: 'URA', name: 'URA' },
  { id: 'moh', code: 'MOH', name: 'Health' },
  { id: 'lands', code: 'MLHUD', name: 'Lands' },
  { id: 'mowt', code: 'MoWT', name: 'Works & Transport' },
  { id: 'police', code: 'UPF', name: 'Police / Justice' },
  { id: 'moes', code: 'MoES', name: 'Education' },
  { id: 'immig', code: 'DCIC', name: 'Immigration' },
  { id: 'ucc', code: 'UCC', name: 'UCC' },
];

const PUBLIC_SERVICES = [
  { title: 'Verify service status', text: 'Let citizens check permits, registrations, and submitted requests from one page.', to: '/verify' },
  { title: 'Citizen support', text: 'Give people a guided place to ask questions before they visit an office.', to: '/assistant' },
  { title: 'Track submissions', text: 'Show the status of an application without exposing internal systems.', to: '/citizen' },
  { title: 'Book appointments', text: 'Reduce queues by letting people request a slot before arriving.', to: '/citizen' },
];

function sendJSON(res, obj, code = 200) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Citizen-Session',
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

async function mapCitizenRow(row) {
  if (!row) return null;
  return {
    nin: row.nin,
    name: row.name,
    dob: row.dob,
    sex: row.sex,
    district: row.district,
    parish: row.parish,
    village: row.village,
    tribe: row.tribe,
    religion: row.religion,
    maritalStatus: row.marital_status,
    mother: row.mother,
    father: row.father,
    spouse: row.spouse,
    dependants: row.dependants,
    phone: row.phone,
    email: row.email,
    photoInitial: row.photo_initial,
    riskScore: row.risk_score,
    faceMatchConfidence: row.face_match_confidence,
    records: JSON.parse(row.records_json || '{}'),
    vehicles: JSON.parse(row.vehicles_json || '[]'),
    properties: JSON.parse(row.properties_json || '[]'),
    taxHistory: JSON.parse(row.tax_history_json || '[]'),
    criminal: JSON.parse(row.criminal_json || '[]'),
    education: JSON.parse(row.education_json || '[]'),
    employment: JSON.parse(row.employment_json || '[]'),
    health: JSON.parse(row.health_json || '[]'),
    telecom: JSON.parse(row.telecom_json || '[]'),
    travel: JSON.parse(row.travel_json || '[]'),
    updatedAt: row.updated_at,
  };
}

async function getCitizenRow(nin) {
  const res = await query('SELECT * FROM citizens WHERE nin = $1', [nin.toUpperCase()]);
  return res.rows[0];
}

async function listRequests(nin) {
  if (nin) {
    const res = await query('SELECT * FROM requests WHERE nin = $1 ORDER BY created_at DESC', [nin.toUpperCase()]);
    return res.rows.map((row) => ({ id: row.id, nin: row.nin, service: row.service, status: row.status, date: row.date_label, notes: row.notes, createdAt: row.created_at }));
  }
  const res = await query('SELECT * FROM requests ORDER BY created_at DESC', []);
  return res.rows.map((row) => ({ id: row.id, nin: row.nin, service: row.service, status: row.status, date: row.date_label, notes: row.notes, createdAt: row.created_at }));
}

async function getHomeSnapshot() {
  const citizenCount = await query('SELECT COUNT(*)::int as count FROM citizens');
  const requestCount = await query('SELECT COUNT(*)::int as count FROM requests');
  const latest = await query('SELECT * FROM requests ORDER BY created_at DESC LIMIT 1');
  const latestRequest = latest.rows[0] || null;
  return {
    stats: [
      { label: 'Citizens in showcase', value: String(citizenCount.rows[0].count) },
      { label: 'Service requests', value: String(requestCount.rows[0].count) },
      { label: 'Public services', value: String(PUBLIC_SERVICES.length) },
      { label: 'Connected ministries', value: String(MINISTRIES.length) },
    ],
    publicServices: PUBLIC_SERVICES,
    featuredCitizen: {
      nin: 'CM900112ABCDE',
      name: 'Nakato Aisha Mirembe',
      district: 'Kampala Central',
      requests: (await listRequests('CM900112ABCDE')).length,
    },
    latestRequest: latestRequest
      ? { id: latestRequest.id, service: latestRequest.service, status: latestRequest.status, date: latestRequest.date_label }
      : null,
  };
}

function buildVerificationTrace(citizen) {
  const now = new Date();
  return MINISTRIES.map((ministry, index) => ({ ministry: ministry.name, code: ministry.code, status: 'ok', t: new Date(now.getTime() + index * 1000).toLocaleTimeString(), note: citizen.records[ministry.id]?.note ?? 'Record returned' }));
}

async function recordAudit(action, entity, detail) {
  const createdAt = new Date().toISOString();
  const res = await query('INSERT INTO audit (action, entity, detail, created_at) VALUES ($1, $2, $3, $4) RETURNING id', [action, entity, JSON.stringify(detail), createdAt]);
  return { id: res.rows[0].id, createdAt };
}

function getBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.slice(7).trim();
  const citizenToken = req.headers['x-citizen-session'];
  if (typeof citizenToken === 'string' && citizenToken.trim()) return citizenToken.trim();
  return null;
}

async function createCitizenSession(nin) {
  const token = crypto.randomBytes(24).toString('hex');
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();
  await query('INSERT INTO citizen_sessions (token, nin, created_at, expires_at) VALUES ($1, $2, $3, $4)', [token, nin.toUpperCase(), createdAt, expiresAt]);
  return { token, createdAt, expiresAt };
}

async function getCitizenSession(token) {
  if (!token) return null;
  const res = await query('SELECT * FROM citizen_sessions WHERE token = $1', [token]);
  const session = res.rows[0];
  if (!session) return null;
  if (new Date(session.expires_at).getTime() <= Date.now()) {
    await query('DELETE FROM citizen_sessions WHERE token = $1', [token]);
    return null;
  }
  const citizenRow = await getCitizenRow(session.nin);
  const citizen = citizenRow ? await mapCitizenRow(citizenRow) : null;
  if (!citizen) return null;
  return { ...session, citizen };
}

async function citizenAuthPayload(nin) {
  const row = await getCitizenRow(nin);
  const citizen = row ? await mapCitizenRow(row) : null;
  if (!citizen) return null;
  return { citizen, requests: await listRequests(nin) };
}

async function loginCitizen(body) {
  const nin = String(body?.nin ?? '').trim().toUpperCase();
  const pin = String(body?.pin ?? '').trim();
  if (!nin || !pin) return { error: 'nin and pin are required', code: 400 };
  const res = await query('SELECT * FROM citizen_accounts WHERE nin = $1 AND pin = $2', [nin, pin]);
  const account = res.rows[0];
  if (!account) return { error: 'invalid citizen credentials', code: 401 };
  const session = await createCitizenSession(nin);
  const payload = await citizenAuthPayload(nin);
  await recordAudit('citizen.login', nin, { label: account.label, session: session.token.slice(0, 8) });
  return { token: session.token, expiresAt: session.expiresAt, label: account.label, ...payload };
}

async function createRequest(body) {
  const nin = String(body?.nin ?? '').trim().toUpperCase();
  const service = String(body?.service ?? '').trim();
  if (!nin || !service) return { error: 'nin and service are required', code: 400 };
  const createdAt = new Date().toISOString();
  const dateLabel = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const id = `REQ-${Date.now()}`;
  const status = 'In review';
  await query('INSERT INTO requests (id, nin, service, status, date_label, notes, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)', [id, nin, service, status, dateLabel, body?.notes ?? 'Submitted from the public portal', createdAt]);
  const res = await query('SELECT * FROM requests WHERE id = $1', [id]);
  const request = res.rows[0];
  await recordAudit('request.created', nin, request);
  return { request: { id: request.id, nin: request.nin, service: request.service, status: request.status, date: request.date_label, notes: request.notes, createdAt: request.created_at }, requests: await listRequests(nin) };
}

async function getCitizenFromRequest(req) {
  const session = await getCitizenSession(getBearerToken(req));
  return session ? { session, payload: await citizenAuthPayload(session.nin) } : null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Citizen-Session' });
    return res.end();
  }

  if (url.pathname === '/' && req.method === 'GET') return sendJSON(res, { status: 'ngdxh-server-pg', time: Date.now() });
  if (url.pathname === '/api/public/home' && req.method === 'GET') return sendJSON(res, await getHomeSnapshot());
  if (url.pathname === '/api/public/services' && req.method === 'GET') return sendJSON(res, { services: PUBLIC_SERVICES });
  if (url.pathname === '/api/public/requests' && req.method === 'GET') return sendJSON(res, { requests: await listRequests(url.searchParams.get('nin') ?? undefined) });

  if (url.pathname === '/api/public/requests' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const result = await createRequest(body);
      if (result.error) return sendJSON(res, { error: result.error }, result.code);
      return sendJSON(res, result, 201);
    } catch (error) {
      return sendJSON(res, { error: 'invalid body' }, 400);
    }
  }

  if (url.pathname === '/api/public/citizen/login' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const result = await loginCitizen(body);
      if (result.error) return sendJSON(res, { error: result.error }, result.code);
      return sendJSON(res, result, 200);
    } catch (error) {
      return sendJSON(res, { error: 'invalid body' }, 400);
    }
  }

  if (url.pathname === '/api/public/citizen/me' && req.method === 'GET') {
    const session = await getCitizenFromRequest(req);
    if (!session) return sendJSON(res, { error: 'unauthorized' }, 401);
    return sendJSON(res, { token: getBearerToken(req), expiresAt: session.session.expires_at, citizen: session.payload.citizen, requests: session.payload.requests });
  }

  if (url.pathname === '/api/public/citizen/logout' && req.method === 'POST') {
    const token = getBearerToken(req);
    if (token) await query('DELETE FROM citizen_sessions WHERE token = $1', [token]);
    return sendJSON(res, { ok: true });
  }

  if (url.pathname === '/api/public/citizen/requests' && req.method === 'GET') {
    const session = await getCitizenFromRequest(req);
    if (!session) return sendJSON(res, { error: 'unauthorized' }, 401);
    return sendJSON(res, { token: getBearerToken(req), expiresAt: session.session.expires_at, requests: session.payload.requests, citizen: session.payload.citizen });
  }

  if (url.pathname === '/api/public/citizen/requests' && req.method === 'POST') {
    const session = await getCitizenFromRequest(req);
    if (!session) return sendJSON(res, { error: 'unauthorized' }, 401);
    try {
      const body = await parseBody(req);
      const result = await createRequest({ ...body, nin: session.payload.citizen.nin });
      if (result.error) return sendJSON(res, { error: result.error }, result.code);
      return sendJSON(res, result, 201);
    } catch (error) {
      return sendJSON(res, { error: 'invalid body' }, 400);
    }
  }

  if (url.pathname.startsWith('/api/public/citizens/') && url.pathname.endsWith('/requests') && req.method === 'GET') {
    const nin = decodeURIComponent(url.pathname.replace('/api/public/citizens/', '').replace('/requests', ''));
    return sendJSON(res, { requests: await listRequests(nin) });
  }

  if (url.pathname.startsWith('/api/public/citizens/') && req.method === 'GET') {
    const nin = decodeURIComponent(url.pathname.replace('/api/public/citizens/', ''));
    const row = await getCitizenRow(nin);
    const citizen = row ? await mapCitizenRow(row) : null;
    if (!citizen) return sendJSON(res, { error: 'citizen not found' }, 404);
    return sendJSON(res, { citizen, requests: await listRequests(nin) });
  }

  if (url.pathname === '/api/public/verify' && req.method === 'GET') {
    const nin = (url.searchParams.get('nin') ?? 'CM900112ABCDE').trim().toUpperCase();
    const row = await getCitizenRow(nin);
    const citizen = row ? await mapCitizenRow(row) : null;
    if (!citizen) return sendJSON(res, { error: 'citizen not found' }, 404);
    const trace = buildVerificationTrace(citizen);
    const auditEntry = await recordAudit('verify.citizen', nin, { trace });
    return sendJSON(res, { citizen, trace, auditId: auditEntry.id });
  }

  if (url.pathname === '/audit' && req.method === 'GET') {
    const resq = await query('SELECT * FROM audit ORDER BY created_at DESC LIMIT 200', []);
    return sendJSON(res, resq.rows);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`ngdxh Postgres server listening http://localhost:${PORT}`));
