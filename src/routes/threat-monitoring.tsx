import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { InternalShell } from "@/components/internal-shell";
import { useOfficerGuard } from "@/lib/officer-session";
import { ShieldAlert, AlertTriangle, ShieldCheck, Globe2, Activity, Ban } from "lucide-react";

export const Route = createFileRoute("/threat-monitoring")({ component: ThreatMonitoring });

type Event = {
  id: number; t: string; sev: "critical" | "high" | "med" | "low";
  type: string; src: string; action: "BLOCKED" | "FLAGGED" | "ALLOWED";
};

const SEED: Event[] = [
  { id: 1, t: "12:42:11", sev: "critical", type: "Brute-force login attempt", src: "41.210.144.22 → /login", action: "BLOCKED" },
  { id: 2, t: "12:41:08", sev: "high", type: "Anomalous API rate spike", src: "URA-CLI-781 · 4× NIN lookups / 9s", action: "FLAGGED" },
  { id: 3, t: "12:39:51", sev: "med", type: "MoH adapter latency anomaly", src: "moh-adapter-3 · +28%", action: "ALLOWED" },
  { id: 4, t: "12:38:14", sev: "high", type: "Geo-impossible session", src: "Officer OFC-2026-0119 · Kampala → Nairobi 4m", action: "BLOCKED" },
  { id: 5, t: "12:36:02", sev: "low", type: "Cert auto-rotation", src: "MLHUD adapter · routine", action: "ALLOWED" },
];

function ThreatMonitoring() {
  const { ready, session } = useOfficerGuard();
  const [events, setEvents] = useState<Event[]>(SEED);
  const [counts, setCounts] = useState({ blocked24h: 1284, flagged24h: 47, mfaFails: 12 });

  useEffect(() => {
    if (!ready) return;
    const i = setInterval(() => {
      const samples: Omit<Event, "id" | "t">[] = [
        { sev: "high", type: "Replay attack detected", src: "Gateway · nonce reuse", action: "BLOCKED" },
        { sev: "critical", type: "SQL injection attempt", src: "POST /v1/identity · sanitized & dropped", action: "BLOCKED" },
        { sev: "med", type: "MFA challenge failed", src: "Officer OFC-2026-0120 · attempt 2/3", action: "FLAGGED" },
        { sev: "low", type: "Token rotation completed", src: "URA service account", action: "ALLOWED" },
        { sev: "high", type: "Suspicious cross-ministry probe", src: "Adapter health scan · gateway policy", action: "BLOCKED" },
      ];
      const p = samples[Math.floor(Math.random() * samples.length)];
      setEvents((prev) => [{ id: Date.now(), t: new Date().toLocaleTimeString(), ...p }, ...prev].slice(0, 14));
      setCounts((c) => ({
        blocked24h: c.blocked24h + (p.action === "BLOCKED" ? 1 : 0),
        flagged24h: c.flagged24h + (p.action === "FLAGGED" ? 1 : 0),
        mfaFails: c.mfaFails + (p.type.includes("MFA") ? 1 : 0),
      }));
    }, 2200);
    return () => clearInterval(i);
  }, [ready]);

  if (!ready) return null;

  const sevColor = (s: Event["sev"]) =>
    s === "critical" ? "text-destructive border-destructive/40 bg-destructive/10"
    : s === "high" ? "text-warning border-warning/40 bg-warning/10"
    : s === "med" ? "text-primary border-primary/40 bg-primary/10"
    : "text-muted-foreground border-border bg-accent/40";

  const actColor = (a: Event["action"]) =>
    a === "BLOCKED" ? "text-destructive"
    : a === "FLAGGED" ? "text-warning"
    : "text-success";

  return (
    <InternalShell>
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-destructive uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> Threat monitoring · Live
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold mt-1">Security Operations Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, <span className="text-foreground">{session?.title}</span>. Real-time view of
            authentication failures, anomalous API behaviour and gateway policy events.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <Stat icon={Ban} label="Blocked (24h)" value={counts.blocked24h.toLocaleString()} color="text-destructive" />
          <Stat icon={AlertTriangle} label="Flagged (24h)" value={counts.flagged24h.toString()} color="text-warning" />
          <Stat icon={ShieldCheck} label="MFA challenges failed" value={counts.mfaFails.toString()} color="text-primary" />
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          <div className="glass rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="font-semibold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-gold" /> Live event stream
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">SOC-LIVE · auto-refresh 2s</span>
            </div>
            <div className="divide-y divide-border/60 font-mono text-xs max-h-[520px] overflow-auto">
              {events.map((e) => (
                <div key={e.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-accent/30">
                  <span className="text-muted-foreground w-20">{e.t}</span>
                  <span className={`px-1.5 py-0.5 rounded border text-[10px] uppercase ${sevColor(e.sev)}`}>{e.sev}</span>
                  <span className="flex-1 font-sans text-foreground">{e.type}</span>
                  <span className="text-muted-foreground hidden md:inline truncate max-w-[280px]">{e.src}</span>
                  <span className={`text-[10px] font-bold ${actColor(e.action)}`}>{e.action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="glass rounded-xl p-4">
              <div className="text-xs uppercase tracking-wider text-gold mb-2">Top attack origins</div>
              <ul className="space-y-2 text-xs">
                {[
                  { c: "Unknown VPN", n: 412 },
                  { c: "Kenya", n: 188 },
                  { c: "Nigeria", n: 102 },
                  { c: "Russia", n: 74 },
                  { c: "Other", n: 508 },
                ].map((r) => (
                  <li key={r.c} className="flex items-center gap-2">
                    <Globe2 className="w-3 h-3 text-muted-foreground" />
                    <span className="flex-1">{r.c}</span>
                    <span className="font-mono text-muted-foreground">{r.n}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-xs uppercase tracking-wider text-gold mb-2">Active defenses</div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>✓ WAF · OWASP Top 10 rules</li>
                <li>✓ mTLS · all ministry adapters</li>
                <li>✓ Rate limiter · per-token + per-IP</li>
                <li>✓ Geo-velocity anomaly detection</li>
                <li>✓ MFA enforced · all officers</li>
                <li>✓ Immutable audit log</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </InternalShell>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-md bg-accent flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-display font-bold">{value}</div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
