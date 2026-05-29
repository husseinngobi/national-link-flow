import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { MINISTRIES } from "@/lib/ministries";
import { Activity, Radio } from "lucide-react";

export const Route = createFileRoute("/simulation")({ component: SimulationPage });

const TEMPLATES = [
  (a: string, b: string) => `[${a}] verification request received → routed to ${b}`,
  (a: string) => `[HUB] RBAC scope:identity.read verified · client=${a}`,
  (_a: string, b: string) => `[${b}] response signed · 200 OK · 312ms`,
  () =>
    `[AUDIT] TX-${Math.random().toString(36).slice(2, 8).toUpperCase()} sealed in immutable ledger`,
  (a: string) => `[${a}] mTLS handshake complete · cert OK`,
  (_a: string, b: string) => `[${b}] schema validation passed · no PII at rest`,
];

function SimulationPage() {
  const [events, setEvents] = useState<{ id: number; text: string; a: string; b: string }[]>([]);
  const [active, setActive] = useState<{ a: string; b: string } | null>(null);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const a = MINISTRIES[Math.floor(Math.random() * MINISTRIES.length)];
      let b = MINISTRIES[Math.floor(Math.random() * MINISTRIES.length)];
      if (b.id === a.id) {
        b = MINISTRIES[(MINISTRIES.indexOf(b) + 1) % MINISTRIES.length];
      }
      const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
      setActive({ a: a.id, b: b.id });
      setEvents((prev) =>
        [{ id: id++, text: template(a.code, b.code), a: a.id, b: b.id }, ...prev].slice(0, 60),
      );
    };
    tick();
    const interval = setInterval(tick, 1100);
    return () => clearInterval(interval);
  }, []);

  const size = 520;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 200;
  const nodes = MINISTRIES.map((m) => {
    const rad = (m.angle * Math.PI) / 180;
    return { ...m, x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  });

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Live exchange</div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">
            Real-time interoperability simulation
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Authorized API calls flowing between ministries through the NGDXH core. This is a
            simulated stream — production traffic is mTLS-encrypted and rate-limited.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="glass rounded-xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full relative">
              {active &&
                (() => {
                  const source = nodes.find((n) => n.id === active.a)!;
                  const target = nodes.find((n) => n.id === active.b)!;
                  return (
                    <>
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={cx}
                        y2={cy}
                        stroke="var(--color-gold)"
                        strokeWidth={2}
                        className="data-line"
                      />
                      <line
                        x1={cx}
                        y1={cy}
                        x2={target.x}
                        y2={target.y}
                        stroke="var(--color-gold)"
                        strokeWidth={2}
                        className="data-line"
                      />
                    </>
                  );
                })()}
              {nodes.map((n) => {
                const isActive = active && (active.a === n.id || active.b === n.id);
                return (
                  <g key={n.id}>
                    {isActive && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={40}
                        fill="none"
                        stroke={n.color}
                        strokeWidth={1}
                        className="pulse-ring"
                      />
                    )}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={28}
                      fill={n.color + "33"}
                      stroke={n.color}
                      strokeWidth={isActive ? 2 : 1}
                      opacity={0.85}
                    />
                    <text
                      x={n.x}
                      y={n.y + 4}
                      textAnchor="middle"
                      fontSize={10}
                      className="font-semibold fill-white"
                      fontWeight="600"
                    >
                      {n.code}
                    </text>
                  </g>
                );
              })}
              <circle
                cx={cx}
                cy={cy}
                r={50}
                fill="oklch(0.22 0.08 262)"
                stroke="var(--color-gold)"
                strokeWidth={1.5}
              />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                className="fill-gold font-display font-bold"
                fontSize={14}
              >
                NGDXH
              </text>
            </svg>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-gold animate-pulse" />
              <div className="font-semibold">Event stream</div>
              <span className="ml-auto text-xs text-muted-foreground">{events.length} events</span>
            </div>
            <div className="font-mono text-xs space-y-1 max-h-115 overflow-auto bg-accent/40 rounded p-3 border border-border/60">
              {events.map((e) => (
                <div key={e.id} className="flex gap-2">
                  <span className="text-muted-foreground">
                    {new Date().toLocaleTimeString().slice(0, 8)}
                  </span>
                  <span className="text-foreground">{e.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-4 gap-3">
          {[
            { l: "Active sessions", v: "126" },
            { l: "Req/sec", v: "84.2" },
            { l: "Errors (1h)", v: "0.01%" },
            { l: "Throughput", v: "12.4 MB/s" },
          ].map((k) => (
            <div key={k.l} className="glass rounded-lg p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</div>
              <div className="text-2xl font-display font-bold mt-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-success" />
                {k.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
