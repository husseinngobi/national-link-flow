const DEFAULT_API_BASE_URL = "https://ngdxh-backend.onrender.com";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error ?? `Request failed with ${response.status}`);
  }

  return payload as T;
}

export type PublicService = {
  title: string;
  text: string;
  to: string;
};

export type HomeSnapshot = {
  stats: { label: string; value: string }[];
  publicServices: PublicService[];
  featuredCitizen: {
    nin: string;
    name: string;
    district: string;
    requests: number;
  };
  latestRequest: {
    id: string;
    service: string;
    status: string;
    date: string;
  } | null;
};

export type RequestRecord = {
  id: string;
  nin: string;
  service: string;
  status: string;
  date: string;
  notes?: string | null;
  createdAt: string;
};

export type CitizenRecord = {
  nin: string;
  name: string;
  dob: string;
  sex: string;
  district: string;
  parish: string;
  village: string;
  tribe: string;
  religion: string;
  maritalStatus: string;
  mother: string;
  father: string;
  spouse: string;
  dependants: number;
  phone: string;
  email: string;
  photoInitial: string;
  riskScore: number;
  faceMatchConfidence: number;
  records: Record<string, { status: string; note: string }>;
  vehicles: { plate: string; make: string; color: string; status: string }[];
  properties: { title: string; location: string; type: string; size: string }[];
  taxHistory: { year: string; paye: string; vat: string; status: string }[];
  criminal: { caseNo: string; offence: string; status: string; date: string }[];
  education: { award: string; institution: string; year: string }[];
  employment: { employer: string; role: string; since: string; status: string }[];
  health: { facility: string; visit: string; note: string; flag: string }[];
  telecom: { msisdn: string; network: string; kyc: string; since: string }[];
  travel: { date: string; port: string; carrier: string; purpose: string }[];
  updatedAt: string;
};

export type VerificationTrace = {
  ministry: string;
  code: string;
  status: "ok" | "pending";
  t: string;
  note?: string;
};

export type VerifyResponse = {
  citizen: CitizenRecord;
  trace: VerificationTrace[];
  auditId: number;
};

export type CitizenRequestsResponse = {
  requests: RequestRecord[];
};

export type RequestCreateResponse = {
  request: RequestRecord;
  requests: RequestRecord[];
};

export type CitizenSessionResponse = {
  token: string;
  expiresAt: string;
  label?: string;
  citizen: CitizenRecord;
  requests: RequestRecord[];
};

export async function getHomeSnapshot() {
  return apiFetch<HomeSnapshot>("/api/public/home");
}

export async function verifyCitizen(nin: string) {
  return apiFetch<VerifyResponse>(`/api/public/verify?nin=${encodeURIComponent(nin)}`);
}

// Adapter used by the Verify page — returns a compact `results` map keyed by ministry id
import { MINISTRIES } from "./ministries";

export async function postVerify(nin: string) {
  const resp = await verifyCitizen(nin);

  const codeToId: Record<string, string> = {};
  for (const m of MINISTRIES) codeToId[m.code.toLowerCase()] = m.id;

  const results: Record<string, boolean> = {};
  for (const t of resp.trace || []) {
    const key = (t.code ?? "").toLowerCase();
    const id = codeToId[key] ?? key;
    results[id] = true;
  }

  return { results, tx: String(resp.auditId ?? Date.now()) };
}

export async function listCitizenRequests(nin: string) {
  return apiFetch<CitizenRequestsResponse>(
    `/api/public/citizens/${encodeURIComponent(nin)}/requests`,
  );
}

export async function createCitizenRequest(payload: {
  nin: string;
  service: string;
  notes?: string;
}) {
  return apiFetch<RequestCreateResponse>("/api/public/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginCitizen(payload: { nin: string; pin: string }) {
  return apiFetch<CitizenSessionResponse>("/api/public/citizen/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCitizenSession(token: string) {
  return apiFetch<CitizenSessionResponse>("/api/public/citizen/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function logoutCitizen(token: string) {
  return apiFetch<{ ok: boolean }>("/api/public/citizen/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function listCitizenPortalRequests(token: string) {
  return apiFetch<CitizenSessionResponse>("/api/public/citizen/requests", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createCitizenPortalRequest(
  token: string,
  payload: { service: string; notes?: string },
) {
  return apiFetch<RequestCreateResponse>("/api/public/citizen/requests", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
