import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { OfficerShell } from "@/components/officer-shell";
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
  Fingerprint,
} from "lucide-react";

export const Route = createFileRoute("/face-scan")({ component: FaceScanPage });

type Phase = "idle" | "capturing" | "extracting" | "matching" | "done";
type BiometricMode = "face" | "fingerprint";

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
  const nav = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<BiometricMode>("face");

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
  const isFingerprint = mode === "fingerprint";

  return (
    <OfficerShell
      roleId="nira"
      roleTitle="NIRA Biometric Officer"
      allowedRoles={["nira", "agency", "admin"]}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2 inline-flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" /> NIRA biometric verification
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">
              Biometric verification workspace
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              This is the internal NIRA biometric console. Face and fingerprint verification are
              controlled by NIRA officers, with limited downstream matching available to UPF and
              DCIC through NGDXH when policy allows.
            </p>
            <div className="mt-4 inline-flex rounded-full border border-border/70 bg-background/70 p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode("face");
                  setPhase("idle");
                }}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
                  !isFingerprint ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <ScanFace className="w-3.5 h-3.5" /> Face scan
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("fingerprint");
                  setPhase("idle");
                }}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
                  isFingerprint ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" /> Fingerprint
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              window.history.length > 1
                ? window.history.back()
                : nav({ to: "/dashboard/$role", params: { role: "nira" } })
            }
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-3 py-2 text-sm hover:bg-accent transition"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to dashboard
          </button>
        </div>

        <div className="grid lg:grid-cols-[440px_1fr] gap-6">
          {/* Camera */}
          <div className="glass rounded-xl p-5">
            <div className="aspect-square rounded-lg overflow-hidden relative bg-[color:var(--color-surface-strong)] border border-border">
              {isFingerprint ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-52 h-52 rounded-[44%] border-2 border-gold/60 bg-[radial-gradient(circle_at_center,rgba(255,215,107,0.14),transparent_45%),repeating-radial-gradient(circle_at_center,rgba(255,215,107,0.52)_0_2px,transparent_2px_11px)] shadow-[inset_0_0_40px_rgba(255,215,107,0.12)]">
                      <div className="absolute inset-[14%] rounded-[42%] border border-gold/45" />
                      <div className="absolute inset-[26%] rounded-[40%] border border-gold/45" />
                      <div className="absolute inset-[38%] rounded-[38%] border border-gold/45" />
                      <div className="absolute inset-[50%] rounded-full border border-gold/45" />
                    </div>
                  </div>
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/80 border border-border px-2 py-1 text-[10px] font-mono text-gold">
                    <Fingerprint className="w-3.5 h-3.5" /> fingerprint_0.992 · ridge count 142
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 rounded-md border border-border/70 bg-background/80 px-3 py-2 text-[11px] text-muted-foreground">
                    Simulated fingerprint capture and ridge matching for NIRA officer review.
                  </div>
                </>
              ) : (
                <>
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
                      (p) => {
                        const classes = [
                          p.includes("top") ? "border-t-2" : "",
                          p.includes("bottom") ? "border-b-2" : "",
                          p.includes("left") ? "border-l-2" : "",
                          p.includes("right") ? "border-r-2" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");
                        return (
                          <span
                            key={p}
                            className={`absolute ${p} w-3 h-3 border-gold ${classes}`}
                          />
                        );
                      },
                    )}
                  </div>
                </>
              )}

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
                  {isFingerprint ? (
                    <Fingerprint className="w-4 h-4" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}{" "}
                  {phase === "done"
                    ? "Scan another"
                    : isFingerprint
                      ? "Start fingerprint scan"
                      : "Start face scan"}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary/70 text-primary-foreground font-medium"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isFingerprint ? "Scanning fingerprint…" : "Scanning…"}
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
                    {isFingerprint ? (
                      <Fingerprint className="w-4 h-4 text-success" />
                    ) : (
                      <Shield className="w-4 h-4 text-success" />
                    )}
                    <div className="font-semibold">
                      {isFingerprint ? "Fingerprint match resolved" : "Match resolved"}
                    </div>
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
                      ["Telecom KYC", isFingerprint ? "3 SIMs · Verified" : "3 SIMs · Verified"],
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

                  <button
                    type="button"
                    onClick={() =>
                      window.history.length > 1
                        ? window.history.back()
                        : nav({ to: "/dashboard/$role", params: { role: "nira" } })
                    }
                    className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    Return to NIRA dashboard <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Capability brag */}
            <div className="glass rounded-xl p-5 grid sm:grid-cols-3 gap-3 text-xs">
              {[
                {
                  i: <Cpu className="w-4 h-4 text-gold" />,
                  t: "Face embeddings",
                  d: "512-dimension vectors · cosine match",
                },
                {
                  i: <Fingerprint className="w-4 h-4 text-gold" />,
                  t: "Fingerprint ridges",
                  d: "Live capture · ridge count · template match",
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
    </OfficerShell>
  );
}
