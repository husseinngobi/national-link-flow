import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SiteShell } from "@/components/site-shell";
import { MINISTRIES } from "@/lib/ministries";
import { ArrowRight, Shield, Network, Zap, Lock, Activity, TrendingDown, Gauge, Database, CheckCircle2, AlertTriangle, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

function Stat({ value, label, suffix }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="glass rounded-lg p-5">
      <div className="text-3xl font-display font-bold tracking-tight">
        {value}<span className="text-gold text-xl">{suffix}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Landing() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/50 bg-gold/10 text-gold text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            National Innovator Registry · Interoperability & Data Exchange
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.6 }}
            className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] max-w-4xl"
          >
            One nation. <span className="text-gold">Many ministries.</span><br />
            One secure exchange.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
          >
            NGDXH is Uganda's national data exchange hub — connecting NIRA, URA, Health, Lands, Police and every MDA through
            authorized APIs, real-time verification and full audit trails. <span className="text-foreground">Ministries keep their data. Citizens get faster service.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/verify" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 glow transition">
              Launch Verification Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/architecture" className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent transition">
              <Network className="w-4 h-4" /> View Architecture
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-gold/50 text-gold hover:bg-gold/10 transition">
              Ministry Portal
            </Link>
          </motion.div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
            <Stat value="9" label="Connected ministries" />
            <Stat value="1.2" suffix="M" label="Verifications / month" />
            <Stat value="320" suffix="ms" label="Avg response time" />
            <Stat value="99.98" suffix="%" label="Service uptime" />
          </div>
        </div>
      </section>

      {/* CORE MESSAGE */}
      <section className="relative border-y border-border/60 bg-[color:var(--color-surface-strong)]">
        <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">The challenge</div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight">
              "Uganda's challenge is not lack of systems — but <span className="text-gold">disconnected systems.</span>"
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Today, a citizen verifies their identity at NIRA, again at URA, again at the bank, again at the hospital.
              Each ministry holds part of the truth. NGDXH lets those systems speak to each other — securely, with permission, and with a full audit trail.
            </p>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold">Without interoperability</div>
              <span className="text-xs px-2 py-0.5 rounded bg-destructive/20 text-destructive border border-destructive/40">FRAGMENTED</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Row icon={<AlertTriangle className="w-4 h-4 text-destructive" />}>Duplicate citizen databases per ministry</Row>
              <Row icon={<AlertTriangle className="w-4 h-4 text-destructive" />}>Manual paper-based verification</Row>
              <Row icon={<AlertTriangle className="w-4 h-4 text-destructive" />}>Identity fraud and ghost beneficiaries</Row>
              <Row icon={<AlertTriangle className="w-4 h-4 text-destructive" />}>Service delivery delays — days to weeks</Row>
            </div>
            <div className="my-4 h-px gold-divider" />
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold">With NGDXH</div>
              <span className="text-xs px-2 py-0.5 rounded bg-success/20 text-success border border-success/40">CONNECTED</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Row icon={<CheckCircle2 className="w-4 h-4 text-success" />}>Ministries remain owners of their own data</Row>
              <Row icon={<CheckCircle2 className="w-4 h-4 text-success" />}>Real-time authorized API verification</Row>
              <Row icon={<CheckCircle2 className="w-4 h-4 text-success" />}>Fraud detection across agencies</Row>
              <Row icon={<CheckCircle2 className="w-4 h-4 text-success" />}>Citizen service in seconds, not days</Row>
            </div>
          </div>
        </div>
      </section>

      {/* WHY MATTERS */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Why interoperability matters</div>
          <h2 className="text-3xl lg:text-4xl font-display font-bold">A smarter government, by design</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: TrendingDown, title: "Fraud reduction", text: "Cross-agency verification eliminates ghost beneficiaries, double-claims and identity fraud." },
            { icon: Zap, title: "Faster service delivery", text: "Citizens verified in <500 ms — passports, permits, taxes and benefits issued same-day." },
            { icon: Gauge, title: "Smart governance", text: "Data-driven decisions powered by real-time analytics across all connected MDAs." },
            { icon: Lock, title: "Sovereign by design", text: "Ministries own their data. NGDXH brokers consent-based, audited exchange only." },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass rounded-lg p-5">
              <f.icon className="w-6 h-6 text-gold mb-3" />
              <div className="font-semibold mb-1">{f.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{f.text}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MINISTRY GRID */}
      <section className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Connected ministries</div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold">Nine MDAs. One hub. Many services.</h2>
            </div>
            <Link to="/architecture" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              Explore architecture <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
            {MINISTRIES.map((m) => (
              <div key={m.id} className="glass rounded-lg p-4 hover:border-gold/40 transition group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center font-mono text-xs font-bold" style={{ background: m.color + "22", color: m.color, border: `1px solid ${m.color}55` }}>
                    {m.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{m.full}</div>
                  </div>
                  <Database className="w-4 h-4 text-muted-foreground group-hover:text-gold transition" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {m.capabilities.slice(0, 2).map((c) => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-primary to-[color:color-mix(in_oklab,var(--color-primary)_60%,black)] p-10 lg:p-14 text-primary-foreground">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <Shield className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-3xl font-display font-bold leading-tight text-primary-foreground">
              The future of smart governance in Uganda is not <em className="text-gold not-italic">more</em> isolated systems —
              it is <span className="text-gold">secure interoperability</span> between the systems we already have.
            </h3>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/simulation" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-gold text-background font-semibold hover:bg-gold/90 transition">
                <Activity className="w-4 h-4" /> See live exchange
              </Link>
              <Link to="/security" className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-primary-foreground/40 hover:bg-primary-foreground/10 transition">
                <FileCheck2 className="w-4 h-4" /> Security & governance
              </Link>
            </div>
          </div>
        </div>
      </section>

    </SiteShell>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <div className="flex items-start gap-2">{icon}<span>{children}</span></div>;
}
