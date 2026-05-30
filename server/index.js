const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const crypto = require("crypto");
const Database = require("better-sqlite3");

const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "ngdxh.sqlite");
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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

  CREATE TABLE IF NOT EXISTS sim_tokens (
    token TEXT PRIMARY KEY,
    actor TEXT NOT NULL,
    role TEXT NOT NULL,
    org TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );
`);

const MINISTRIES = [
  { id: "nira", code: "NIRA", name: "NIRA" },
  { id: "ura", code: "URA", name: "URA" },
  { id: "moh", code: "MOH", name: "Health" },
  { id: "lands", code: "MLHUD", name: "Lands" },
  { id: "mowt", code: "MoWT", name: "Works & Transport" },
  { id: "police", code: "UPF", name: "Police / Justice" },
  { id: "moes", code: "MoES", name: "Education" },
  { id: "immig", code: "DCIC", name: "Immigration" },
  { id: "ucc", code: "UCC", name: "UCC" },
];

const PUBLIC_SERVICES = [
  { title: "Verify service status", text: "Let citizens check permits, registrations, and submitted requests from one page.", to: "/verify" },
  { title: "Citizen support", text: "Give people a guided place to ask questions before they visit an office.", to: "/assistant" },
  { title: "Track submissions", text: "Show the status of an application without exposing internal systems.", to: "/citizen" },
  { title: "Book appointments", text: "Reduce queues by letting people request a slot before arriving.", to: "/citizen" },
];

const DEMO_CITIZEN = {
  nin: "CM900112ABCDE",
  name: "Nakato Aisha Mirembe",
  dob: "1990-01-12",
  sex: "Female",
  district: "Kampala Central",
  parish: "Nakasero II",
  village: "Plot 18, Kira Road",
  tribe: "Muganda",
  religion: "Muslim",
  maritalStatus: "Married",
  mother: "Namusoke Joy Mirembe",
  father: "Ssebunya Edward Mirembe",
  spouse: "Kato David Lubega · CM880711XYZ12",
  dependants: 2,
  phone: "+256 772 458 119",
  email: "a.nakato@mirembe.ug",
  photoInitial: "NA",
  riskScore: 12,
  faceMatchConfidence: 98.7,
  records: {
    nira: { status: "Verified", note: "Active citizen · valid until 2031" },
    ura: { status: "Compliant", note: "TIN 1000452918 · No outstanding tax" },
    moh: { status: "Insured", note: "NHIS Active · Mulago National Referral" },
    lands: { status: "Owner", note: "2 parcels · Wakiso, Mukono" },
    mowt: { status: "Valid", note: "DL-CB Class · expires 2028-04-19" },
    police: { status: "Clear", note: "No criminal record on file" },
    moes: { status: "Verified", note: "BSc Computer Science · Makerere 2014" },
    immig: { status: "Valid", note: "Passport B1234567 · expires 2030-09-02" },
    ucc: { status: "Registered", note: "3 SIMs · All KYC verified" },
  },
  vehicles: [
    { plate: "UBJ 482K", make: "Toyota Harrier 2018", color: "Pearl White", status: "Active · Insured" },
    { plate: "UAX 901P", make: "Suzuki Alto 2015", color: "Silver", status: "Active · Insured" },
  ],
  properties: [
    { title: "FRV 4521 / Block 244 Plot 18", location: "Kira, Wakiso", type: "Residential", size: "0.25 ha" },
    { title: "LRV 1187 / Block 88 Plot 4", location: "Mukono Central", type: "Commercial", size: "0.12 ha" },
  ],
  taxHistory: [
    { year: "FY 2024/25", paye: "UGX 4,820,000", vat: "UGX 1,210,000", status: "Filed" },
    { year: "FY 2023/24", paye: "UGX 4,140,000", vat: "UGX 980,000", status: "Filed" },
    { year: "FY 2022/23", paye: "UGX 3,720,000", vat: "UGX 612,000", status: "Filed" },
  ],
  criminal: [],
  education: [
    { award: "BSc Computer Science", institution: "Makerere University", year: "2014" },
    { award: "UACE", institution: "Gayaza High School", year: "2010" },
  ],
  employment: [
    { employer: "Stanbic Bank Uganda", role: "Senior Data Engineer", since: "2019", status: "Active" },
  ],
  health: [
    { facility: "Mulago National Referral", visit: "2025-08-12", note: "Routine check-up", flag: "Restricted · MoH only" },
  ],
  telecom: [
    { msisdn: "+256 772 458 119", network: "MTN", kyc: "Verified", since: "2014" },
    { msisdn: "+256 700 219 884", network: "Airtel", kyc: "Verified", since: "2018" },
    { msisdn: "+256 393 100 552", network: "UCC-FIXED", kyc: "Verified", since: "2021" },
  ],
  travel: [
    { date: "2025-06-12", port: "Entebbe → DXB", carrier: "Emirates EK730", purpose: "Business" },
    { date: "2024-11-03", port: "Entebbe → NBO", carrier: "Kenya Airways KQ413", purpose: "Tourism" },
  ],
};

const DEMO_REQUESTS = [
  { id: "REQ-2026-0001", nin: DEMO_CITIZEN.nin, service: "Driving permit renewal", status: "Verified", dateLabel: "12 May 2026", notes: "Processed by transport desk", createdAt: "2026-05-12T08:15:00.000Z" },
  { id: "REQ-2026-0002", nin: DEMO_CITIZEN.nin, service: "Land title verification", status: "In review", dateLabel: "15 May 2026", notes: "Awaiting lands registrar confirmation", createdAt: "2026-05-15T09:10:00.000Z" },
  { id: "REQ-2026-0003", nin: DEMO_CITIZEN.nin, service: "Tax clearance certificate", status: "Verified", dateLabel: "18 May 2026", notes: "URA clearance issued", createdAt: "2026-05-18T11:22:00.000Z" },
  { id: "REQ-2026-0004", nin: DEMO_CITIZEN.nin, service: "Passport renewal", status: "Pending payment", dateLabel: "19 May 2026", notes: "Citizen action required", createdAt: "2026-05-19T13:05:00.000Z" },
];

const CITIZEN_DEMO_PIN = "771194";

function sendJSON(res, obj, code = 200) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Citizen-Session",
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function seedDatabase() {
  const citizenCount = db.prepare("SELECT COUNT(*) AS count FROM citizens").get().count;
  if (citizenCount === 0) {
    const insertCitizen = db.prepare(`
      INSERT INTO citizens (
        nin, name, dob, sex, district, parish, village, tribe, religion, marital_status,
        mother, father, spouse, dependants, phone, email, photo_initial, risk_score,
        face_match_confidence, records_json, vehicles_json, properties_json, tax_history_json,
        criminal_json, education_json, employment_json, health_json, telecom_json, travel_json, updated_at
      ) VALUES (
        @nin, @name, @dob, @sex, @district, @parish, @village, @tribe, @religion, @maritalStatus,
        @mother, @father, @spouse, @dependants, @phone, @email, @photoInitial, @riskScore,
        @faceMatchConfidence, @records_json, @vehicles_json, @properties_json, @tax_history_json,
        @criminal_json, @education_json, @employment_json, @health_json, @telecom_json, @travel_json, @updated_at
      )
    `);

    insertCitizen.run({
      ...DEMO_CITIZEN,
      records_json: JSON.stringify(DEMO_CITIZEN.records),
      vehicles_json: JSON.stringify(DEMO_CITIZEN.vehicles),
      properties_json: JSON.stringify(DEMO_CITIZEN.properties),
      tax_history_json: JSON.stringify(DEMO_CITIZEN.taxHistory),
      criminal_json: JSON.stringify(DEMO_CITIZEN.criminal),
      education_json: JSON.stringify(DEMO_CITIZEN.education),
      employment_json: JSON.stringify(DEMO_CITIZEN.employment),
      health_json: JSON.stringify(DEMO_CITIZEN.health),
      telecom_json: JSON.stringify(DEMO_CITIZEN.telecom),
      travel_json: JSON.stringify(DEMO_CITIZEN.travel),
      updated_at: new Date().toISOString(),
    });

    const insertRequest = db.prepare(`
      INSERT INTO requests (id, nin, service, status, date_label, notes, created_at)
      VALUES (@id, @nin, @service, @status, @dateLabel, @notes, @createdAt)
    `);

    for (const request of DEMO_REQUESTS) {
      insertRequest.run(request);
    }
  }

  db.prepare(`
    INSERT OR IGNORE INTO citizen_accounts (nin, pin, label, created_at)
    VALUES (?, ?, ?, ?)
  `).run(DEMO_CITIZEN.nin, CITIZEN_DEMO_PIN, "Demo citizen portal account", new Date().toISOString());
}

seedDatabase();

function getCitizenRow(nin) {
  return db.prepare("SELECT * FROM citizens WHERE nin = ?").get(nin.toUpperCase());
}

function mapCitizen(row) {
  if (!row) {
    return null;
  }

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
    records: JSON.parse(row.records_json),
    vehicles: JSON.parse(row.vehicles_json),
    properties: JSON.parse(row.properties_json),
    taxHistory: JSON.parse(row.tax_history_json),
    criminal: JSON.parse(row.criminal_json),
    education: JSON.parse(row.education_json),
    employment: JSON.parse(row.employment_json),
    health: JSON.parse(row.health_json),
    telecom: JSON.parse(row.telecom_json),
    travel: JSON.parse(row.travel_json),
    updatedAt: row.updated_at,
  };
}

function listRequests(nin) {
  const normalizedNin = nin ? nin.toUpperCase() : null;
  const query = normalizedNin
    ? db.prepare("SELECT * FROM requests WHERE nin = ? ORDER BY created_at DESC")
    : db.prepare("SELECT * FROM requests ORDER BY created_at DESC");
  return (normalizedNin ? query.all(normalizedNin) : query.all()).map((row) => ({
    id: row.id,
    nin: row.nin,
    service: row.service,
    status: row.status,
    date: row.date_label,
    notes: row.notes,
    createdAt: row.created_at,
  }));
}

function getHomeSnapshot() {
  const citizenCount = db.prepare("SELECT COUNT(*) AS count FROM citizens").get().count;
  const requestCount = db.prepare("SELECT COUNT(*) AS count FROM requests").get().count;
  const latestRequest = db.prepare("SELECT * FROM requests ORDER BY created_at DESC LIMIT 1").get();

  return {
    stats: [
      { label: "Citizens in showcase", value: String(citizenCount) },
      { label: "Service requests", value: String(requestCount) },
      { label: "Public services", value: String(PUBLIC_SERVICES.length) },
      { label: "Connected ministries", value: String(MINISTRIES.length) },
    ],
    publicServices: PUBLIC_SERVICES,
    featuredCitizen: {
      nin: DEMO_CITIZEN.nin,
      name: DEMO_CITIZEN.name,
      district: DEMO_CITIZEN.district,
      requests: listRequests(DEMO_CITIZEN.nin).length,
    },
    latestRequest: latestRequest
      ? {
          id: latestRequest.id,
          service: latestRequest.service,
          status: latestRequest.status,
          date: latestRequest.date_label,
        }
      : null,
  };
}

function buildVerificationTrace(citizen) {
  const now = new Date();
  return MINISTRIES.map((ministry, index) => ({
    ministry: ministry.name,
    code: ministry.code,
    status: "ok",
    t: new Date(now.getTime() + index * 1000).toLocaleTimeString(),
    note: citizen.records[ministry.id]?.note ?? "Record returned",
  }));
}

function recordAudit(action, entity, detail) {
  const createdAt = new Date().toISOString();
  const result = db.prepare(
    "INSERT INTO audit (action, entity, detail, created_at) VALUES (?, ?, ?, ?)"
  ).run(action, entity, JSON.stringify(detail), createdAt);

  return { id: result.lastInsertRowid, createdAt };
}

function getBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  const citizenToken = req.headers["x-citizen-session"];
  if (typeof citizenToken === "string" && citizenToken.trim()) {
    return citizenToken.trim();
  }

  return null;
}

function createCitizenSession(nin) {
  const token = crypto.randomBytes(24).toString("hex");
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();

  db.prepare(`
    INSERT INTO citizen_sessions (token, nin, created_at, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(token, nin.toUpperCase(), createdAt, expiresAt);

  return { token, createdAt, expiresAt };
}

