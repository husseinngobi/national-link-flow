import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { OfficerShell } from "@/components/officer-shell";
import { MINISTRIES, MOCK_CITIZEN } from "@/lib/ministries";
import { postVerify } from "@/lib/api";
import { CheckCircle2, FileLock, Loader2, Search, Shield, User2 } from "lucide-react";

export const Route = createFileRoute("/verify")({ component: VerifyPage });

type Step = { ministry: string; code: string; status: "pending" | "ok"; t?: string };

const MINISTRY_BADGE: Record<string, string> = {
  nira: "bg-[oklch(0.7_0.18_255/0.15)] text-[oklch(0.7_0.18_255)] border-[oklch(0.7_0.18_255/0.4)]",
  ura: "bg-[oklch(0.78_0.14_85/0.15)] text-[oklch(0.78_0.14_85)] border-[oklch(0.78_0.14_85/0.4)]",
  moh: "bg-[oklch(0.7_0.16_155/0.15)] text-[oklch(0.7_0.16_155)] border-[oklch(0.7_0.16_155/0.4)]",
  lands:
    "bg-[oklch(0.65_0.15_35/0.15)] text-[oklch(0.65_0.15_35)] border-[oklch(0.65_0.15_35/0.4)]",
  mowt: "bg-[oklch(0.72_0.12_220/0.15)] text-[oklch(0.72_0.12_220)] border-[oklch(0.72_0.12_220/0.4)]",
  police: "bg-[oklch(0.62_0.2_25/0.15)] text-[oklch(0.62_0.2_25)] border-[oklch(0.62_0.2_25/0.4)]",
  moes: "bg-[oklch(0.7_0.15_195/0.15)] text-[oklch(0.7_0.15_195)] border-[oklch(0.7_0.15_195/0.4)]",
  immig:
    "bg-[oklch(0.68_0.16_305/0.15)] text-[oklch(0.68_0.16_305)] border-[oklch(0.68_0.16_305/0.4)]",
  ucc: "bg-[oklch(0.72_0.12_280/0.15)] text-[oklch(0.72_0.12_280)] border-[oklch(0.72_0.12_280/0.4)]",
};

function VerifyPage() {
  const nav = useNavigate();
  const [nin, setNin] = useState("CM900112ABCDE");
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);
  const [log, setLog] = useState<Step[]>([]);
  const [fallbackRole, setFallbackRole] = useState("agency");

  useEffect(() => {
    setFallbackRole(localStorage.getItem("demo_officer_role") ?? "agency");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("demo_sso_token");
    if (!token) {
      nav({ to: "/login" });
    }
  }, [nav]);

  const run = async () => {
    setLoading(true);
    setShown(false);
    setLog([]);
    try {
      const res = await postVerify(nin);
      const results = res.results || {};
      const now = new Date().toLocaleTimeString();
      setLog(
        MINISTRIES.map((m) => ({
          ministry: m.name,
          code: m.code,
          status: results[m.id] ? "ok" : "pending",
          t: results[m.id] ? now : undefined,
        })),
      );
      setShown(true);
      setLog((items) => [...items, { ministry: "NGDXH", code: "TX", status: "ok", t: res.tx }]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setLog([{ ministry: "NGDXH", code: "ERR", status: "pending", t: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OfficerShell
      roleId="agency"
      roleTitle="Agency Administrator"
      allowedRoles={["agency", "admin"]}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
              Citizen verification
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">
              Verify a citizen by entering a NIN
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Enter a National Identification Number (NIN). NGDXH will fetch authorized verification
              responses from each connected ministry in real time.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-wider text-gold">
              <span>Visible to Agency Administrators and System Auditors</span>
              <span className="text-muted-foreground normal-case tracking-normal">
                NIRA owns the national identity source; this page consumes the result.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              window.history.length > 1
                ? window.history.back()
                : nav({ to: `/dashboard/${fallbackRole}` })
            }
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-3 py-2 text-sm hover:bg-accent transition"
          >
            <Search className="w-4 h-4 rotate-180" /> Back to dashboard
          </button>
        </div>

        <div className="glass rounded-xl p-5 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[260px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={nin}
                onChange={(e) => setNin(e.target.value.toUpperCase())}
                placeholder="Enter National ID / NIN (e.g. CM900112ABCDE)"
                className="w-full pl-10 pr-3 py-3 rounded-md bg-input/40 border border-border font-mono tracking-wider"
              />
            </div>
            <button
              onClick={run}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-60 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying…
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" /> Run verification
                </>
              )}
            </button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Demo NIN: CM900112ABCDE · Mock data only · Verified via secure inter-agency API
            exchange.
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-3">
            <AnimatePresence>
              {shown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-gold flex items-center justify-center text-xl font-bold text-primary-foreground">
                      {MOCK_CITIZEN.photoInitial}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wider text-gold">
                        Verified citizen
                      </div>
                      <div className="text-xl font-display font-bold">{MOCK_CITIZEN.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {MOCK_CITIZEN.nin} · DOB {MOCK_CITIZEN.dob} · {MOCK_CITIZEN.sex} ·{" "}
                        {MOCK_CITIZEN.district}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-success/15 text-success text-xs border border-success/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CROSS-VERIFIED
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid sm:grid-cols-2 gap-3">
              {MINISTRIES.map((m, idx) => {
                const rec = MOCK_CITIZEN.records[m.id];
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: shown ? 1 : 0.4 }}
                    transition={{ delay: idx * 0.04 }}
                    className="glass rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={`w-7 h-7 rounded font-mono text-[10px] font-bold flex items-center justify-center border ${MINISTRY_BADGE[m.id]}`}
                      >
                        {m.code}
                      </div>
                      <div className="text-sm font-semibold flex-1">{m.name}</div>
                      {shown ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success border border-success/40">
                          {rec?.status?.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground">
                          —
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground min-h-[2.4em]">
                      {shown ? rec?.note : "Awaiting authorized response…"}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {shown && (
              <div className="glass rounded-lg p-4 flex items-center gap-3">
                <FileLock className="w-5 h-5 text-gold" />
                <div className="text-sm">
                  Verified via <span className="text-gold">secure inter-agency API exchange</span>.
                  No ministry data was copied or stored at the hub.
                </div>
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-5 h-fit sticky top-24">
            <div className="font-semibold mb-3 flex items-center gap-2">
              <User2 className="w-4 h-4 text-gold" /> Transaction log
            </div>
            <div className="font-mono text-xs space-y-1 max-h-105 overflow-auto">
              {log.length === 0 && (
                <div className="text-muted-foreground italic">Awaiting request…</div>
              )}
              {log.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  {s.status === "pending" ? (
                    <Loader2 className="w-3 h-3 animate-spin text-warning" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-success" />
                  )}
                  <span className="text-muted-foreground">{s.t ?? "…"}</span>
                  <span className="text-gold">[{s.code}]</span>
                  <span>
                    {s.status === "pending"
                      ? "request → ministry adapter"
                      : "200 OK · response signed"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/60 text-[11px] text-muted-foreground">
              Each request is signed (RS256), scoped by RBAC, and persisted to an immutable audit
              log.
            </div>
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}
