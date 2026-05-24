import { createFileRoute } from "@tanstack/react-router";
import { InternalShell } from "@/components/internal-shell";
import { useOfficerGuard } from "@/lib/officer-session";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MINISTRIES } from "@/lib/ministries";

export const Route = createFileRoute("/analytics")({ component: Analytics });

const traffic = Array.from({ length: 24 }, (_, i) => ({ h: `${i}:00`, req: 1200 + Math.round(Math.sin(i / 3) * 600 + Math.random() * 400) }));
const byMin = MINISTRIES.map((m) => ({ name: m.code, req: 200 + Math.round(Math.random() * 1800) }));

function Analytics() {
  const __guard = useOfficerGuard();
  if (!__guard.ready) return null;
  return (
    <InternalShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Executive dashboard</div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">Smart governance, in numbers</h1>
          </div>
          <div className="text-xs text-muted-foreground">Updated 12:42 EAT · auto-refresh 60s</div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { l: "Verifications today", v: "42,118", d: "+12.4%" },
            { l: "Fraud prevented", v: "182", d: "+8.1%" },
            { l: "Avg response", v: "318ms", d: "-22ms" },
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
            <div className="font-semibold mb-3">Verification traffic (24h)</div>
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
                  <XAxis dataKey="h" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="req" stroke="oklch(0.75 0.18 255)" fill="url(#g1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="font-semibold mb-3">Requests by ministry</div>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={byMin}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="req" fill="oklch(0.82 0.14 85)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-xl p-5 lg:col-span-3">
            <div className="font-semibold mb-3">Service uptime · last 30 days</div>
            <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const ok = Math.random() > 0.04;
                return <div key={i} className={`h-8 rounded ${ok ? "bg-success/70" : "bg-warning/70"}`} title={`Day ${i + 1}`} />;
              })}
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex gap-4">
              <span><span className="inline-block w-2 h-2 bg-success/70 rounded mr-1" /> Healthy</span>
              <span><span className="inline-block w-2 h-2 bg-warning/70 rounded mr-1" /> Degraded</span>
            </div>
          </div>
        </div>
      </div>
    </InternalShell>
  );
}
