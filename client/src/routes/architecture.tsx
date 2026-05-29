import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { OfficerShell } from "@/components/officer-shell";
import { MINISTRIES } from "@/lib/ministries";
import {
  Shield,
  ArrowRight,
  Lock,
  Activity,
  Network,
  ShieldCheck,
  Building2,
  Globe2,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/architecture")({ component: ArchPage });

const SOLVES = [
  {
    title: "Faster service verification",
    text: "One request reaches the right ministry through a single secure route instead of manual phone calls or paper chasing.",
  },
  {
    title: "Less duplicate data entry",
    text: "Once a ministry validates a record, the hub can notify approved partners instead of asking citizens to repeat the same documents.",
  },
  {
    title: "Better oversight",
    text: "Every exchange is traceable, so the Auditor General and security teams can see who requested what and why.",
  },
  {
    title: "Safer public access",
    text: "Citizens, companies, and officers each get a different surface with the minimum data needed for their role.",
  },
];

const INTERACTION_STEPS = [
  "Client authenticates at the gateway with a verified role and scopes.",
  "NGDXH checks policy, consent, rate limits, and whether the data is allowed for that caller.",
  "The request is routed to the owning ministry adapter, never broadcast everywhere.",
  "The ministry returns only the approved fields; the hub records the receipt and audit trail.",
  "Downstream ministries subscribe to events they are permitted to receive, not raw databases.",
];

const BENCHMARKS = [
  {
    title: "Singapore-like structure",
    text: "A central digital exchange, strong identity, clear agency ownership, and event-driven integration.",
  },
  {
    title: "United States-like governance",
    text: "Federal-style autonomy for each agency, but strict API controls and audit requirements across the network.",
  },
  {
    title: "Uganda fit",
    text: "Smaller, simpler, and easier to operate locally, while still matching the professional model used internationally.",
  },
];

const CAPABILITIES = [
  {
    title: "National identity federation",
    text: "One login path for citizens, companies, and officers, with role-bound access to the right tools.",
  },
  {
    title: "Service orchestration",
    text: "Requests move through a controlled workflow instead of being copied between ministries by hand.",
  },
  {
    title: "Audit and receipts",
    text: "Every lookup and approval leaves a traceable record that can be reviewed later.",
  },
  {
    title: "Data minimization",
    text: "Only the approved fields flow through each exchange, not the whole database.",
  },
  {
    title: "Policy enforcement",
    text: "RBAC, scopes, consent, and rate limits are part of the exchange flow, not just the UI.",
  },
  {
    title: "Operational visibility",
    text: "Monitoring, alerts, and latency checks make the hub feel like a serious public platform.",
  },
];

function ArchPage() {
  const nav = useNavigate();
  const [active, setActive] = useState(MINISTRIES[0].id);
  const ministry = MINISTRIES.find((m) => m.id === active)!;

  const size = 560;
  const cx = size / 2,
    cy = size / 2;
  const radius = 220;

  const nodes = MINISTRIES.map((m) => {
    const rad = (m.angle * Math.PI) / 180;
    return {
      ...m,
      x: Number((cx + radius * Math.cos(rad)).toFixed(2)),
      y: Number((cy + radius * Math.sin(rad)).toFixed(2)),
    };
  });

  return (
    <OfficerShell
      roleId="admin"
      roleTitle="System Auditor"
      isAdmin
      allowedRoles={["agency", "admin", "nira", "immig"]}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
              System architecture
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">
              Federated interoperability map
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Click a ministry to see what data it brokers through NGDXH. Each line is an
              authorized, encrypted, audited API channel — not a copy of the data.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                <Users className="w-3.5 h-3.5 text-gold" />
                Access: Agency Administrator, System Auditor
              </span>
              <span className="inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Open from the officer dashboard
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              window.history.length > 1
                ? window.history.back()
                : nav({ to: "/dashboard/$role", params: { role: "admin" } })
            }
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-3 py-2 text-sm hover:bg-accent transition"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to dashboard
          </button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {SOLVES.map((item) => (
            <div key={item.title} className="glass rounded-xl p-4">
              <div className="w-10 h-10 rounded-md bg-gold/15 text-gold flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-semibold mb-2">{item.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{item.text}</div>
            </div>
          ))}
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
                  <line
                    key={"l" + n.id}
                    x1={cx}
                    y1={cy}
                    x2={n.x}
                    y2={n.y}
                    stroke={isActive ? "var(--color-gold)" : "oklch(0.4 0.06 262)"}
                    strokeWidth={isActive ? 2 : 1}
                    className={isActive ? "data-line" : ""}
                    opacity={isActive ? 1 : 0.5}
                  />
                );
              })}

              {/* hub */}
              <circle
                cx={cx}
                cy={cy}
                r={60}
                fill="oklch(0.22 0.08 262)"
                stroke="var(--color-gold)"
                strokeWidth={1.5}
              />
              <circle
                cx={cx}
                cy={cy}
                r={70}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth={1}
                opacity={0.4}
                className="pulse-ring"
              />
              <text
                x={cx}
                y={cy - 4}
                textAnchor="middle"
                className="fill-foreground font-display font-bold svg-stroke-4"
                fontSize={16}
              >
                NGDXH
              </text>
              <text
                x={cx}
                y={cy + 14}
                textAnchor="middle"
                className="fill-gold svg-stroke-3"
                fontSize={10}
              >
                Secure Core
              </text>

              {/* nodes */}
              {nodes.map((n) => {
                const isActive = n.id === active;
                return (
                  <g key={n.id} onClick={() => setActive(n.id)} className="cursor-pointer">
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={isActive ? 38 : 32}
                      fill={n.color + "22"}
                      stroke={n.color}
                      strokeWidth={isActive ? 2 : 1}
                    />
                    <text
                      x={n.x}
                      y={n.y + 4}
                      textAnchor="middle"
                      fontSize={11}
                      className="fill-foreground font-semibold pointer-events-none svg-stroke-3"
                    >
                      {n.code}
                    </text>
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
                <svg className="w-12 h-12" viewBox="0 0 48 48" aria-hidden>
                  <circle
                    cx={24}
                    cy={24}
                    r={20}
                    fill={ministry.color + "22"}
                    stroke={ministry.color + "55"}
                    strokeWidth={1}
                  />
                  <text
                    x={24}
                    y={30}
                    textAnchor="middle"
                    fontSize={11}
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace"
                    fontWeight={700}
                    fill={ministry.color}
                    className="svg-stroke-3"
                  >
                    {ministry.code}
                  </text>
                </svg>
                <div>
                  <div className="font-semibold">{ministry.name}</div>
                  <div className="text-xs text-muted-foreground">{ministry.full}</div>
                </div>
              </div>

              <div className="text-xs uppercase tracking-wider text-gold mb-2">Verifiable data</div>
              <ul className="space-y-1.5 text-sm mb-5">
                {ministry.capabilities.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-success" />
                    {c}
                  </li>
                ))}
              </ul>

              <div className="text-xs uppercase tracking-wider text-gold mb-2">API endpoints</div>
              <div className="space-y-2 mb-5">
                {ministry.endpoints.map((e) => (
                  <div
                    key={e.path}
                    className="font-mono text-xs p-2 rounded mono-surface border border-border/60"
                  >
                    <span className="text-gold mr-2">{e.method}</span>
                    {e.path}
                    <div className="text-muted-foreground text-[10px] mt-0.5">{e.name}</div>
                  </div>
                ))}
              </div>

              <SimulateButton ministry={ministry.code} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 font-semibold">
              <Network className="w-4 h-4 text-gold" />
              How ministries interact
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              {INTERACTION_STEPS.map((step, index) => (
                <div key={step} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gold/15 text-gold flex items-center justify-center font-mono text-xs shrink-0">
                    {index + 1}
                  </div>
                  <div>{step}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3 font-semibold">
              <Globe2 className="w-4 h-4 text-gold" />
              International posture
            </div>
            <div className="space-y-3">
              {BENCHMARKS.map((item) => (
                <div key={item.title} className="rounded-lg border border-border/60 bg-card/40 p-3">
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Layers */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            {
              t: "Edge & API Gateway",
              d: "mTLS, throttling, signed JWT requests, ministry-issued client certificates.",
              i: Lock,
            },
            {
              t: "Exchange Core",
              d: "Schema-validated routing between ministry adapters. Stateless. No bulk storage.",
              i: Activity,
            },
            {
              t: "Governance & Audit",
              d: "Immutable audit log, consent registry, RBAC enforcement, data lineage.",
              i: Shield,
            },
          ].map((l) => (
            <div key={l.t} className="glass rounded-lg p-5">
              <l.i className="w-5 h-5 text-gold mb-3" />
              <div className="font-semibold mb-1">{l.t}</div>
              <div className="text-sm text-muted-foreground">{l.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3 font-semibold">
            <Building2 className="w-4 h-4 text-gold" />
            What to add next
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground leading-relaxed">
            <div className="rounded-lg border border-border/60 bg-card/40 p-4">
              A real authentication service for companies and officers, backed by database sessions
              and expiring tokens.
            </div>
            <div className="rounded-lg border border-border/60 bg-card/40 p-4">
              Per-ministry adapters with explicit schemas, instead of demo arrays in the frontend.
            </div>
            <div className="rounded-lg border border-border/60 bg-card/40 p-4">
              Audit receipts stored server-side, with downloadable PDFs or signed JSON receipts.
            </div>
            <div className="rounded-lg border border-border/60 bg-card/40 p-4">
              Monitoring dashboards for latency, availability, policy denials, and anomalous
              requests.
            </div>
          </div>
        </div>
        <div className="mt-10 glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3 font-semibold">
            <ShieldCheck className="w-4 h-4 text-gold" />
            Government-grade capabilities shown by the prototype
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground leading-relaxed">
            {CAPABILITIES.map((item) => (
              <div key={item.title} className="rounded-lg border border-border/60 bg-card/40 p-4">
                <div className="font-medium text-foreground mb-1">{item.title}</div>
                <div>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}

function SimulateButton({ ministry }: { ministry: string }) {
  type SimulationResult = {
    error?: string;
    result?: { ministry?: string; code?: string; status?: string; note?: string; latency?: number };
    auditId?: string;
  } | null;
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SimulationResult>(null);

  async function runSimulation() {
    setBusy(true);
    setResult(null);
    try {
      const nin = (localStorage.getItem("demo_nin") || "CM900112ABCDE").toUpperCase();
      const res = await fetch(
        `/api/ministry/${ministry.toLowerCase()}/verify?nin=${encodeURIComponent(nin)}`,
      );
      const json = await res.json();
      setResult(json);
    } catch (err) {
      setResult({ error: "network" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => runSimulation()}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
      >
        {busy ? (
          <>Exchanging with {ministry}...</>
        ) : (
          <>
            Simulate exchange <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {result && (
        <div className="mt-3 text-sm">
          {result.error ? (
            <div className="text-destructive">Simulation error: {String(result.error)}</div>
          ) : (
            <div className="rounded-lg p-3 border border-border/60 bg-card/40">
              <div className="font-medium">Adapter response</div>
              <div className="text-xs text-muted-foreground">
                Ministry: {result.result?.ministry ?? result.result?.code}
              </div>
              <div className="mt-1">Status: {result.result?.status}</div>
              <div className="text-xs text-muted-foreground">Note: {result.result?.note}</div>
              <div className="text-xs text-muted-foreground">
                Latency: {result.result?.latency}ms
              </div>
              <div className="text-xs text-muted-foreground mt-2">Audit ID: {result.auditId}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
