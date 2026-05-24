import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { InternalShell } from "@/components/internal-shell";
import { useOfficerGuard } from "@/lib/officer-session";
import { MINISTRIES } from "@/lib/ministries";
import { Activity, AlertTriangle, CheckCircle2, Cpu, Globe2, Radio, ShieldCheck, Signal, Wifi, Zap } from "lucide-react";

export const Route = createFileRoute("/command-center")({ component: CommandCenter });

type Health = { id: string; latency: number; rps: number; uptime: number; status: "ok" | "degraded" | "down" };

function CommandCenter() {
  const __guard = useOfficerGuard();
  if (!__guard.ready) return null;
  const [now, setNow] = useState(new Date());
  const [health, setHealth] = useState<Health[]>(() =>
    MINISTRIES.map((m) => ({ id: m.id, latency: 200 + Math.random() * 400, rps: 10 + Math.random() * 80, uptime: 99 + Math.random(), status: "ok" }))
  );
  const [alerts, setAlerts] = useState<{ id: number; sev: "high" | "med" | "low"; text: string; t: string }[]>([
    { id: 1, sev: "high", t: "12:41:08", text: "Anomaly: 4× NIN lookups from URA-CLI-781 in 9s · auto-throttled" },
    { id: 2, sev: "med", t: "12:39:51", text: "MoH adapter latency +28% above baseline · investigating" },
    { id: 3, sev: "low", t: "12:36:02", text: "Cert auto-rotation completed for MLHUD adapter" },
  ]);

  useEffect(() => {
    const i = setInterval(() => {
      setNow(new Date());
      setHealth((h) =>
        h.map((x) => {
          const lat = Math.max(80, x.latency + (Math.random() - 0.5) * 60);
          const rps = Math.max(2, x.rps + (Math.random() - 0.5) * 12);
          const status: Health["status"] = lat > 700 ? "degraded" : "ok";
          return { ...x, latency: lat, rps, status };
        })
      );
      if (Math.random() > 0.7) {
        const samples = [
          { sev: "high" as const, text: "Suspicious cross-ministry probe blocked at gateway (zero-trust policy)" },
          { sev: "med" as const, text: "Spike: URA verification queue depth 412 → scaling adapter +1 replica" },
          { sev: "low" as const, text: "Audit ledger sealed batch · hash 0x" + Math.random().toString(16).slice(2, 10) },
          { sev: "high" as const, text: "AI flagged duplicate NIN claim · escalated to NIRA fraud desk" },
        ];
        const pick = samples[Math.floor(Math.random() * samples.length)];
        setAlerts((a) => [{ id: Date.now(), t: new Date().toLocaleTimeString().slice(0, 8), ...pick }, ...a].slice(0, 12));
      }
    }, 1500);
    return () => clearInterval(i);
  }, []);

  const totalRps = Math.round(health.reduce((s, h) => s + h.rps, 0));
  const avgLat = Math.round(health.reduce((s, h) => s + h.latency, 0) / health.length);

  return (
    <InternalShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
              Interoperability command center · LIVE
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">National operations console</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl text-sm">Real-time visibility into every ministry adapter, API gateway and security event across the NGDXH mesh.</p>
          </div>
          <div className="font-mono text-xs text-muted-foreground text-right">
            <div className="text-foreground text-sm">{now.toLocaleTimeString()} EAT</div>
            <div>NOC · Kampala · DR · Mbarara</div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
          {[
            { l: "Total RPS", v: totalRps.toString(), i: Zap },
            { l: "Avg latency", v: `${avgLat}ms`, i: Signal },
            { l: "Active adapters", v: `${health.length}/${MINISTRIES.length}`, i: Wifi },
            { l: "Open incidents", v: alerts.filter((a) => a.sev === "high").length.toString(), i: AlertTriangle },
            { l: "Threats blocked / 24h", v: "1,418", i: ShieldCheck },
            { l: "AI insights", v: "37", i: Cpu },
          ].map((k) => (
            <div key={k.l} className="glass rounded-lg p-3">
              <div className="flex items-center justify-between text-muted-foreground text-[10px] uppercase tracking-wider">
                <span>{k.l}</span>
                <k.i className="w-3 h-3 text-gold" />
              </div>
              <div className="text-2xl font-display font-bold mt-1">{k.v}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ministry health grid */}
          <div className="glass rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-gold" /> Adapter health</div>
              <span className="text-xs text-muted-foreground">refresh 1.5s</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {MINISTRIES.map((m) => {
                const h = health.find((x) => x.id === m.id)!;
                const ok = h.status === "ok";
                return (
                  <div key={m.id} className="border border-border/60 rounded-lg p-3 bg-card/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded font-mono text-[10px] font-bold flex items-center justify-center" style={{ background: m.color + "22", color: m.color, border: `1px solid ${m.color}66` }}>{m.code}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{m.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{m.full}</div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${ok ? "bg-success/15 text-success border-success/40" : "bg-warning/15 text-warning border-warning/40"}`}>
                        {ok ? "HEALTHY" : "DEGRADED"}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-mono">
                      <div><div className="text-muted-foreground">latency</div><div className="text-foreground">{Math.round(h.latency)}ms</div></div>
                      <div><div className="text-muted-foreground">rps</div><div className="text-foreground">{h.rps.toFixed(1)}</div></div>
                      <div><div className="text-muted-foreground">uptime</div><div className="text-success">{h.uptime.toFixed(2)}%</div></div>
                    </div>
                    <div className="mt-2 h-1.5 bg-muted rounded overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-success to-gold" style={{ width: `${Math.min(100, h.rps * 1.2)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerts feed */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-destructive animate-pulse" />
              <div className="font-semibold">Live security feed</div>
            </div>
            <div className="space-y-2 max-h-[460px] overflow-auto">
              {alerts.map((a) => (
                <div key={a.id} className="border border-border/60 rounded-md p-2.5 bg-card/40">
                  <div className="flex items-center gap-2 text-[10px] mb-1">
                    <span className={`px-1.5 py-0.5 rounded font-mono ${a.sev === "high" ? "bg-destructive/15 text-destructive" : a.sev === "med" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}>
                      {a.sev.toUpperCase()}
                    </span>
                    <span className="font-mono text-muted-foreground">{a.t}</span>
                  </div>
                  <div className="text-xs leading-snug">{a.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Global map / SLA */}
          <div className="glass rounded-xl p-5 lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold flex items-center gap-2"><Globe2 className="w-4 h-4 text-gold" /> SLA matrix · last 30 days</div>
              <div className="text-xs text-muted-foreground flex gap-3">
                <span><span className="inline-block w-2 h-2 bg-success rounded mr-1" />OK</span>
                <span><span className="inline-block w-2 h-2 bg-warning rounded mr-1" />Degraded</span>
                <span><span className="inline-block w-2 h-2 bg-destructive rounded mr-1" />Outage</span>
              </div>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-xs">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-2 py-2">Ministry</th>
                    {Array.from({ length: 30 }).map((_, i) => <th key={i} className="font-mono text-[9px] w-4">{i + 1}</th>)}
                    <th className="text-right font-medium px-2">30-day</th>
                  </tr>
                </thead>
                <tbody>
                  {MINISTRIES.map((m) => {
                    let ok = 0;
                    const cells = Array.from({ length: 30 }).map((_, i) => {
                      const r = Math.random();
                      const s = r > 0.97 ? "down" : r > 0.92 ? "deg" : "ok";
                      if (s === "ok") ok++;
                      return s;
                    });
                    return (
                      <tr key={m.id} className="border-t border-border/40">
                        <td className="px-2 py-1.5 font-mono text-[10px]" style={{ color: m.color }}>{m.code}</td>
                        {cells.map((s, i) => (
                          <td key={i} className="px-0.5"><div className={`h-4 rounded-sm ${s === "ok" ? "bg-success/70" : s === "deg" ? "bg-warning/70" : "bg-destructive/70"}`} /></td>
                        ))}
                        <td className="px-2 text-right text-success font-mono">{((ok / 30) * 100).toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-success" /> All adapters within national SLA tolerance (99.9% target).</div>
          </div>
        </div>
      </div>
    </InternalShell>
  );
}
