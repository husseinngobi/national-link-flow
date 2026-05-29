import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { CheckCircle2, Clock, FileText, Send } from "lucide-react";

export const Route = createFileRoute("/citizen")({ component: CitizenPage });

const REQUESTS = [
  { id: "REQ-2026-0001", t: "Driving permit renewal", s: "Verified", date: "12 May 2026" },
  { id: "REQ-2026-0002", t: "Land title verification", s: "In review", date: "15 May 2026" },
  { id: "REQ-2026-0003", t: "Tax clearance certificate", s: "Verified", date: "18 May 2026" },
  { id: "REQ-2026-0004", t: "Passport renewal", s: "Pending payment", date: "19 May 2026" },
];

function CitizenPage() {
  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Citizen service portal</div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Track your government services</h1>
          <p className="mt-2 text-muted-foreground">One inbox for every ministry. Track applications, verifications and certificates from any connected MDA.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="glass rounded-xl p-5">
            <div className="font-semibold mb-3">Your requests</div>
            <ul className="divide-y divide-border/60">
              {REQUESTS.map((r) => (
                <li key={r.id} className="py-3 flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gold" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{r.t}</div>
                    <div className="text-xs text-muted-foreground font-mono">{r.id} · {r.date}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    r.s === "Verified" ? "bg-success/15 text-success border-success/40"
                    : r.s === "In review" ? "bg-warning/15 text-warning border-warning/40"
                    : "bg-accent text-muted-foreground border-border"}`}>{r.s.toUpperCase()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="font-semibold mb-3">Request a service</div>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <select className="w-full px-3 py-2 rounded bg-input/40 border border-border text-sm">
                <option>Driving permit renewal</option>
                <option>Tax clearance certificate</option>
                <option>Passport renewal</option>
                <option>Land title verification</option>
              </select>
              <input placeholder="Your NIN" className="w-full px-3 py-2 rounded bg-input/40 border border-border font-mono text-sm" />
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm">
                <Send className="w-4 h-4" /> Submit request
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-border/60 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Verified once, accepted everywhere</div>
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gold" /> Average processing: 2.4 hours</div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
