import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/internal-shell";
import { useOfficerGuard } from "@/lib/officer-session";
import { MINISTRIES } from "@/lib/ministries";
import { Key, ShieldCheck, Activity, AlertCircle, Lock, Route as RouteIcon, Gauge, FileLock2 } from "lucide-react";

export const Route = createFileRoute("/api-gateway")({ component: ApiGateway });

const CLIENTS = [
  { id: "NIRA-PRD-01", role: "NIRA Officer Console", scopes: ["identity.read", "citizen.read"], rps: 42, quota: "60/min", status: "ok" },
  { id: "URA-PRD-07", role: "URA Compliance Service", scopes: ["tax.read", "identity.read"], rps: 81, quota: "120/min", status: "ok" },
  { id: "MOH-PRD-03", role: "MOH Insurance Adapter", scopes: ["health.insurance.read"], rps: 12, quota: "60/min", status: "ok" },
  { id: "UPF-PRD-02", role: "Police Clearance Service", scopes: ["criminal.read", "identity.read", "immigration.read"], rps: 5, quota: "30/min", status: "ok" },
  { id: "BNK-STB-11", role: "Stanbic KYC Bridge (Sandbox)", scopes: ["identity.read"], rps: 19, quota: "30/min", status: "throttled" },
  { id: "UCC-PRD-05", role: "UCC SIM KYC", scopes: ["identity.read"], rps: 33, quota: "60/min", status: "ok" },
];

function ApiGateway() {
  const __guard = useOfficerGuard();
  if (!__guard.ready) return null;
  return (
    <InternalShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2 flex items-center gap-2"><RouteIcon className="w-3.5 h-3.5" /> Smart API gateway · zero-trust</div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">One front door for every ministry.</h1>
          <p className="mt-2 text-muted-foreground max-w-3xl text-sm">
            Every inter-agency request flows through the NGDXH gateway: OAuth 2.0 client-credentials, scoped JWTs, mTLS, request signing, per-client throttling and anomaly detection.
            No request is trusted on the basis of network location alone.
          </p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            { l: "Requests / sec", v: "2,148", i: Activity, c: "text-foreground" },
            { l: "P95 latency", v: "184ms", i: Gauge, c: "text-success" },
            { l: "4xx (1h)", v: "0.12%", i: AlertCircle, c: "text-warning" },
            { l: "5xx (1h)", v: "0.00%", i: AlertCircle, c: "text-success" },
            { l: "TLS handshakes", v: "100%", i: Lock, c: "text-gold" },
          ].map((k) => (
            <div key={k.l} className="glass rounded-lg p-3">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground"><span>{k.l}</span><k.i className={`w-3 h-3 ${k.c}`} /></div>
              <div className={`text-2xl font-display font-bold mt-1 ${k.c}`}>{k.v}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pipeline */}
          <div className="glass rounded-xl p-5 lg:col-span-2">
            <div className="font-semibold mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> Request pipeline</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { n: "1", t: "Ingress · mTLS", d: "Client certificate validated against ministry CA. Plaintext rejected at the edge." },
                { n: "2", t: "AuthN · OAuth2", d: "Client-credentials grant. JWT validated, signature checked, kid resolved." },
                { n: "3", t: "AuthZ · scopes", d: "RBAC engine evaluates scope vs. requested resource. Deny by default." },
                { n: "4", t: "Throttle", d: "Per-client + per-citizen rate limits. Burst absorbed by token bucket." },
                { n: "5", t: "Validation", d: "Schema enforcement (OpenAPI 3.1). Reject malformed payloads pre-route." },
                { n: "6", t: "Routing", d: "Service mesh selects healthy adapter replica. Circuit breaker on failure." },
                { n: "7", t: "Anomaly · AI", d: "UEBA scoring on request shape, geo, time, frequency. Step-up MFA if anomalous." },
                { n: "8", t: "Audit · seal", d: "Hashed request/response sealed in append-only ledger before reply." },
                { n: "9", t: "Egress · sign", d: "Response signed RS256. Receipt issued with ledger ID." },
              ].map((s) => (
                <div key={s.n} className="border border-border/60 rounded-lg p-3 bg-card/40">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gold/15 text-gold font-mono text-xs flex items-center justify-center font-bold">{s.n}</div>
                    <div className="font-semibold text-sm">{s.t}</div>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{s.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Routes */}
          <div className="glass rounded-xl p-5">
            <div className="font-semibold mb-3 flex items-center gap-2"><RouteIcon className="w-4 h-4 text-gold" /> Active upstream routes</div>
            <div className="space-y-2 max-h-[480px] overflow-auto pr-1">
              {MINISTRIES.flatMap((m) =>
                m.endpoints.map((e) => (
                  <div key={m.id + e.path} className="border border-border/60 rounded-md p-2.5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: m.color + "22", color: m.color }}>{m.code}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${e.method === "GET" ? "bg-success/15 text-success" : "bg-primary/15 text-primary"}`}>{e.method}</span>
                      <span className="text-foreground truncate">{e.path}</span>
                    </div>
                    <div className="text-muted-foreground text-[10px] mt-1 pl-1">{e.name} · v1 · OAS3.1</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Clients */}
          <div className="glass rounded-xl p-5 lg:col-span-3">
            <div className="font-semibold mb-3 flex items-center gap-2"><Key className="w-4 h-4 text-gold" /> Registered API clients</div>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                  <tr className="border-b border-border/60">
                    <th className="text-left font-medium px-3 py-2">Client ID</th>
                    <th className="text-left font-medium px-3 py-2">Owner</th>
                    <th className="text-left font-medium px-3 py-2">Scopes</th>
                    <th className="text-right font-medium px-3 py-2">RPS</th>
                    <th className="text-right font-medium px-3 py-2">Quota</th>
                    <th className="text-right font-medium px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CLIENTS.map((c) => (
                    <tr key={c.id} className="border-b border-border/40">
                      <td className="px-3 py-2 font-mono text-xs">{c.id}</td>
                      <td className="px-3 py-2">{c.role}</td>
                      <td className="px-3 py-2"><div className="flex flex-wrap gap-1">{c.scopes.map((s) => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-accent font-mono">{s}</span>)}</div></td>
                      <td className="px-3 py-2 text-right font-mono">{c.rps}</td>
                      <td className="px-3 py-2 text-right font-mono text-muted-foreground">{c.quota}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${c.status === "ok" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{c.status.toUpperCase()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><FileLock2 className="w-3.5 h-3.5 text-gold" /> All clients certified under NITA-U Information Security Management Standard (ISMS).</div>
          </div>
        </div>
      </div>
    </InternalShell>
  );
}
