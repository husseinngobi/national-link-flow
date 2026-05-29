import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SiteShell } from "@/components/site-shell";
import {
  ArrowRight, ShieldCheck, Search, Bot, FileCheck2, Languages, Clock,
  Lock, Building2, Users, HeartPulse, Car, GraduationCap, Plane, Receipt,
  Phone, MapPin,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

const QUICK_SERVICES = [
  { icon: FileCheck2, t: "Verify a document", d: "Check the authenticity of a permit, certificate or ID.", to: "/verify-status" },
  { icon: Clock, t: "Track an application", d: "See the real-time status of any government service request.", to: "/verify-status" },
  { icon: Bot, t: "Ask the AI Assistant", d: "Multilingual help for any government service — 24/7.", to: "/assistant" },
  { icon: Users, t: "Citizen portal", d: "Your personal inbox for every ministry interaction.", to: "/citizen" },
];

const POPULAR = [
  { icon: Car, t: "Driving permit renewal", a: "Ministry of Works & Transport" },
  { icon: Plane, t: "Passport application", a: "Immigration · DCIC" },
  { icon: Receipt, t: "Tax clearance certificate", a: "Uganda Revenue Authority" },
  { icon: HeartPulse, t: "NHIS insurance status", a: "Ministry of Health" },
  { icon: GraduationCap, t: "Certificate verification", a: "Ministry of Education" },
  { icon: Building2, t: "Land title verification", a: "Ministry of Lands" },
];

function Landing() {
  return (
    <SiteShell>
      {/* HERO — calm, trustworthy, national */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        <div className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-success/40 bg-success/10 text-success text-xs font-medium"
          >
            <ShieldCheck className="w-3 h-3" /> Official Government Service Portal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.6 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] max-w-4xl"
          >
            Secure government services <br className="hidden sm:inline" />
            for <span className="text-gold">every Ugandan.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
          >
            One trusted gateway to verify documents, track applications and access services from
            every ministry — faster, simpler and safer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/citizen" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition">
              Access Citizen Portal <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent transition">
              Browse all services
            </Link>
          </motion.div>

          {/* Quick search */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-10 max-w-2xl glass rounded-xl p-2 flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-muted-foreground ml-3" />
            <input
              placeholder="Search a service or enter a reference number…"
              className="flex-1 bg-transparent outline-none text-sm px-2 py-2"
            />
            <Link to="/verify-status" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              Search
            </Link>
          </motion.div>
        </div>
      </section>

      {/* QUICK SERVICES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">What you can do today</div>
          <h2 className="text-2xl lg:text-3xl font-display font-bold">Common things citizens do here</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_SERVICES.map((s, i) => (
            <motion.div key={s.t} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={s.to} className="block glass rounded-xl p-5 hover:border-primary/40 transition h-full group">
                <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="font-semibold mb-1">{s.t}</div>
                <div className="text-sm text-muted-foreground">{s.d}</div>
                <div className="mt-3 text-xs text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section className="border-y border-border bg-[color:var(--color-surface-strong)]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Popular services</div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold">Most requested by citizens</h2>
            </div>
            <Link to="/services" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POPULAR.map((p) => (
              <div key={p.t} className="glass rounded-lg p-4 flex items-center gap-3 hover:border-gold/40 transition">
                <div className="w-10 h-10 rounded-md bg-gold/10 text-gold flex items-center justify-center">
                  <p.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{p.t}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Built on trust</div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight">
              Your data stays with your government — <span className="text-gold">protected by design.</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              NGDXH follows a zero-trust security model and separates citizen-facing services from protected
              government operations. Every exchange is encrypted, consent-based and fully audited under the
              Uganda Data Protection &amp; Privacy Act 2019.
            </p>
            <Link to="/security" className="mt-6 inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
              Learn how we protect you <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: Lock, t: "End-to-end encrypted", d: "Every request secured with mTLS &amp; AES-256." },
              { icon: ShieldCheck, t: "Consent-based", d: "Your data is shared only when authorized." },
              { icon: Languages, t: "Multilingual", d: "Services in English, Luganda, Runyankole, Acholi, Lusoga." },
              { icon: FileCheck2, t: "Auditable", d: "Every access is logged — forever." },
            ].map((f) => (
              <div key={f.t} className="glass rounded-lg p-5">
                <f.icon className="w-5 h-5 text-gold mb-3" />
                <div className="font-semibold mb-1">{f.t}</div>
                <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: f.d }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HELP STRIP */}
      <section className="border-t border-border bg-[color:var(--color-surface-strong)]">
        <div className="max-w-7xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gold mt-0.5" />
            <div>
              <div className="font-semibold">Call us</div>
              <div className="text-muted-foreground">Toll free · 0800 100 000 · 24/7</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Bot className="w-5 h-5 text-gold mt-0.5" />
            <div>
              <div className="font-semibold">Chat with NGDXH AI</div>
              <Link to="/assistant" className="text-primary hover:underline">Open assistant →</Link>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gold mt-0.5" />
            <div>
              <div className="font-semibold">Find a service centre</div>
              <Link to="/help" className="text-primary hover:underline">View locations →</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
