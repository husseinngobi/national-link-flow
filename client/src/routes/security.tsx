import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { useState } from "react";
import {
  Lock,
  Shield,
  FileText,
  Key,
  Eye,
  ShieldCheck,
  AlertTriangle,
  ServerCog,
  Fingerprint,
  FileCheck2,
  RotateCw,
} from "lucide-react";

export const Route = createFileRoute("/security")({ component: SecPage });

const PILLARS = [
  {
    icon: Key,
    t: "Role-Based Access Control",
    d: "Every officer is bound to a role with explicit scopes. A Health officer cannot read criminal records. A Police officer cannot read medical history. Enforced at the API gateway.",
  },
  {
    icon: Lock,
    t: "End-to-end encryption",
    d: "Mutual TLS between every ministry and the hub. Payloads signed with RS256. Ministry-issued client certificates rotated quarterly.",
  },
  {
    icon: FileText,
    t: "Immutable audit trail",
    d: "Every request, every response, every consent - hashed and sealed in an append-only ledger. Independently auditable by the Auditor General.",
  },
  {
    icon: ShieldCheck,
    t: "API security",
    d: "OAuth 2.0 client-credentials, scoped JWTs, request signing, rate-limiting, anomaly detection and replay-attack protection.",
  },
  {
    icon: Eye,
    t: "Data governance",
    d: "Ministries remain sovereign owners of their data. NGDXH brokers consent-based exchange and stores no citizen records at the hub.",
  },
  {
    icon: ServerCog,
    t: "Operational resilience",
    d: "Active-active deployment, 99.98% SLA, regional failover, encrypted backups and 24/7 SOC monitoring.",
  },
];

const CONTROLS = [
  {
    title: "Identity and access",
    text: "Role-based access, scoped permissions, signed tokens, and separate surfaces for citizens, companies, and officers.",
    icon: Fingerprint,
  },
  {
    title: "Transport security",
    text: "Encrypted connections, certificate-based trust, and service-to-service verification for ministry adapters.",
    icon: Lock,
  },
  {
    title: "Audit and evidence",
    text: "Every request should leave a receipt: who asked, which policy allowed it, what data was returned, and when.",
    icon: FileCheck2,
  },
  {
    title: "Operational protection",
    text: "Rate limits, alerts, tamper-resistant logs, and incident visibility to stop abuse from becoming a breach.",
    icon: AlertTriangle,
  },
];

const RISKS = [
  "A public surface that leaks internal records or staff-only actions.",
  "A shared backend that accepts requests without knowing the caller's role.",
  "A ministry integration that returns too much data because the schema is not enforced.",
  "An audit trail that cannot prove who accessed a record or why.",
];

const CERTS = [
  {
    owner: "NGDXH Gateway",
    purpose: "OIDC signing",
    serial: "GW-2026-0041",
    expires: "2027-01-15",
    status: "Active",
  },
  {
    owner: "NIRA Adapter",
    purpose: "mTLS client cert",
    serial: "NIRA-2026-1187",
    expires: "2026-12-01",
    status: "Rotates quarterly",
  },
  {
    owner: "Audit Ledger",
    purpose: "Receipt signing",
    serial: "AUD-2026-7782",
    expires: "2027-06-30",
    status: "HSM-backed",
  },
];

