import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Lock, Shield, FileText, Key, Eye, ShieldCheck, AlertTriangle, ServerCog } from "lucide-react";

export const Route = createFileRoute("/security")({ component: SecPage });

const PILLARS = [
  { icon: Key, t: "Role-Based Access Control", d: "Every officer is bound to a role with explicit scopes. A Health officer cannot read criminal records. A Police officer cannot read medical history. Enforced at the API gateway." },
  { icon: Lock, t: "End-to-end encryption", d: "Mutual TLS between every ministry and the hub. Payloads signed with RS256. Ministry-issued client certificates rotated quarterly." },
  { icon: FileText, t: "Immutable audit trail", d: "Every request, every response, every consent — hashed and sealed in an append-only ledger. Independently auditable by the Auditor General." },
  { icon: ShieldCheck, t: "API security", d: "OAuth 2.0 client-credentials, scoped JWTs, request signing, rate-limiting, anomaly detection and replay-attack protection." },
  { icon: Eye, t: "Data governance", d: "Ministries remain sovereign owners of their data. NGDXH brokers consent-based exchange and stores no citizen records at the hub." },
  { icon: ServerCog, t: "Operational resilience", d: "Active-active deployment, 99.98% SLA, regional failover, encrypted backups and 24/7 SOC monitoring." },
];

function SecPage() {
  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Security &amp; governance</div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Trust is the platform.</h1>
          <p className="mt-3 text-muted-foreground">NGDXH is built on layered defences and the principle of least privilege. Aligned with the Uganda Data Protection &amp; Privacy Act 2019.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((p) => (
            <div key={p.t} className="glass rounded-xl p-5">
              <div className="w-10 h-10 rounded-md bg-gold/15 text-gold flex items-center justify-center mb-4"><p.icon className="w-5 h-5" /></div>
              <div className="font-semibold mb-2">{p.t}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{p.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <div className="text-xs uppercase tracking-wider text-gold mb-3">Sample RBAC policy</div>
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
            <div className="text-xs uppercase tracking-wider text-gold mb-3">Recent anomalies (24h)</div>
            <ul className="divide-y divide-border/60">
              {[
                { s: "info", t: "12:01", m: "Cert rotation completed for MoH adapter" },
                { s: "warn", t: "10:48", m: "URA rate-limit reached for client OFC-22-991 · throttled" },
                { s: "ok",   t: "09:22", m: "Quarterly audit dispatched to Auditor General" },
                { s: "warn", t: "07:14", m: "Unusual access pattern detected → MFA challenge issued" },
              ].map((e, i) => (
                <li key={i} className="py-2.5 flex items-center gap-3 text-sm">
                  {e.s === "warn" ? <AlertTriangle className="w-4 h-4 text-warning" /> : <Shield className="w-4 h-4 text-success" />}
                  <span className="font-mono text-xs text-muted-foreground">{e.t}</span>
                  <span>{e.m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