function getCitizenSession(token) {
  if (!token) {
    return null;
  }

  const session = db.prepare("SELECT * FROM citizen_sessions WHERE token = ?").get(token);
  if (!session) {
    return null;
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    db.prepare("DELETE FROM citizen_sessions WHERE token = ?").run(token);
    return null;
  }

  const citizen = mapCitizen(getCitizenRow(session.nin));
  if (!citizen) {
    return null;
  }

  return { ...session, citizen };
}

function citizenAuthPayload(nin) {
  const citizen = mapCitizen(getCitizenRow(nin));
  if (!citizen) {
    return null;
  }

  return { citizen, requests: listRequests(nin) };
}

function loginCitizen(body) {
  const nin = String(body?.nin ?? "").trim().toUpperCase();
  const pin = String(body?.pin ?? "").trim();

  if (!nin || !pin) {
    return { error: "nin and pin are required", code: 400 };
  }

  const account = db.prepare("SELECT * FROM citizen_accounts WHERE nin = ? AND pin = ?").get(nin, pin);
  if (!account) {
    return { error: "invalid citizen credentials", code: 401 };
  }

  const session = createCitizenSession(nin);
  const payload = citizenAuthPayload(nin);
  recordAudit("citizen.login", nin, { label: account.label, session: session.token.slice(0, 8) });

  return {
    token: session.token,
    expiresAt: session.expiresAt,
    label: account.label,
    ...payload,
  };
}

