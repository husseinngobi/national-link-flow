import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { InternalShell } from "@/components/internal-shell";
import { useOfficerGuard } from "@/lib/officer-session";
import { Zap, GitBranch, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/events")({ component: EventsPage });

type Evt = { id: number; topic: string; producer: string; consumers: string[]; payload: string; t: string };

const TOPICS = [
  { topic: "citizen.address.changed", producer: "NIRA", consumers: ["URA", "MOH", "UCC", "MLHUD"], payload: '{"nin":"CM900112ABCDE","newDistrict":"Wakiso"}' },
  { topic: "citizen.vital.deceased", producer: "MOH", consumers: ["NIRA", "URA", "Pension", "MLHUD"], payload: '{"nin":"CM550118KASES","date":"2026-05-22"}' },
  { topic: "tax.filing.submitted", producer: "URA", consumers: ["MoFPED", "Audit"], payload: '{"tin":"1000452918","fy":"2024/25"}' },
  { topic: "land.title.transferred", producer: "MLHUD", consumers: ["URA", "NIRA", "Audit"], payload: '{"title":"FRV 4521","from":"CM87…","to":"CM92…"}' },
  { topic: "passport.issued", producer: "DCIC", consumers: ["NIRA", "UPF"], payload: '{"passport":"B1234567","nin":"CM900112ABCDE"}' },
  { topic: "vehicle.registered", producer: "MoWT", consumers: ["URA", "UPF", "Insurance"], payload: '{"plate":"UBJ 482K","owner":"CM900112ABCDE"}' },
  { topic: "officer.session.opened", producer: "NGDXH", consumers: ["Audit", "SOC"], payload: '{"officer":"OFC-2026-0118","role":"nira"}' },
];

function EventsPage() {
  const [events, setEvents] = useState<Evt[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const idRef = useRef(0);

  useEffect(() => {
    const i = setInterval(() => {
      const t = TOPICS[Math.floor(Math.random() * TOPICS.length)];
      setEvents((prev) => [{ id: idRef.current++, ...t, t: new Date().toLocaleTimeString().slice(0, 8) }, ...prev].slice(0, 50));
    }, 1300);
    return () => clearInterval(i);
  }, []);

  const filtered = filter === "all" ? events : events.filter((e) => e.topic.startsWith(filter));
  const topics = Array.from(new Set(TOPICS.map((t) => t.topic.split(".")[0])));

  return (
    <InternalShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2 flex items-center gap-2"><GitBranch className="w-3.5 h-3.5" /> Event-driven government · Kafka-grade bus</div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">When one ministry updates, the nation knows.</h1>
          <p className="mt-2 text-muted-foreground max-w-3xl text-sm">
            NGDXH publishes domain events on a national exchange. Authorized ministries subscribe to the topics they need — no more nightly batch jobs, no more stale registries.
            A citizen changes address at NIRA; URA, MoH, UCC and Lands all react in under a second.
          </p>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr_360px] gap-4">
          {/* Topics */}
          <div className="glass rounded-xl p-4">
            <div className="font-semibold mb-3 text-sm">Topics</div>
            <button onClick={() => setFilter("all")} className={`w-full text-left text-xs px-2 py-1.5 rounded mb-1 font-mono ${filter === "all" ? "bg-gold/15 text-gold" : "hover:bg-accent"}`}>all topics</button>
            {topics.map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`w-full text-left text-xs px-2 py-1.5 rounded mb-1 font-mono ${filter === t ? "bg-gold/15 text-gold" : "hover:bg-accent"}`}>{t}.*</button>
            ))}
            <div className="mt-5 text-[10px] uppercase tracking-wider text-muted-foreground">Stats</div>
            <div className="mt-2 space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Throughput</span><span className="font-mono">2.4k/s</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lag</span><span className="font-mono text-success">0ms</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Brokers</span><span className="font-mono">5 (RF=3)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Retention</span><span className="font-mono">90d</span></div>
            </div>
          </div>

          {/* Stream */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold flex items-center gap-2 text-sm"><Zap className="w-4 h-4 text-gold animate-pulse" /> Event stream</div>
              <span className="text-xs text-muted-foreground">{filtered.length} events shown</span>
            </div>
            <div className="font-mono text-xs space-y-1.5 max-h-[560px] overflow-auto pr-1">
              {filtered.map((e) => (
                <div key={e.id} className="border border-border/60 rounded-md p-2.5 bg-card/40">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                    <span>{e.t}</span>
                    <span className="px-1 rounded bg-primary/20 text-primary">{e.producer}</span>
                    <ArrowRight className="w-3 h-3" />
                    {e.consumers.map((c) => (
                      <span key={c} className="px-1 rounded bg-accent">{c}</span>
                    ))}
                  </div>
                  <div className="text-gold text-[11px]">{e.topic}</div>
                  <div className="text-foreground/80 text-[11px] truncate">{e.payload}</div>
                </div>
              ))}
              {filtered.length === 0 && <div className="text-muted-foreground p-4 text-center">Waiting for events…</div>}
            </div>
          </div>

          {/* Flow example */}
          <div className="glass rounded-xl p-4">
            <div className="font-semibold mb-3 text-sm">Cascade example</div>
            <div className="text-xs text-muted-foreground mb-3">Address change at NIRA — single event, four authorized reactions.</div>
            <ol className="space-y-3 text-xs">
              {[
                { t: "0ms", a: "NIRA", txt: "publishes citizen.address.changed" },
                { t: "+18ms", a: "URA", txt: "updates taxpayer service area" },
                { t: "+22ms", a: "MOH", txt: "re-assigns nearest referral facility" },
                { t: "+27ms", a: "UCC", txt: "syncs SIM KYC district" },
                { t: "+31ms", a: "MLHUD", txt: "updates correspondence address" },
                { t: "+40ms", a: "Audit", txt: "seals event in immutable ledger" },
              ].map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-mono text-gold w-12 shrink-0">{s.t}</span>
                  <span className="font-mono text-primary w-12 shrink-0">{s.a}</span>
                  <span>{s.txt}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 p-3 rounded-md border border-gold/30 bg-gold/5 text-xs">
              <div className="text-gold font-semibold mb-1">Why this matters</div>
              No more nightly reconciliations. No more stale data. One source of truth, propagated in real time — with full audit history.
            </div>
          </div>
        </div>
      </div>
    </InternalShell>
  );
}
