import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MINISTRIES } from "@/lib/ministries";
import { Activity, ArrowRight, Bell, Clock3, Gauge, ReceiptText, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/analytics")({ component: Analytics });

type SimLog = {
  t: string;
  ministry: string;
  auditId: number;
  latency: number;
  result?: string;
};

const traffic = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  req: 1200 + Math.round(Math.sin(i / 3) * 600 + Math.random() * 400),
}));

function Analytics() {
  const [running, setRunning] = useState(false);
  const [rateMs, setRateMs] = useState<number>(2000);
  const [logs, setLogs] = useState<SimLog[]>([]);
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());

  async function loadLiveData() {
    try {
      const [statusRes, logsRes] = await Promise.all([
        fetch("/api/sim/runner/status"),
        fetch("/api/sim/runner/logs"),
      ]);
      const statusJson = await statusRes.json();
      const logsJson = await logsRes.json();
      setRunning(Boolean(statusJson.running));
      setRateMs(Number(statusJson.rateMs ?? 2000));
      setLogs((logsJson.logs ?? []).slice(0, 30));
      setLastSync(new Date().toLocaleTimeString());
    } catch {
      setLogs([]);
    }
  }

  useEffect(() => {
    loadLiveData();
    const interval = setInterval(loadLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  const byMin = useMemo(() => {
    const counts = new Map(MINISTRIES.map((m) => [m.code, 0] as const));
    for (const log of logs) {
      counts.set(log.ministry, (counts.get(log.ministry) ?? 0) + 1);
    }

    return MINISTRIES.map((m) => ({ name: m.code, req: counts.get(m.code) ?? 0 }));
  }, [logs]);

  const recentLatency =
    logs.length === 0
      ? 0
      : Math.round(logs.reduce((sum, log) => sum + log.latency, 0) / logs.length);
  const denied = logs.filter((log) => log.result && log.result !== "allowed").length;

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5" /> Executive observability
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">
              Live platform health, audit flow, and receipts
            </h1>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            Updated {lastSync} · auto-refresh 5s
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { l: "Simulator", v: running ? "Running" : "Stopped", d: `${rateMs} ms cadence` },
            { l: "Recent receipts", v: String(logs.length), d: `${denied} policy events` },
            {
              l: "Avg latency",
              v: `${recentLatency}ms`,
              d: recentLatency < 350 ? "Healthy" : "Watch",
            },
            { l: "API health", v: "99.98%", d: "Stable" },
          ].map((k) => (
            <div key={k.l} className="glass rounded-lg p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</div>
              <div className="text-2xl font-display font-bold mt-1">{k.v}</div>
              <div className="text-xs text-success mt-1">{k.d}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="font-semibold">Verification traffic (24h)</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5" /> {logs.length} live audit records
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={traffic}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.65 0.18 255)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.65 0.18 255)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="h"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="req"
                    stroke="oklch(0.75 0.18 255)"
                    fill="url(#g1)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3 font-semibold">
              <ShieldCheck className="h-4 w-4 text-gold" /> Requests by ministry
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={byMin}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                  />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="req" fill="oklch(0.82 0.14 85)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-xl p-5 lg:col-span-3">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="font-semibold flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-gold" /> Service uptime · last 30 days
              </div>
              <div className="text-xs text-muted-foreground">
                Watching adapter and receipt health
              </div>
            </div>
            <div className="grid grid-cols-30 gap-1">
              {Array.from({ length: 30 }).map((_, i) => {
                const ok = i % 13 !== 0;
                return (
                  <div
                    key={i}
                    className={`h-8 rounded ${ok ? "bg-success/70" : "bg-warning/70"}`}
                    title={`Day ${i + 1}`}
                  />
                );
              })}
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex flex-wrap gap-4">
              <span>
                <span className="inline-block w-2 h-2 bg-success/70 rounded mr-1" /> Healthy
              </span>
              <span>
                <span className="inline-block w-2 h-2 bg-warning/70 rounded mr-1" /> Degraded
              </span>
              <span>
                <span className="inline-block w-2 h-2 bg-destructive/70 rounded mr-1" /> Alert
              </span>
            </div>
          </div>

          <div className="glass rounded-xl p-5 lg:col-span-3">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="font-semibold flex items-center gap-2">
                <ReceiptText className="h-4 w-4 text-gold" /> Recent audit receipts
              </div>
              <a
                href="/sim-runner"
                className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
              >
                Open simulator <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid gap-2 text-xs">
              {logs.slice(0, 6).map((log) => (
                <div
                  key={`${log.auditId}-${log.t}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 bg-background/60 px-3 py-2"
                >
                  <div>
                    <div className="font-mono text-gold">Audit #{log.auditId}</div>
                    <div className="text-muted-foreground">
                      {log.ministry} · {log.t} · {log.latency}ms
                    </div>
                  </div>
                  <div className="text-right text-muted-foreground">
                    {log.result === "denied" ? "Policy denied" : "Receipt sealed"}
                  </div>
                </div>
              ))}
              {logs.length === 0 ? (
                <div className="rounded-md border border-dashed border-border/60 px-3 py-6 text-center text-muted-foreground">
                  No live simulation yet. Start the runner to populate receipts.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
