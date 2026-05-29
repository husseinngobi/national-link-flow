import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { InternalShell } from "@/components/internal-shell";
import { useOfficerGuard } from "@/lib/officer-session";
import { MOCK_CITIZEN } from "@/lib/ministries";
import {
  ScanFace,
  Camera,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Shield,
  ArrowRight,
  Upload,
  Cpu,
} from "lucide-react";

export const Route = createFileRoute("/face-scan")({ component: FaceScanPage });

type Phase = "idle" | "capturing" | "extracting" | "matching" | "done";

const STEPS = [
  {
    k: "capturing",
    label: "Capturing biometric frame",
    detail: "640×640 RGB · WebRTC stream simulated",
  },
  {
    k: "extracting",
    label: "Extracting 512-d face embedding",
    detail: "ArcFace · ONNX runtime · GPU",
  },
  {
    k: "matching",
    label: "Searching National Biometric Index",
    detail: "9.4M templates · FAISS · k=5 neighbours",
  },
  {
    k: "done",
    label: "Match resolved · dossier assembled",
    detail: "Cross-ministry profile via NGDXH",
  },
];

function FaceScanPage() {
  const __guard = useOfficerGuard();
  if (!__guard.ready) return null;
  const [phase, setPhase] = useState<Phase>("idle");

  const run = async () => {
    setPhase("capturing");
    await new Promise((r) => setTimeout(r, 1200));
    setPhase("extracting");
    await new Promise((r) => setTimeout(r, 1100));
    setPhase("matching");
    await new Promise((r) => setTimeout(r, 1400));
    setPhase("done");
  };

  const reset = () => setPhase("idle");
  const c = MOCK_CITIZEN;

  return (
    <InternalShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2 inline-flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" /> AI biometric profiling
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">
            Identify a citizen from a face alone
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            When no ID is presented, NGDXH can match a captured face against the National Biometric
            Index (NIRA + UPF + DCIC) and assemble a full cross-ministry profile in seconds — a
            capability today's UG Hub does not offer.
          </p>
        </div>

        <div className="grid lg:grid-cols-[440px_1fr] gap-6">
          {/* Camera */}
          <div className="glass rounded-xl p-5">
            <div className="aspect-square rounded-lg overflow-hidden relative bg-[color:var(--color-surface-strong)] border border-border">
              {/* Subject silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-44 h-44 rounded-full bg-gradient-to-br from-primary/40 to-gold/40 flex items-center justify-center text-4xl font-display font-bold text-primary-foreground">
                  {c.photoInitial}
                </div>
              </div>

              {/* Face bounding box */}
              <div className="absolute inset-[18%] border-2 border-gold rounded-md">
                <span className="absolute -top-5 left-0 text-[10px] font-mono text-gold bg-background/80 px-1">
                  face_0.987 · landmarks 68
                </span>
                {/* Corner ticks */}
                {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
                  (p) => (
                    <span
                      key={p}
                      className={`absolute ${p} w-3 h-3 border-gold`}
                      style={{
                        borderTopWidth: p.includes("top") ? 2 : 0,
                        borderBottomWidth: p.includes("bottom") ? 2 : 0,
                        borderLeftWidth: p.includes("left") ? 2 : 0,
                        borderRightWidth: p.includes("right") ? 2 : 0,
                      }}
                    />
                  ),
                )}
              </div>

              {/* Scanning line */}
              {(phase === "capturing" || phase === "extracting" || phase === "matching") && (
                <div className="absolute left-[18%] right-[18%] h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_12px_var(--color-gold)] face-scan-line" />
              )}

              {/* Grid overlay */}
              <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

              <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-destructive/80 text-destructive-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> REC
                </span>
                <span className="px-1.5 py-0.5 rounded bg-background/70 text-muted-foreground">
                  CAM-01 · 1080p · 30fps
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {phase === "idle" || phase === "done" ? (
                <button
                  onClick={phase === "done" ? reset : run}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
                >
                  <Camera className="w-4 h-4" />{" "}
                  {phase === "done" ? "Scan another" : "Start face scan"}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary/70 text-primary-foreground font-medium"
                >
                  <Loader2 className="w-4 h-4 animate-spin" /> Scanning…
                </button>
              )}
              <button className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-border hover:bg-accent transition text-sm">
                <Upload className="w-4 h-4" /> Upload
              </button>
            </div>

            <div className="mt-4 text-[11px] text-muted-foreground border-t border-border pt-3 leading-relaxed">
              All biometric requests are signed, RBAC-scoped, and logged. Templates never leave the
              National Biometric Index — only a match score is returned.
            </div>
          </div>

          {/* Pipeline + result */}
          <div className="space-y-4">
            {/* Pipeline */}
            <div className="glass rounded-xl p-5">
              <div className="font-semibold mb-4 flex items-center gap-2">
                <ScanFace className="w-4 h-4 text-gold" /> Recognition pipeline
              </div>
              <div className="space-y-3">
                {STEPS.map((s, i) => {
                  const order: Phase[] = ["capturing", "extracting", "matching", "done"];
                  const cur = order.indexOf(phase);
                  const me = order.indexOf(s.k as Phase);
                  const state =
                    phase === "idle"
                      ? "idle"
                      : me < cur
                        ? "done"
                        : me === cur
                          ? "active"
                          : "pending";
                  return (
                    <div key={s.k} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono ${
                          state === "done"
                            ? "bg-success/20 text-success border border-success/40"
                            : state === "active"
                              ? "bg-primary/20 text-primary border border-primary/40"
                              : "bg-accent text-muted-foreground border border-border"
                        }`}
                      >
                        {state === "done" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : state === "active" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className="text-xs text-muted-foreground font-mono">{s.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Result */}
            <AnimatePresence>
              {phase === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-success" />
                    <div className="font-semibold">Match resolved</div>
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/40">
                      CONFIDENCE {c.faceMatchConfidence}%
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-lg font-bold text-primary-foreground">
                      {c.photoInitial}
                    </div>
                    <div className="flex-1">
                      <div className="font-display font-bold">{c.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {c.nin} · DOB {c.dob} · {c.sex}
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-2 text-xs">
                    {[
                      ["District", c.district],
                      ["Risk score", `${c.riskScore} / 100`],
                      ["Telecom KYC", "3 SIMs · Verified"],
                      ["Vehicles", `${c.vehicles.length} registered`],
                      ["Properties", `${c.properties.length} parcels`],
                      [
                        "Criminal",
                        c.criminal.length === 0 ? "Clear" : `${c.criminal.length} case(s)`,
                      ],
                    ].map(([k, v]) => (
                      <div key={k} className="glass rounded p-2">
                        <div className="uppercase tracking-wider text-[10px] text-muted-foreground">
                          {k}
                        </div>
                        <div className="font-medium">{v}</div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/verify"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Open full dossier <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Capability brag */}
            <div className="glass rounded-xl p-5 grid sm:grid-cols-3 gap-3 text-xs">
              {[
                {
                  i: <Cpu className="w-4 h-4 text-gold" />,
                  t: "ArcFace embeddings",
                  d: "512-dimension vectors · cosine match",
                },
                {
                  i: <Shield className="w-4 h-4 text-gold" />,
                  t: "Liveness detection",
                  d: "Anti-spoof: blink, depth, IR plane",
                },
                {
                  i: <AlertTriangle className="w-4 h-4 text-gold" />,
                  t: "Watchlist alerts",
                  d: "Interpol & UPF flags surfaced live",
                },
              ].map((b) => (
                <div key={b.t} className="flex items-start gap-2">
                  {b.i}
                  <div>
                    <div className="font-semibold">{b.t}</div>
                    <div className="text-muted-foreground">{b.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </InternalShell>
  );
}
