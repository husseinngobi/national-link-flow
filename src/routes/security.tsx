import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Lock, Shield, FileText, Key, Eye, ShieldCheck, ServerCog, UserCheck, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/security")({
  component: SecPage,
  head: () => ({
    meta: [
      { title: "Security & Privacy — NGDXH" },
      { name: "description", content: "How NGDXH protects your data: zero-trust security, encryption, consent and full audit." },
    ],
  }),
});

const PILLARS = [
  { icon: Lock, t: "End-to-end encryption", d: "Every message between you, ministries and the hub is protected by TLS 1.3 and AES-256. No one in between can read your data." },
  { icon: UserCheck, t: "Consent-based sharing", d: "Your records belong to you. Ministries only access what they need, only when authorized, and only for the service you requested." },
  { icon: Key, t: "Strict access control", d: "Government officers are bound to specific roles. A Health officer cannot see your tax records. A Police officer cannot see your medical history." },
  { icon: FileText, t: "Full audit trail", d: "Every access is recorded and sealed in an immutable ledger. You and the Auditor General can verify who looked at what — forever." },
  { icon: ShieldCheck, t: "Zero-trust architecture", d: "The public website is completely separated from internal government operations. Multi-factor authentication is required for every officer." },
  { icon: Eye, t: "Privacy by design", d: "NGDXH does not store your personal records. It only brokers authorized exchanges between the ministries that already hold them." },
];

function SecPage() {
  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Security &amp; privacy</div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Trust is the platform.</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            NGDXH is built on layered defences and the principle of least privilege. Aligned with the
            Uganda Data Protection &amp; Privacy Act 2019 and international standards including ISO 27001.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {PILLARS.map((p) => (
            <div key={p.t} className="glass rounded-xl p-6">
              <div className="w-10 h-10 rounded-md bg-gold/15 text-gold flex items-center justify-center mb-4"><p.icon className="w-5 h-5" /></div>
              <div className="font-display font-semibold mb-2">{p.t}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{p.d}</div>
            </div>
          ))}
        </div>

        {/* Compliance row */}
        <div className="glass rounded-xl p-6 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <div className="font-display font-semibold">Compliance &amp; oversight</div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            {[
              "Uganda Data Protection & Privacy Act 2019",
              "ISO/IEC 27001 — Information Security",
              "NIST Zero-Trust Architecture",
              "NITA-U Interoperability Framework",
            ].map((s) => (
              <div key={s} className="border border-border rounded p-3 text-muted-foreground">{s}</div>
            ))}
          </div>
        </div>

        {/* Report */}
        <div className="glass rounded-xl p-6 border-warning/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-1" />
            <div>
              <div className="font-display font-semibold">See something suspicious?</div>
              <p className="text-sm text-muted-foreground mt-1">
                Report fraud, identity theft or misuse confidentially. Every report is reviewed by the
                NGDXH governance team and the Personal Data Protection Office.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <a href="mailto:gdr@ict.go.ug" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Email gdr@ict.go.ug</a>
                <a href="tel:0800100000" className="px-4 py-2 rounded-md border border-border hover:bg-accent">Call 0800 100 000</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
