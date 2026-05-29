import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { OfficerShell } from "@/components/officer-shell";
import {
  AlertTriangle,
  Brain,
  ShieldAlert,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/fraud-detection")({ component: FraudDetection });

const ALERTS = [
  {
    id: "AI-FRD-44218",
    sev: "critical",
    score: 96,
    title: "Duplicate identity claim across districts",
    citizen: "NIN CM920708KAMPA",
    summary:
      "Same biometric template matched two distinct NIN records registered 412km apart within 48 hours.",
    signals: [
      "Face embedding cosine 0.987",
      "Duplicate fingerprint Hash#3",
      "Conflicting district NIRA records",
    ],
    agencies: ["NIRA", "DCIC"],
    action: "Auto-frozen pending NIRA review",
  },
  {
    id: "AI-FRD-44217",
    sev: "high",
    score: 88,
    title: "Anomalous land transfer pattern",
    citizen: "NIN CM870323WAKIS",
    summary:
      "5 land titles transferred to a single beneficiary across 3 districts within 72h — exceeds 99.7th percentile of normal activity.",
    signals: [
      "MLHUD volumetric anomaly",
      "Beneficiary URA risk score 71",
      "Common notary across deeds",
    ],
    agencies: ["MLHUD", "URA"],
    action: "Flagged · MLHUD compliance notified",
  },
  {
    id: "AI-FRD-44216",
    sev: "high",
    score: 84,
    title: "Tax under-declaration vs. lifestyle signals",
    citizen: "NIN CM910412MUKON",
    summary:
      "Declared annual income UGX 18M; cross-agency signals (2 vehicles, 2 properties, frequent EBB↔DXB travel) inconsistent with declaration.",
    signals: ["URA filings", "MoWT vehicle register", "DCIC travel manifest", "MLHUD ownership"],
    agencies: ["URA", "MoWT", "DCIC", "MLHUD"],
    action: "Recommend audit · awaiting reviewer",
  },
  {
    id: "AI-FRD-44215",
    sev: "medium",
    score: 71,
    title: "Ghost beneficiary on social register",
    citizen: "NIN CM550118KASES (deceased)",
    summary:
      "Beneficiary marked deceased at NIRA still receiving disbursements via UCC mobile-money KYC. Probable identity reuse.",
    signals: ["NIRA vital status", "UCC active SIM KYC", "Disbursement cadence"],
    agencies: ["NIRA", "UCC"],
    action: "Hold disbursement · escalate to MGLSD",
  },
  {
    id: "AI-FRD-44214",
    sev: "medium",
    score: 68,
    title: "Cross-border immigration vs. internal services",
    citizen: "Passport B7711022",
    summary:
      "Citizen recorded crossing Mutukula at 11:42 and accessing in-country health insurance verification in Kampala at 11:58 — temporally impossible.",
    signals: ["DCIC border log", "MoH portal access log"],
    agencies: ["DCIC", "MOH"],
    action: "Possible credential theft · MFA challenge issued",
  },
  {
    id: "AI-FRD-44213",
    sev: "low",
    score: 42,
    title: "Behavioral drift on officer account",
    citizen: "OFC-2026-0188",
    summary: "Officer querying citizen NINs outside historical pattern (volume +340%, off-hours).",
    signals: ["UEBA score", "Geo anomaly", "Out-of-shift access"],
    agencies: ["NGDXH"],
    action: "Adaptive auth · session re-verified",
  },
];

const sevColor = (s: string) =>
  s === "critical"
    ? "bg-destructive/15 text-destructive border-destructive/40"
    : s === "high"
      ? "bg-warning/15 text-warning border-warning/40"
      : s === "medium"
        ? "bg-gold/15 text-gold border-gold/40"
        : "bg-muted text-muted-foreground border-border";

function FraudDetection() {
  const nav = useNavigate();
  const [open, setOpen] = useState<string | null>(ALERTS[0].id);
  const sel = ALERTS.find((a) => a.id === open)!;

  return (
    <OfficerShell
      roleId="admin"
      roleTitle="System Auditor"
      isAdmin
      allowedRoles={["agency", "admin"]}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2 flex items-center gap-2">
              <Brain className="w-3.5 h-3.5" /> AI fraud & anomaly detection engine
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">
              Catch fraud before it costs the nation.
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl text-sm">
              NGDXH's federated AI model continuously correlates signals across MDAs to surface
              duplicate identities, ghost beneficiaries, anomalous transfers and suspicious officer
              behaviour — without ever moving raw data off ministry servers.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                <Users className="w-3.5 h-3.5 text-gold" />
                Access: Agency Administrator, System Auditor
              </span>
              <span className="inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Clickable from the dashboard intelligence console
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                window.history.length > 1
                  ? window.history.back()
                  : nav({ to: "/dashboard/$role", params: { role: "admin" } })
              }
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-3 py-2 text-sm hover:bg-accent transition"
            >
              <TrendingUp className="w-4 h-4 rotate-180" /> Back to dashboard
            </button>
            <div className="glass rounded-md px-3 py-2 text-center">
              <div className="text-[10px] uppercase text-muted-foreground tracking-wider">
                Today
              </div>
              <div className="text-xl font-display font-bold text-destructive">182</div>
            </div>
            <div className="glass rounded-md px-3 py-2 text-center">
              <div className="text-[10px] uppercase text-muted-foreground tracking-wider">
                UGX saved (M)
              </div>
              <div className="text-xl font-display font-bold text-success">412</div>
            </div>
            <div className="glass rounded-md px-3 py-2 text-center">
              <div className="text-[10px] uppercase text-muted-foreground tracking-wider">
                Model precision
              </div>
              <div className="text-xl font-display font-bold text-gold">94.1%</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          {/* Alert list */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-destructive" /> Live alert queue
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Filter…"
                  className="bg-input border border-border rounded-md pl-7 pr-2 py-1 text-xs w-40"
                />
              </div>
            </div>
            <div className="space-y-2 max-h-[640px] overflow-auto pr-1">
              {ALERTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setOpen(a.id)}
                  className={`w-full text-left border rounded-lg p-3 transition ${open === a.id ? "border-gold/60 bg-gold/5" : "border-border/60 hover:bg-accent/40"}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${sevColor(a.sev)} font-mono uppercase`}
                    >
                      {a.sev}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{a.id}</span>
                  </div>
                  <div className="text-sm font-semibold leading-snug">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">{a.citizen}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded overflow-hidden">
                      <div
                        className={`h-full ${a.score > 85 ? "bg-destructive" : a.score > 65 ? "bg-warning" : "bg-gold"} w-[${a.score}%]`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      risk {a.score}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-[10px] px-2 py-0.5 rounded border ${sevColor(sel.sev)} font-mono uppercase`}
              >
                {sel.sev} · score {sel.score}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{sel.id}</span>
            </div>
            <h2 className="text-xl font-display font-bold leading-snug">{sel.title}</h2>
            <div className="text-xs text-muted-foreground mt-1 font-mono">{sel.citizen}</div>

            <div className="my-5 h-px gold-divider" />

            <div className="text-xs uppercase tracking-wider text-gold mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> AI summary
            </div>
            <p className="text-sm leading-relaxed">{sel.summary}</p>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Correlated signals
                </div>
                <ul className="space-y-1.5">
                  {sel.signals.map((s) => (
                    <li key={s} className="text-sm flex items-start gap-2">
                      <Eye className="w-3.5 h-3.5 text-gold mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Implicated agencies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sel.agencies.map((a) => (
                    <span
                      key={a}
                      className="text-xs px-2 py-1 rounded-md border border-border bg-card font-mono"
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-4 mb-2">
                  Automated action
                </div>
                <div className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  {sel.action}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-destructive text-destructive-foreground text-sm hover:opacity-90">
                <XCircle className="w-4 h-4" /> Escalate to lead investigator
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-success text-background text-sm hover:opacity-90">
                <CheckCircle2 className="w-4 h-4" /> Mark as resolved
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-accent">
                <Users className="w-4 h-4" /> View entity graph
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
              {[
                { l: "Trend (7d)", v: "+12.4%", i: TrendingUp, c: "text-warning" },
                { l: "Auto-blocked", v: "78%", i: ShieldAlert, c: "text-success" },
                { l: "False positives", v: "5.9%", i: Brain, c: "text-gold" },
              ].map((k) => (
                <div key={k.l} className="border border-border/60 rounded-md p-2.5 text-center">
                  <k.i className={`w-4 h-4 ${k.c} mx-auto mb-1`} />
                  <div className="text-muted-foreground text-[10px] uppercase tracking-wider">
                    {k.l}
                  </div>
                  <div className="font-display font-bold text-base">{k.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}
