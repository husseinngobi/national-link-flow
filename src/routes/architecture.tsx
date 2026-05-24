import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { InternalShell } from "@/components/internal-shell";
import { useOfficerGuard } from "@/lib/officer-session";
import { MINISTRIES } from "@/lib/ministries";
import { Shield, ArrowRight, Lock, Activity } from "lucide-react";

export const Route = createFileRoute("/architecture")({ component: ArchPage });

function ArchPage() {
  const [active, setActive] = useState(MINISTRIES[0].id);
  const ministry = MINISTRIES.find((m) => m.id === active)!;

  const size = 560;
  const cx = size / 2, cy = size / 2;
  const radius = 220;

  const nodes = MINISTRIES.map((m) => {
    const rad = (m.angle * Math.PI) / 180;
    return { ...m, x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  });

  return (
    <InternalShell>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">System architecture</div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Federated interoperability map</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Click a ministry to see what data it brokers through NGDXH. Each line is an authorized, encrypted, audited API channel — not a copy of the data.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Diagram */}
          <div className="glass rounded-xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full relative">
              {/* connection lines */}
              {nodes.map((n) => {
                const isActive = n.id === active;
                return (
                  <line key={"l" + n.id} x1={cx} y1={cy} x2={n.x} y2={n.y}
                    stroke={isActive ? "var(--color-gold)" : "oklch(0.4 0.06 262)"}
                    strokeWidth={isActive ? 2 : 1}
                    className={isActive ? "data-line" : ""}
                    opacity={isActive ? 1 : 0.5}
                  />
                );
              })}

              {/* hub */}
              <circle cx={cx} cy={cy} r={60} fill="oklch(0.22 0.08 262)" stroke="var(--color-gold)" strokeWidth={1.5} />
              <circle cx={cx} cy={cy} r={70} fill="none" stroke="var(--color-gold)" strokeWidth={1} opacity={0.4} className="pulse-ring" style={{ transformOrigin: `${cx}px ${cy}px` }} />
              <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground font-display font-bold" fontSize={16}>NGDXH</text>
              <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gold" fontSize={10}>Secure Core</text>

              {/* nodes */}
              {nodes.map((n) => {
                const isActive = n.id === active;
                return (
                  <g key={n.id} onClick={() => setActive(n.id)} className="cursor-pointer">
                    <circle cx={n.x} cy={n.y} r={isActive ? 38 : 32} fill={n.color + "22"} stroke={n.color} strokeWidth={isActive ? 2 : 1} />
                    <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={11} className="fill-foreground font-semibold pointer-events-none">{n.code}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={ministry.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="glass rounded-xl p-5 h-fit sticky top-24"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-md flex items-center justify-center font-mono text-sm font-bold" style={{ background: ministry.color + "22", color: ministry.color, border: `1px solid ${ministry.color}55` }}>
                  {ministry.code}
                </div>
                <div>
                  <div className="font-semibold">{ministry.name}</div>
                  <div className="text-xs text-muted-foreground">{ministry.full}</div>
                </div>
              </div>

              <div className="text-xs uppercase tracking-wider text-gold mb-2">Verifiable data</div>
              <ul className="space-y-1.5 text-sm mb-5">
                {ministry.capabilities.map((c) => (
                  <li key={c} className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-success" />{c}</li>
                ))}
              </ul>

              <div className="text-xs uppercase tracking-wider text-gold mb-2">API endpoints</div>
              <div className="space-y-2 mb-5">
                {ministry.endpoints.map((e) => (
                  <div key={e.path} className="font-mono text-xs p-2 rounded mono-surface border border-border/60">
                    <span className="text-gold mr-2">{e.method}</span>{e.path}
                    <div className="text-muted-foreground text-[10px] mt-0.5">{e.name}</div>
                  </div>
                ))}
              </div>

              <SimulateButton ministry={ministry.code} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Layers */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            { t: "Edge & API Gateway", d: "mTLS, throttling, signed JWT requests, ministry-issued client certificates.", i: Lock },
            { t: "Exchange Core", d: "Schema-validated routing between ministry adapters. Stateless. No bulk storage.", i: Activity },
            { t: "Governance & Audit", d: "Immutable audit log, consent registry, RBAC enforcement, data lineage.", i: Shield },
          ].map((l) => (
            <div key={l.t} className="glass rounded-lg p-5">
              <l.i className="w-5 h-5 text-gold mb-3" />
              <div className="font-semibold mb-1">{l.t}</div>
              <div className="text-sm text-muted-foreground">{l.d}</div>
            </div>
          ))}
        </div>
      </div>
    </InternalShell>
  );
}

function SimulateButton({ ministry }: { ministry: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        setBusy(true); setDone(false);
        setTimeout(() => { setBusy(false); setDone(true); }, 1200);
      }}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
    >
      {busy ? <>Exchanging with {ministry}...</> : done ? <>✓ Exchange complete</> : <>Simulate exchange <ArrowRight className="w-4 h-4" /></>}
    </button>
  );
}
