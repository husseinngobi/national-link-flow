import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { InternalShell } from "@/components/internal-shell";
import { useOfficerGuard } from "@/lib/officer-session";
import { MINISTRIES, MOCK_CITIZEN } from "@/lib/ministries";
import {
  Search,
  Shield,
  CheckCircle2,
  Loader2,
  FileLock,
  User2,
  Car,
  Home as HomeIcon,
  Receipt,
  GraduationCap,
  Briefcase,
  Plane,
  Smartphone,
  Gavel,
  HeartPulse,
  Users as UsersIcon,
} from "lucide-react";

export const Route = createFileRoute("/verify")({ component: VerifyPage });

type Step = { ministry: string; code: string; status: "pending" | "ok"; t?: string };

function VerifyPage() {
  const __guard = useOfficerGuard();
  if (!__guard.ready) return null;
  const [nin, setNin] = useState("CM900112ABCDE");
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);
  const [log, setLog] = useState<Step[]>([]);

  const run = async () => {
    setLoading(true);
    setShown(false);
    setLog([]);
    for (const m of MINISTRIES) {
      await new Promise((r) => setTimeout(r, 240));
      setLog((l) => [...l, { ministry: m.name, code: m.code, status: "pending" }]);
      await new Promise((r) => setTimeout(r, 180));
      setLog((l) =>
        l.map((x) =>
          x.code === m.code ? { ...x, status: "ok", t: new Date().toLocaleTimeString() } : x,
        ),
      );
    }
    setLoading(false);
    setShown(true);
  };

  const c = MOCK_CITIZEN;

  return (
    <InternalShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
            Citizen verification
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">
            Verify a citizen via secure inter-agency exchange
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Enter a National Identification Number. NGDXH will fetch authorized verification
            responses from each connected ministry in real time and assemble a complete profile.
          </p>
        </div>

        {/* Search */}
        <div className="glass rounded-xl p-5 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[260px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={nin}
                onChange={(e) => setNin(e.target.value.toUpperCase())}
                placeholder="Enter NIN (e.g. CM900112ABCDE)"
                className="w-full pl-10 pr-3 py-3 rounded-md bg-input border border-border font-mono tracking-wider"
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
          {/* Records */}
          <div className="space-y-3">
            <AnimatePresence>
              {shown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-xl font-bold text-primary-foreground">
                      {c.photoInitial}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <div className="text-xs uppercase tracking-wider text-gold">
                        Verified citizen
                      </div>
                      <div className="text-xl font-display font-bold">{c.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {c.nin} · DOB {c.dob} · {c.sex} · {c.district}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-success/15 text-success text-xs border border-success/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CROSS-VERIFIED
                    </span>
                  </div>

                  {/* Bio strip */}
                  <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {[
                      ["Tribe", c.tribe],
                      ["Religion", c.religion],
                      ["Marital", c.maritalStatus],
                      ["Dependants", String(c.dependants)],
                      ["Phone", c.phone],
                      ["Email", c.email],
                      ["Parish", c.parish],
                      ["Village", c.village],
                    ].map(([k, v]) => (
                      <div key={k} className="glass rounded-md p-2.5">
                        <div className="uppercase tracking-wider text-[10px] text-muted-foreground">
                          {k}
                        </div>
                        <div className="font-medium truncate">{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Family */}
                  <div className="mt-4 glass rounded-md p-3 text-xs">
                    <div className="flex items-center gap-2 mb-1.5 text-gold uppercase tracking-wider text-[10px]">
                      <UsersIcon className="w-3 h-3" /> Family graph
                    </div>
                    <div className="grid sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-muted-foreground">Father · </span>
                        {c.father}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mother · </span>
                        {c.mother}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Spouse · </span>
                        {c.spouse}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Per-ministry status pills */}
            <div className="grid sm:grid-cols-2 gap-3">
              {MINISTRIES.map((m, idx) => {
                const rec = MOCK_CITIZEN.records[m.id];
                const isShown = shown;
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: isShown ? 1 : 0.4 }}
                    transition={{ delay: idx * 0.04 }}
                    className="glass rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="w-7 h-7 rounded font-mono text-[10px] font-bold flex items-center justify-center"
                        style={{
                          background: m.color + "22",
                          color: m.color,
                          border: `1px solid ${m.color}55`,
                        }}
                      >
                        {m.code}
                      </div>
                      <div className="text-sm font-semibold flex-1">{m.name}</div>
                      {isShown ? (
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
                      {isShown ? rec?.note : "Awaiting authorized response…"}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Rich dossier */}
            {shown && (
              <div className="grid md:grid-cols-2 gap-3">
                <DossierCard
                  icon={<Car className="w-4 h-4 text-gold" />}
                  title="Vehicles & permits (MoWT)"
                >
                  {c.vehicles.map((v) => (
                    <Row key={v.plate} l={v.plate} r={`${v.make} · ${v.color}`} sub={v.status} />
                  ))}
                </DossierCard>

                <DossierCard
                  icon={<HomeIcon className="w-4 h-4 text-gold" />}
                  title="Land & property (MLHUD)"
                >
                  {c.properties.map((p) => (
                    <Row key={p.title} l={p.title} r={p.location} sub={`${p.type} · ${p.size}`} />
                  ))}
                </DossierCard>

                <DossierCard
                  icon={<Receipt className="w-4 h-4 text-gold" />}
                  title="Tax history (URA)"
                >
                  {c.taxHistory.map((t) => (
                    <Row
                      key={t.year}
                      l={t.year}
                      r={`${t.paye} PAYE · ${t.vat} VAT`}
                      sub={t.status}
                    />
                  ))}
                </DossierCard>

                <DossierCard
                  icon={<Gavel className="w-4 h-4 text-gold" />}
                  title="Criminal record (UPF · Judiciary)"
                >
                  {c.criminal.length === 0 ? (
                    <div className="text-xs text-success flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> No criminal cases on file
                    </div>
                  ) : (
                    c.criminal.map((cr) => (
                      <Row
                        key={cr.caseNo}
                        l={cr.caseNo}
                        r={cr.offence}
                        sub={`${cr.status} · ${cr.date}`}
                      />
                    ))
                  )}
                </DossierCard>

                <DossierCard
                  icon={<GraduationCap className="w-4 h-4 text-gold" />}
                  title="Education (MoES)"
                >
                  {c.education.map((e) => (
                    <Row key={e.award} l={e.award} r={e.institution} sub={e.year} />
                  ))}
                </DossierCard>

                <DossierCard icon={<Briefcase className="w-4 h-4 text-gold" />} title="Employment">
                  {c.employment.map((e) => (
                    <Row
                      key={e.employer}
                      l={e.role}
                      r={e.employer}
                      sub={`Since ${e.since} · ${e.status}`}
                    />
                  ))}
                </DossierCard>

                <DossierCard
                  icon={<Smartphone className="w-4 h-4 text-gold" />}
                  title="Telecom (UCC)"
                >
                  {c.telecom.map((t) => (
                    <Row
                      key={t.msisdn}
                      l={t.msisdn}
                      r={`${t.network} · KYC ${t.kyc}`}
                      sub={`Registered ${t.since}`}
                    />
                  ))}
                </DossierCard>

                <DossierCard
                  icon={<Plane className="w-4 h-4 text-gold" />}
                  title="Travel history (DCIC)"
                >
                  {c.travel.map((t) => (
                    <Row key={t.date} l={t.date} r={t.port} sub={`${t.carrier} · ${t.purpose}`} />
                  ))}
                </DossierCard>

                <DossierCard
                  icon={<HeartPulse className="w-4 h-4 text-gold" />}
                  title="Health (MoH · restricted)"
                >
                  {c.health.map((h) => (
                    <Row key={h.visit} l={h.visit} r={h.facility} sub={`${h.note} · ${h.flag}`} />
                  ))}
                  <div className="mt-2 text-[10px] text-warning border border-warning/40 rounded px-2 py-1">
                    Visible only to Health Officers and Agency Administrators · RBAC enforced
                  </div>
                </DossierCard>
              </div>
            )}

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

          {/* Live API log */}
          <div className="glass rounded-xl p-5 h-fit lg:sticky lg:top-24">
            <div className="font-semibold mb-3 flex items-center gap-2">
              <User2 className="w-4 h-4 text-gold" /> Transaction log
            </div>
            <div className="font-mono text-xs space-y-1 max-h-[420px] overflow-auto">
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
            <div className="mt-4 pt-4 border-t border-border text-[11px] text-muted-foreground">
              Each request is signed (RS256), scoped by RBAC, and persisted to an immutable audit
              log.
            </div>
          </div>
        </div>
      </div>
    </InternalShell>
  );
}

function DossierCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ l, r, sub }: { l: string; r: string; sub?: string }) {
  return (
    <div className="text-xs border-b border-border last:border-0 pb-2 last:pb-0">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono">{l}</span>
        <span className="text-muted-foreground text-right truncate">{r}</span>
      </div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}