function getCitizenFromRequest(req) {
  const session = getCitizenSession(getBearerToken(req));
  return session ? { session, payload: citizenAuthPayload(session.nin) } : null;
}

function createRequest(body) {
  const nin = String(body?.nin ?? "").trim().toUpperCase();
  const service = String(body?.service ?? "").trim();
  if (!nin || !service) {
    return { error: "nin and service are required", code: 400 };
  }

  const createdAt = new Date().toISOString();
  const dateLabel = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const id = `REQ-${Date.now()}`;
  const status = "In review";

  db.prepare(`
    INSERT INTO requests (id, nin, service, status, date_label, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, nin, service, status, dateLabel, body?.notes ?? "Submitted from the public portal", createdAt);

  const request = db.prepare("SELECT * FROM requests WHERE id = ?").get(id);
  recordAudit("request.created", nin, request);

  return {
    request: {
      id: request.id,
      nin: request.nin,
      service: request.service,
      status: request.status,
      date: request.date_label,
      notes: request.notes,
      createdAt: request.created_at,
    },
    requests: listRequests(nin),
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Citizen-Session",
    });
    return res.end();
  }

  if (url.pathname === "/" && req.method === "GET") {
    return sendJSON(res, { status: "ngdxh-server", time: Date.now() });
  }

  if (url.pathname === "/api/public/home" && req.method === "GET") {
    return sendJSON(res, getHomeSnapshot());
  }

  if (url.pathname === "/api/public/services" && req.method === "GET") {
    return sendJSON(res, { services: PUBLIC_SERVICES });
  }

  if (url.pathname === "/api/public/requests" && req.method === "GET") {
    return sendJSON(res, { requests: listRequests(url.searchParams.get("nin") ?? undefined) });
  }

  if (url.pathname === "/api/public/requests" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const result = createRequest(body);
      if (result.error) {
        return sendJSON(res, { error: result.error }, result.code);
      }
      return sendJSON(res, result, 201);
    } catch (error) {
      return sendJSON(res, { error: "invalid body" }, 400);
    }
  }

  if (url.pathname === "/api/public/citizen/login" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const result = loginCitizen(body);
      if (result.error) {
        return sendJSON(res, { error: result.error }, result.code);
      }
      return sendJSON(res, result, 200);
    } catch (error) {
      return sendJSON(res, { error: "invalid body" }, 400);
    }
  }

  if (url.pathname === "/api/public/citizen/me" && req.method === "GET") {
    const session = getCitizenFromRequest(req);
    if (!session) {
      return sendJSON(res, { error: "unauthorized" }, 401);
    }

    return sendJSON(res, {
      token: getBearerToken(req),
      expiresAt: session.session.expires_at,
      citizen: session.payload.citizen,
      requests: session.payload.requests,
    });
  }

  if (url.pathname === "/api/public/citizen/logout" && req.method === "POST") {
    const token = getBearerToken(req);
    if (token) {
      db.prepare("DELETE FROM citizen_sessions WHERE token = ?").run(token);
    }

    return sendJSON(res, { ok: true });
  }

  if (url.pathname === "/api/public/citizen/requests" && req.method === "GET") {
    const session = getCitizenFromRequest(req);
    if (!session) {
      return sendJSON(res, { error: "unauthorized" }, 401);
    }

    return sendJSON(res, {
      token: getBearerToken(req),
      expiresAt: session.session.expires_at,
      requests: session.payload.requests,
      citizen: session.payload.citizen,
    });
  }

  if (url.pathname === "/api/public/citizen/requests" && req.method === "POST") {
    const session = getCitizenFromRequest(req);
    if (!session) {
      return sendJSON(res, { error: "unauthorized" }, 401);
    }

    try {
      const body = await parseBody(req);
      const result = createRequest({ ...body, nin: session.payload.citizen.nin });
      if (result.error) {
        return sendJSON(res, { error: result.error }, result.code);
      }
      return sendJSON(res, result, 201);
    } catch (error) {
      return sendJSON(res, { error: "invalid body" }, 400);
    }
  }

  if (url.pathname.startsWith("/api/public/citizens/") && url.pathname.endsWith("/requests") && req.method === "GET") {
    const nin = decodeURIComponent(url.pathname.replace("/api/public/citizens/", "").replace("/requests", ""));
    return sendJSON(res, { requests: listRequests(nin) });
  }

  if (url.pathname.startsWith("/api/public/citizens/") && req.method === "GET") {
    const nin = decodeURIComponent(url.pathname.replace("/api/public/citizens/", ""));
    const citizen = mapCitizen(getCitizenRow(nin));
    if (!citizen) {
      return sendJSON(res, { error: "citizen not found" }, 404);
    }
    return sendJSON(res, { citizen, requests: listRequests(nin) });
  }

  if (url.pathname === "/api/public/verify" && req.method === "GET") {
    const nin = (url.searchParams.get("nin") ?? DEMO_CITIZEN.nin).trim().toUpperCase();
    const citizen = mapCitizen(getCitizenRow(nin));
    if (!citizen) {
      return sendJSON(res, { error: "citizen not found" }, 404);
    }

    const trace = buildVerificationTrace(citizen);
    const auditEntry = recordAudit("verify.citizen", nin, { trace });
    return sendJSON(res, { citizen, trace, auditId: auditEntry.id });
  }

  // Simulated ministry adapter endpoint (represents a live backend)
  if (url.pathname.startsWith("/api/ministry/") && url.pathname.endsWith("/verify") && req.method === "GET") {
    try {
      const parts = url.pathname.split("/");
      const ministryId = parts[3];
      const ministry = MINISTRIES.find((m) => m.id === ministryId || m.code.toLowerCase() === ministryId.toLowerCase());
      if (!ministry) return sendJSON(res, { error: "ministry not found" }, 404);

      const nin = (url.searchParams.get("nin") ?? DEMO_CITIZEN.nin).trim().toUpperCase();
      const citizen = mapCitizen(getCitizenRow(nin));
      if (!citizen) return sendJSON(res, { error: "citizen not found" }, 404);

      // Simulate variable latency for adapters
      const latency = 200 + Math.floor(Math.random() * 600);
      await new Promise((r) => setTimeout(r, latency));

      const result = {
        ministry: ministry.name,
        code: ministry.code,
        status: citizen.records[ministry.id]?.status ?? "Unknown",
        note: citizen.records[ministry.id]?.note ?? "Data returned from simulated adapter",
        latency,
      };

      const audit = recordAudit("adapter.lookup", nin, { ministry: ministry.id, result });
      return sendJSON(res, { result, auditId: audit.id }, 200);
    } catch (err) {
      return sendJSON(res, { error: "adapter error" }, 500);
    }
  }

  // Simulated SSO endpoint for prototype/demo flows
  if (url.pathname === "/api/sim/sso/login" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const actor = String(body?.actor ?? "citizen");
      const role = String(body?.role ?? (actor === "officer" ? "police_officer" : "citizen"));
      const org = String(body?.org ?? "Demo Org");

      const token = crypto.randomBytes(20).toString("hex");
      const createdAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString();

      // persist the simulated token so we can validate it later
      db.prepare(
        `INSERT OR REPLACE INTO sim_tokens (token, actor, role, org, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)`
      ).run(token, actor, role, org, createdAt, expiresAt);

      // Record a lightweight audit for SSO
      recordAudit("sso.login", actor, { role, org, token: token.slice(0, 8) });

      return sendJSON(res, { token, actor, role, org, createdAt, expiresAt });
    } catch (err) {
      return sendJSON(res, { error: "invalid body" }, 400);
    }
  }

  // Validate a simulated SSO token
  if (url.pathname === "/api/sim/sso/validate" && req.method === "GET") {
    const token = getBearerToken(req);
    if (!token) return sendJSON(res, { error: "missing token" }, 401);

    const row = db.prepare("SELECT * FROM sim_tokens WHERE token = ?").get(token);
    if (!row) return sendJSON(res, { error: "invalid token" }, 401);

    if (new Date(row.expires_at).getTime() <= Date.now()) {
      db.prepare("DELETE FROM sim_tokens WHERE token = ?").run(token);
      return sendJSON(res, { error: "token expired" }, 401);
    }

    return sendJSON(res, { token: row.token, actor: row.actor, role: row.role, org: row.org, expiresAt: row.expires_at });
  }

  // Simulated adapters registry
  if (url.pathname === "/api/sim/adapters" && req.method === "GET") {
    return sendJSON(res, { adapters: MINISTRIES.map((m) => ({ id: m.id, code: m.code, name: m.name, status: "online" })) });
  }

  // --- Continuous simulator controller (start/stop/status/logs)
  // In-memory simulator state
  if (!global.simulator) {
    global.simulator = { running: false, intervalId: null, rateMs: 2000, logs: [] };
  }

  if (url.pathname === "/api/sim/runner/start" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const rateMs = Math.max(500, Number(body?.rateMs) || 2000);

      if (global.simulator.running) {
        return sendJSON(res, { ok: true, message: "simulator already running" });
      }

      global.simulator.running = true;
      global.simulator.rateMs = rateMs;
      global.simulator.logs = global.simulator.logs || [];

      global.simulator.intervalId = setInterval(async () => {
        try {
          const nin = DEMO_CITIZEN.nin;
          const ministry = MINISTRIES[Math.floor(Math.random() * MINISTRIES.length)];
          const start = Date.now();
          // call the adapter logic directly to avoid HTTP roundtrip
          const result = {
            ministry: ministry.name,
            code: ministry.code,
            status: DEMO_CITIZEN.records[ministry.id]?.status ?? "Unknown",
            note: DEMO_CITIZEN.records[ministry.id]?.note ?? "Simulated lookup",
            latency: Math.max(50, Math.floor(Math.random() * 800)),
          };
          const audit = recordAudit("sim.runner.adapter", nin, { ministry: ministry.id, result, ts: new Date().toISOString() });
          const entry = { t: new Date().toISOString(), ministry: ministry.id, auditId: audit.id, latency: result.latency };
          global.simulator.logs.unshift(entry);
          if (global.simulator.logs.length > 200) global.simulator.logs.pop();
        } catch (err) {
          // swallow
        }
      }, rateMs);

      recordAudit("sim.runner.start", "system", { rateMs });
      return sendJSON(res, { ok: true, running: true, rateMs });
    } catch (err) {
      return sendJSON(res, { error: "invalid body" }, 400);
    }
  }

  if (url.pathname === "/api/sim/runner/stop" && req.method === "POST") {
    if (!global.simulator.running) return sendJSON(res, { ok: true, message: "not running" });
    clearInterval(global.simulator.intervalId);
    global.simulator.intervalId = null;
    global.simulator.running = false;
    recordAudit("sim.runner.stop", "system", {});
    return sendJSON(res, { ok: true, running: false });
  }

  if (url.pathname === "/api/sim/runner/status" && req.method === "GET") {
    return sendJSON(res, { running: !!global.simulator.running, rateMs: global.simulator.rateMs });
  }

  if (url.pathname === "/api/sim/runner/logs" && req.method === "GET") {
    return sendJSON(res, { logs: global.simulator.logs || [] });
  }

  if (url.pathname === "/audit" && req.method === "GET") {
    return sendJSON(res, db.prepare("SELECT * FROM audit ORDER BY created_at DESC LIMIT 200").all());
  }

  // Return a signed (simulated) audit receipt for an audit id
  if (url.pathname.startsWith("/api/audit/receipt/") && req.method === "GET") {
    try {
      const id = Number(url.pathname.replace("/api/audit/receipt/", ""));
      if (!id) return sendJSON(res, { error: "invalid id" }, 400);

      const row = db.prepare("SELECT * FROM audit WHERE id = ?").get(id);
      if (!row) return sendJSON(res, { error: "not found" }, 404);

      // Simulate a cryptographic receipt by hashing the record and adding a fake signature
      const payload = { id: row.id, action: row.action, entity: row.entity, detail: JSON.parse(row.detail), createdAt: row.created_at };
      const hash = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
      const signature = crypto.createHmac("sha256", "simulated-receipt-key").update(hash).digest("hex");

      return sendJSON(res, { payload, hash, signature });
    } catch (err) {
      return sendJSON(res, { error: "invalid request" }, 400);
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";
server.listen(PORT, HOST, () => console.log(`ngdxh server listening http://${HOST}:${PORT}`));