function SecPage() {
  const [certs, setCerts] = useState(CERTS);

  function rotateCert(owner: string) {
    setCerts((current) =>
      current.map((cert) =>
        cert.owner === owner
          ? {
              ...cert,
              serial: `${cert.serial.split("-")[0]}-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
              expires: "2027-12-31",
              status: "Rotated today",
            }
          : cert,
      ),
    );
  }

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
            Security &amp; governance
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Trust is the platform.</h1>
          <p className="mt-3 text-muted-foreground">
            NGDXH is built on layered defences and the principle of least privilege. Aligned with
            the Uganda Data Protection &amp; Privacy Act 2019.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {CONTROLS.map((control) => (
            <div key={control.title} className="glass rounded-xl p-5">
              <div className="w-10 h-10 rounded-md bg-gold/15 text-gold flex items-center justify-center mb-4">
                <control.icon className="w-5 h-5" />
              </div>
              <div className="font-semibold mb-2">{control.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{control.text}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-gold mb-1">
                Certificate room
              </div>
              <div className="font-semibold">Keys, certs, and rotation schedule</div>
            </div>
            <div className="text-xs text-muted-foreground">
              Mock HSM · quarterly rotation · revocation ready
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-3">
            {certs.map((cert) => (
              <div key={cert.owner} className="rounded-lg border border-border/60 bg-card/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{cert.owner}</div>
                    <div className="text-xs text-muted-foreground">{cert.purpose}</div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gold/15 text-gold">
                    {cert.status}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground font-mono">
                  <div>Serial: {cert.serial}</div>
                  <div>Expires: {cert.expires}</div>
                </div>
                <button
                  type="button"
                  onClick={() => rotateCert(cert.owner)}
                  className="mt-4 inline-flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 text-xs hover:bg-accent transition"
                >
                  <RotateCw className="h-3.5 w-3.5" /> Rotate cert
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((p) => (
            <div key={p.t} className="glass rounded-xl p-5">
              <div className="w-10 h-10 rounded-md bg-gold/15 text-gold flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5" />
              </div>
              <div className="font-semibold mb-2">{p.t}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{p.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <div className="text-xs uppercase tracking-wider text-gold mb-3">
              Sample RBAC policy
            </div>
            <pre className="font-mono text-xs mono-surface rounded p-4 border border-border/60 overflow-auto">
              {`{
  "role": "police_officer",
  "grants": [
    "identity.read",
    "criminal.clearance.read",
    "immigration.passport.read"
  ],
  "denies": [
    "health.records.read",
    "tax.compliance.read"
  ],
  "rate_limit": "60/min",
  "audit": "required"
}`}
            </pre>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="text-xs uppercase tracking-wider text-gold mb-3">
              Recent anomalies (24h)
            </div>
            <ul className="divide-y divide-border/60">
              {[
                { s: "info", t: "12:01", m: "Cert rotation completed for MoH adapter" },
                {
                  s: "warn",
                  t: "10:48",
                  m: "URA rate-limit reached for client OFC-22-991 - throttled",
                },
                { s: "ok", t: "09:22", m: "Quarterly audit dispatched to Auditor General" },
                {
                  s: "warn",
                  t: "07:14",
                  m: "Unusual access pattern detected -> MFA challenge issued",
                },
              ].map((e, i) => (
                <li key={i} className="py-2.5 flex items-center gap-3 text-sm">
                  {e.s === "warn" ? (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  ) : (
                    <Shield className="w-4 h-4 text-success" />
                  )}
                  <span className="font-mono text-xs text-muted-foreground">{e.t}</span>
                  <span>{e.m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-gold" />
              Risks this design addresses
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              {RISKS.map((risk) => (
                <div key={risk} className="rounded-lg border border-border/60 bg-card/40 p-3">
                  {risk}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-border/60 bg-gold/5 p-4">
              <div className="flex items-center gap-2 font-medium mb-2">
                <Key className="w-4 h-4 text-gold" />
                Demo policy boundary
              </div>
              <p className="text-sm text-muted-foreground">
                Officer, company, and citizen roles are intentionally separated in the UI. Sensitive
                surfaces stay hidden until the right role signs in. That keeps the prototype aligned
                with the intended security model instead of leaking internal views to the public.
              </p>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ServerCog className="w-5 h-5 text-gold" />
              Production-grade targets
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground leading-relaxed">
              <div className="rounded-lg border border-border/60 bg-card/40 p-4">
                Enforce the same policy checks on the backend that the UI implies, so a hidden
                button is never the only protection.
              </div>
              <div className="rounded-lg border border-border/60 bg-card/40 p-4">
                Store session state, receipts, and ministry decisions server-side with explicit
                expiry and revocation rules.
              </div>
              <div className="rounded-lg border border-border/60 bg-card/40 p-4">
                Add structured security logging for login, verification, denied requests, and
                privileged actions.
              </div>
              <div className="rounded-lg border border-border/60 bg-card/40 p-4">
                Make ministry adapters validate schemas and reject overbroad responses before data
                reaches the public UI.
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
