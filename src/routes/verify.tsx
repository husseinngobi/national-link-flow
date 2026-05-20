import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SiteShell } from "@/components/site-shell";
import { MINISTRIES, MOCK_CITIZEN } from "@/lib/ministries";
import { Search, Shield, CheckCircle2, Loader2, FileLock, User2 } from "lucide-react";

export const Route = createFileRoute("/verify")({ component: VerifyPage });

type Step = { ministry: string; code: string; status: "pending" | "ok"; t?: string };

function VerifyPage() {
  const [nin, setNin] = useState("CM900112ABCDE");
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);
  const [log, setLog] = useState<Step[]>([]);

  const run = async () => {
    setLoading(true); setShown(false); setLog([]);
    for (const m of MINISTRIES) {
      await new Promise((r) => setTimeout(r, 280));
      setLog((l) => [...l, { ministry: m.name, code: m.code, status: "pending" }]);
      await new Promise((r) => setTimeout(r, 220));
      setLog((l) => l.map((x) => x.code === m.code ? { ...x, status: "ok", t: new Date().toLocaleTimeString() } : x));
    }
    setLoading(false); setShown(true);
  };

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Citizen verification</div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Verify a citizen via secure inter-agency exchange</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">Enter a National Identification Number. NGDXH will fetch authorized verification responses from each connected ministry in real time.</p>
        </div>

        {/* Search */}
        <div className="glass rounded-xl p-5 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[260px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={nin} onChange={(e) => setNin(e.target.value.toUpperCase())} placeholder="Enter NIN (e.g. CM900112ABCDE)"
                className="w-full pl-10 pr-3 py-3 rounded-md bg-input/40 border border-border font-mono tracking-wider" />
            </div>
            <button onClick={run} disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-60 transition">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : <><Shield className="w-4 h-4" /> Run verification</>}
            </button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">Demo NIN: CM900112ABCDE · Mock data only · Verified via secure inter-agency API exchange.</div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Records */}
          <div className="space-y-3">
            <AnimatePresence>
              {shown && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-xl font-bold text-primary-foreground">{MOCK_CITIZEN.photoInitial}</div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wider text-gold">Verified citizen</div>
                      <div className="text-xl font-display font-bold">{MOCK_CITIZEN.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">{MOCK_CITIZEN.nin} · DOB {MOCK_CITIZEN.dob} · {MOCK_CITIZEN.sex} · {MOCK_CITIZEN.district}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-success/15 text-success text-xs border border-success/40 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> CROSS-VERIFIED</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid sm:grid-cols-2 gap-3">
              {MINISTRIES.map((m, idx) => {
                const rec = MOCK_CITIZEN.records[m.id];
                const isShown = shown;
                return (
                  <motion.div key={m.id}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: isShown ? 1 : 0.4 }}
                    transition={{ delay: idx * 0.04 }}
                    className="glass rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded font-mono text-[10px] font-bold flex items-center justify-center" style={{ background: m.color + "22", color: m.color, border: `1px solid ${m.color}55` }}>{m.code}</div>
                      <div className="text-sm font-semibold flex-1">{m.name}</div>
                      {isShown ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success border border-success/40">{rec?.status?.toUpperCase()}</span>
                              : <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground">—</span>}
                    </div>
                    <div className="text-xs text-muted-foreground min-h-[2.4em]">{isShown ? rec?.note : "Awaiting authorized response…"}</div>
                  </motion.div>
                );
              })}
            </div>

            {shown && (
              <div className="glass rounded-lg p-4 flex items-center gap-3">
                <FileLock className="w-5 h-5 text-gold" />
                <div className="text-sm">Verified via <span className="text-gold">secure inter-agency API exchange</span>. No ministry data was copied or stored at the hub.</div>
              </div>
            )}
          </div>

          {/* Live API log */}
          <div className="glass rounded-xl p-5 h-fit sticky top-24">
            <div className="font-semibold mb-3 flex items-center gap-2"><User2 className="w-4 h-4 text-gold" /> Transaction log</div>
            <div className="font-mono text-xs space-y-1 max-h-[420px] overflow-auto">
              {log.length === 0 && <div className="text-muted-foreground italic">Awaiting request…</div>}
              {log.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  {s.status === "pending"
                    ? <Loader2 className="w-3 h-3 animate-spin text-warning" />
                    : <CheckCircle2 className="w-3 h-3 text-success" />}
                  <span className="text-muted-foreground">{s.t ?? "…"}</span>
                  <span className="text-gold">[{s.code}]</span>
                  <span>{s.status === "pending" ? "request → ministry adapter" : "200 OK · response signed"}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/60 text-[11px] text-muted-foreground">
              Each request is signed (RS256), scoped by RBAC, and persisted to an immutable audit log.
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
