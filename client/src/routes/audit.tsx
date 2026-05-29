import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { FileText, Hash, Search, ShieldCheck, User, Filter } from "lucide-react";
import { MINISTRIES } from "@/lib/ministries";

export const Route = createFileRoute("/audit")({ component: AuditPage });

const REASONS = [
  "Citizen verification",
  "Cross-agency lookup",
  "Compliance audit",
  "Fraud investigation",
  "KYC onboarding",
  "Service eligibility",
];
const ACTIONS = [
  "identity.read",
  "tax.read",
  "health.insurance.read",
  "criminal.read",
  "land.read",
  "permit.read",
  "passport.read",
];

function genLog(i: number) {
  const m = MINISTRIES[i % MINISTRIES.length];
  const t = new Date(Date.now() - i * 47_000);
  return {
    id: `TX-${(998213 - i).toString(16).toUpperCase()}`,
    time: t.toLocaleString(),
    officer: `OFC-2026-${(118 + (i % 9)).toString().padStart(4, "0")}`,
    ministry: m.code,
    action: ACTIONS[i % ACTIONS.length],
    target: `NIN CM${900000 + ((i * 37) % 99999)}ABCDE`,
    reason: REASONS[i % REASONS.length],
    result: i % 17 === 0 ? "denied" : "allowed",
    hash: "0x" + Math.random().toString(16).slice(2, 18),
  };
}

function AuditPage() {
  const [q, setQ] = useState("");
  const [ministry, setMinistry] = useState("all");
  const logs = useMemo(() => Array.from({ length: 60 }, (_, i) => genLog(i)), []);
  const filtered = logs.filter(
    (l) =>
      (ministry === "all" || l.ministry === ministry) &&
      (q === "" ||
        l.target.toLowerCase().includes(q.toLowerCase()) ||
        l.officer.toLowerCase().includes(q.toLowerCase()) ||
        l.action.includes(q)),
  );

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Live audit & transparency ledger
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">
            Every request. Every reason. Forever.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl text-sm">
            Each cross-agency exchange is hashed, signed and sealed in an append-only ledger. The
            Auditor General — and the citizen themselves — can verify who accessed what data, when,
            and why.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { l: "Records (24h)", v: "412,108" },
            { l: "Officers active", v: "1,287" },
            { l: "Ledger blocks", v: "98,441" },
            { l: "Tamper attempts", v: "0", c: "text-success" },
          ].map((k) => (
            <div key={k.l} className="glass rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {k.l}
              </div>
              <div className={`text-2xl font-display font-bold mt-1 ${k.c ?? ""}`}>{k.v}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <div className="font-semibold flex items-center gap-2 mr-auto">
              <FileText className="w-4 h-4 text-gold" /> Immutable transaction ledger
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search NIN, officer, action…"
                className="bg-input border border-border rounded-md pl-7 pr-2 py-1.5 text-xs w-64"
              />
            </div>
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                className="bg-input border border-border rounded-md px-2 py-1.5 text-xs"
              >
                <option value="all">All ministries</option>
                {MINISTRIES.map((m) => (
                  <option key={m.id} value={m.code}>
                    {m.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th className="text-left font-medium px-2 py-2">TX</th>
                  <th className="text-left font-medium px-2 py-2">Time</th>
                  <th className="text-left font-medium px-2 py-2">
                    <User className="w-3 h-3 inline -mt-0.5" /> Officer
                  </th>
                  <th className="text-left font-medium px-2 py-2">Ministry</th>
                  <th className="text-left font-medium px-2 py-2">Action</th>
                  <th className="text-left font-medium px-2 py-2">Target</th>
                  <th className="text-left font-medium px-2 py-2">Reason</th>
                  <th className="text-right font-medium px-2 py-2">Result</th>
                  <th className="text-right font-medium px-2 py-2">
                    <Hash className="w-3 h-3 inline -mt-0.5" /> Block
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-border/30 hover:bg-accent/30">
                    <td className="px-2 py-1.5 text-gold">{l.id}</td>
                    <td className="px-2 py-1.5 text-muted-foreground">{l.time}</td>
                    <td className="px-2 py-1.5">{l.officer}</td>
                    <td className="px-2 py-1.5">{l.ministry}</td>
                    <td className="px-2 py-1.5">{l.action}</td>
                    <td className="px-2 py-1.5 text-muted-foreground">{l.target}</td>
                    <td className="px-2 py-1.5 text-muted-foreground font-sans">{l.reason}</td>
                    <td className="px-2 py-1.5 text-right">
                      <span
                        className={`px-1.5 py-0.5 rounded ${l.result === "allowed" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}
                      >
                        {l.result}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-right text-muted-foreground">{l.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {filtered.length} of {logs.length} records · live tail enabled
            </span>
            <span className="font-mono">
              Ledger root: 0xc4f1…a87b · sealed by Auditor General PKI
            </span>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
