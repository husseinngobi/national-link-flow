import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PublicShell } from "@/components/public-shell";
import {
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Languages,
  BellRing,
  CalendarDays,
  ShieldCheck,
  Eye,
  ClipboardCheck,
  FileCheck2,
  Sparkles,
  Globe2,
  Building2,
} from "lucide-react";

export const Route = createFileRoute("/services")({ component: ServicesPage });

const PUBLIC_SERVICES = [
  {
    title: "Officer verification",
    text: "Ministry staff review secure verification workflows through the gateway.",
    icon: ClipboardCheck,
    to: "/login",
  },
  {
    title: "Citizen support",
    text: "Give people a guided place to ask questions before they visit an office.",
    icon: Globe2,
    to: "/assistant",
  },
  {
    title: "Company portal",
    text: "Give employers and institutions a clear place for restricted verification workflows.",
    icon: Building2,
    to: "/company-page",
  },
  {
    title: "Track submissions",
    text: "Show the status of an application without exposing internal systems.",
    icon: BellRing,
    to: "/citizen",
  },
  {
    title: "Book appointments",
    text: "Reduce queues by letting people request a slot before arriving.",
    icon: CalendarDays,
    to: "/citizen",
  },
];

const INNOVATION_FEATURES = [
  {
    title: "Multi-channel access",
    text: "Web, mobile, SMS, and assisted-service workflows for citizens with different levels of connectivity.",
  },
  {
    title: "Multilingual guidance",
    text: "Simple language support so public services are easier to understand and use.",
  },
  {
    title: "Digital notifications",
    text: "Status updates by SMS or email so people do not need to keep checking manually.",
  },
  {
    title: "Consent-based exchange",
    text: "Only the minimum data needed is shared, and only with permission and audit logging.",
  },
  {
    title: "Accessibility-first design",
    text: "Large text, strong contrast, clear actions, and predictable page flow for public use.",
  },
  {
    title: "Queue and appointment control",
    text: "Reduce congestion at public offices by moving simple tasks online first.",
  },
];

function ServicesPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-45" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/45 to-background" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-175 h-175 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 pt-18 pb-16 lg:pt-24 lg:pb-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/50 bg-gold/10 text-gold text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Public services for citizens, not internal dashboards
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04, duration: 0.55 }}
              className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.04] max-w-4xl"
            >
              Services designed for
              <span className="text-gold"> public use.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
            >
              This page collects the citizen-facing services in one place. It is the public entry
              point for verification, support, tracking, and service guidance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
              >
                Officer sign-in <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent transition"
              >
                Back to home <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-gold/50 text-gold hover:bg-gold/10 transition"
              >
                Officer sign-in <ShieldCheck className="w-4 h-4" />
              </Link>
              <Link
                to="/company-page"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent transition"
              >
                Company portal <Building2 className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
            className="glass rounded-2xl p-6 border border-border/80"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-gold">
              What people should see
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Simple service choices.</p>
              <p>Clear status checks.</p>
              <p>Help and guidance before sign-in.</p>
              <p>One clean place to understand what NGDXH does for the public.</p>
            </div>
            <div className="mt-5 rounded-xl border border-border/70 bg-background/70 p-4">
              <div className="font-semibold text-sm mb-2">Public rule</div>
              <div className="text-sm text-muted-foreground">
                This page must not expose ministry traffic, audit logs, or operational dashboards.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-(--color-surface-strong)">
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
          <div className="max-w-3xl mb-10">
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Public services</div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight">
              Fast actions for the public.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Citizens should be able to understand the service, check status, and get help without
              being dropped into the internal government workspace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {PUBLIC_SERVICES.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={card.to}
                  className="block glass rounded-xl p-5 hover:border-gold/50 transition group h-full"
                >
                  <div className="w-11 h-11 rounded-md bg-gold/10 text-gold flex items-center justify-center mb-4">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-lg mb-2 group-hover:text-gold transition">
                    {card.title}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{card.text}</div>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs text-primary group-hover:gap-2 transition-all">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
              Innovation features
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight">
              Features inspired by mature digital public services.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              These are the kinds of service features you often see in advanced government portals:
              low-friction access, status visibility, and clear separation between public services
              and internal operations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {INNOVATION_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-5"
              >
                <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
                  {index % 2 === 0 ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Languages className="w-4 h-4" />
                  )}
                </div>
                <div className="font-semibold mb-2">{feature.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{feature.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-linear-to-br from-primary to-[color-mix(in_oklab,var(--color-primary)_60%,black)] p-10 lg:p-14 text-primary-foreground">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <FileCheck2 className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-3xl font-display font-bold leading-tight text-primary-foreground">
              Services should feel obvious, safe, and useful.
            </h3>
            <p className="mt-4 text-primary-foreground/85 leading-relaxed">
              The public sees services. Officials see the protected workspace only after sign-in.
              That is the professional separation you want for a government system.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
