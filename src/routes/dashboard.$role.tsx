import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { ROLES, MINISTRIES } from "@/lib/ministries";
import { CheckCircle2, XCircle, FileText, Clock, Search } from "lucide-react";

export const Route = createFileRoute("/dashboard/$role")({ component: Dashboard });

const FEED = [
  { t: "12:42:08", m: "NIRA", a: "Identity verification request received" },
  { t: "12:42:09", m: "HUB", a: "RBAC check passed · scope:identity.read" },
  { t: "12:42:10", m: "URA", a: "Tax compliance verified · TIN match" },
  { t: "12:42:11", m: "LANDS", a: "Ownership record validated · 2 parcels" },
  { t: "12:42:12", m: "AUDIT", a: "Transaction TX-CB1A92F8 securely logged" },
];

function Dashboard() {
  const { role } = useParams({ from: "/dashboard/$role" });
  const r = ROLES.find((x) => x.id === role) ?? ROLES[0];
  const granted = MINISTRIES.filter((m) => r.grants.includes(m.id));
  const denied = MINISTRIES.filter((m) => r.denies.includes(m.id));

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-1">Authenticated session</div>
            <h1 className="text-2xl font-display font-bold">{r.title} · Dashboard</h1>
            <div className="text-sm text-muted-foreground">Officer ID OFC-2026-0118 · Session expires in 14:52</div>
          </div>
          <div className="flex gap-2">
            <Link to="/verify" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">
              <Search className="w-4 h-4" /> Verify citizen
            </Link>
          </div>
        </div>

        {/* KPI */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { l: "Requests today", v: "248" },
            { l: "Avg latency", v: "318ms" },
            { l: "Authorized scopes", v: r.grants.length.toString() },
            { l: "Audit events", v: "1,402" },
          ].map((k) => (
            <div key={k.l} className="glass rounded-lg p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</div>
              <div className="text-2xl font-display font-bold mt-1">{k.v}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Permissions */}
          <div className="glass rounded-xl p-5">
            <div className="font-semibold mb-3">Role-based access</div>
            <div className="text-xs uppercase tracking-wider text-success mb-2">Authorized</div>
            <ul className="space-y-1.5 mb-4">
              {granted.map((m) => (
                <li key={m.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="font-mono text-xs text-muted-foreground w-14">{m.code}</span>
                  {m.name}
                </li>
              ))}
            </ul>
            <div className="text-xs uppercase tracking-wider text-destructive mb-2">Restricted</div>
            <ul className="space-y-1.5">
              {denied.length === 0 && <li className="text-xs text-muted-foreground italic">No restrictions (administrator)</li>}
              {denied.map((m) => (
                <li key={m.id} className="flex items-center gap-2 text-sm opacity-70">
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span className="font-mono text-xs text-muted-foreground w-14">{m.code}</span>
                  {m.name}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
              Example: Health officers cannot read criminal records. Police cannot read medical history. Enforced at the gateway.
            </div>
          </div>

          {/* Pending verification queue */}
          <div className="glass rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Verification requests</div>
              <span className="text-xs text-muted-foreground">Last 24h</span>
            </div>
            <div className="overflow-hidden rounded border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-accent/50 text-xs text-muted-foreground uppercase">
                  <tr><th className="text-left p-2.5">Request</th><th className="text-left p-2.5">Citizen</th><th className="text-left p-2.5">Scope</th><th className="text-left p-2.5">Status</th></tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {[
                    ["TX-9182AC", "CM9001…BCDE", "identity.read", "Verified"],
                    ["TX-9182AD", "CM8704…F2A1", "tax.compliance", "Verified"],
                    ["TX-9182AE", "CM9512…77E0", "lands.owner", "Pending"],
                    ["TX-9182AF", "CM8809…AA13", "education.cert", "Verified"],
                    ["TX-9182B0", "CM7711…0DA2", "criminal.clearance", "Restricted"],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-border/60">
                      <td className="p-2.5">{row[0]}</td>
                      <td className="p-2.5">{row[1]}</td>
                      <td className="p-2.5">{row[2]}</td>
                      <td className="p-2.5"><StatusPill s={row[3]} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit log */}
          <div className="glass rounded-xl p-5 lg:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gold" />
              <div className="font-semibold">Live audit trail</div>
              <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> tail -f</span>
            </div>
            <div className="font-mono text-xs space-y-1 mono-surface rounded p-3 border border-border/60">
              {FEED.map((f, i) => (
                <div key={i}><span className="text-muted-foreground">{f.t}</span> <span className="text-gold">[{f.m}]</span> {f.a}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    Verified: "bg-success/15 text-success border-success/40",
    Pending: "bg-warning/15 text-warning border-warning/40",
    Restricted: "bg-destructive/15 text-destructive border-destructive/40",
    Authorized: "bg-primary/15 text-primary border-primary/40",
  };
  return <span className={`px-2 py-0.5 rounded border text-[10px] ${map[s] ?? ""}`}>{s.toUpperCase()}</span>;
}
