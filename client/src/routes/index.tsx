import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PublicShell } from "@/components/public-shell";
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  Clock3,
  Globe2,
  MessageSquareMore,
  Search,
  Sparkles,
  Lock,
  FileCheck2,
  Building2,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

function Stat({ value, label, suffix }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="glass rounded-lg p-5">
      <div className="text-3xl font-display font-bold tracking-tight">
        {value}
        <span className="text-gold text-xl">{suffix}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Landing() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/45 to-background" />
        <div className="absolute -top-24 right-0 w-130 h-130 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 pt-18 pb-16 lg:pt-24 lg:pb-20 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/50 bg-gold/10 text-gold text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Secure public access for citizens and service seekers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04, duration: 0.55 }}
              className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.04] max-w-4xl"
            >
              One nation. <span className="text-gold">Many ministries.</span>
              <br />
              One secure exchange.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
            >
              NGDXH is Uganda's national data exchange hub for public services. Citizens can verify
              status, request support, and understand services from this homepage, while operational
              tools for officials stay behind a separate secure sign-in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent transition"
              >
                Services <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
              >
                Officer Verification <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/citizen-page"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent transition"
              >
                Citizen Portal <Globe2 className="w-4 h-4" />
              </Link>
              <Link
                to="/company-page"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent transition"
              >
                Company Portal <Building2 className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-gold/50 text-gold hover:bg-gold/10 transition"
              >
                Officer Sign-In <Shield className="w-4 h-4" />
              </Link>
              <Link
                to="/sim-sso"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent transition"
              >
                Simulate SSO <Lock className="w-4 h-4" />
              </Link>
              <Link
                to="/sim-runner"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent transition"
              >
                Run Simulation <Sparkles className="w-4 h-4" />
              </Link>
              <Link
                to="/roles"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent transition"
              >
                Roles & Permissions
              </Link>
            </motion.div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex max-w-full items-start gap-2 px-3 py-1.5 rounded-full border border-border bg-background/70 leading-snug sm:items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Public services only on this
                page
              </span>
              <span className="inline-flex max-w-full items-start gap-2 px-3 py-1.5 rounded-full border border-border bg-background/70 leading-snug sm:items-center">
                <Lock className="w-3.5 h-3.5 text-gold" /> Internal dashboards stay separate
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
            className="glass rounded-2xl p-6 border border-border/80"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-gold">Quick access</div>
                <div className="text-lg font-semibold mt-1">Public portal shortcuts</div>
              </div>
              <MessageSquareMore className="w-5 h-5 text-gold" />
            </div>

            <div className="grid gap-3">
              {[
                {
                  title: "Officer verification",
                  text: "Use the secure gateway to review ministry verification workflows.",
                  icon: Search,
                  to: "/login",
                },
                {
                  title: "Citizen portal",
                  text: "Access personal requests, notifications, and updates.",
                  icon: Globe2,
                  to: "/citizen-page",
                },
                {
                  title: "Company portal",
                  text: "Employer, bank, and school access for restricted verification workflows.",
                  icon: Building2,
                  to: "/company-page",
                },
                {
                  title: "Ask the assistant",
                  text: "Get guided help in plain language before you sign in.",
                  icon: MessageSquareMore,
                  to: "/assistant",
                },
                {
                  title: "Read the security model",
                  text: "Understand how public and internal systems stay separated.",
                  icon: FileCheck2,
                  href: "#security",
                },
              ].map((item) =>
                item.href ? (
                  <a
                    key={item.title}
                    href={item.href}
                    className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/70 p-4 hover:border-gold/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-md bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {item.text}
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link
                    key={item.title}
                    to={item.to ?? "/"}
                    className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/70 p-4 hover:border-gold/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-md bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {item.text}
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="border-y border-border/60 bg-(--color-surface-strong)">
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
          <div className="max-w-3xl mb-10">
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Public services</div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight">
              Quick actions for citizens and service seekers.
            </h2>
            <p className="mt-3 text-muted-foreground">
              The public side stays calm and useful. It presents service options, verification, and
              guidance without exposing internal ministry workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                title: "Service verification",
                text: "Look up the status of permits, requests, and registry checks.",
                to: "/verify",
                icon: CheckCircle2,
              },
              {
                title: "Citizen portal",
                text: "Track submissions and see service updates from one place.",
                to: "/citizen-page",
                icon: Globe2,
              },
              {
                title: "Company portal",
                text: "For employers and institutions that need restricted verification access.",
                to: "/company-page",
                icon: Building2,
              },
              {
                title: "AI assistant",
                text: "Ask questions and get guided help before you talk to an officer.",
                to: "/assistant",
                icon: MessageSquareMore,
              },
              {
                title: "Officer sign-in",
                text: "A separate entry point for authenticated government users.",
                to: "/login",
                icon: Shield,
              },
            ].map((card, index) => (
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

      <section id="security" className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Security model</div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight">
              Public access and internal operations are intentionally separated.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              That is the standard pattern in mature digital government systems: citizens use a
              public website, while officials enter a restricted environment with role-based
              controls, stronger authentication, and audit logging.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "Zero-trust access",
                text: "Internal tools require authenticated officer access, not public browsing.",
              },
              {
                title: "Role-based permissions",
                text: "Each officer sees only the functions and data tied to their role.",
              },
              {
                title: "Audit trail",
                text: "Protected actions are logged for oversight and accountability.",
              },
              {
                title: "Public-safe homepage",
                text: "No live ministry dashboards, logs, or sensitive traffic are shown here.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-5"
              >
                <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Clock3 className="w-4 h-4" />
                </div>
                <div className="font-semibold mb-2">{item.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{item.text}</div>
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
            <Shield className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-3xl font-display font-bold leading-tight text-primary-foreground">
              Citizens get a clean portal. Officials get a separate protected workspace.
            </h3>
            <p className="mt-4 text-primary-foreground/85 leading-relaxed">
              That separation is what makes the platform feel professional, governable, and safe for
              a sensitive public-sector showcase.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/verify"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-gold text-background font-semibold hover:bg-gold/90 transition"
              >
                Start a verification <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-primary-foreground/40 hover:bg-primary-foreground/10 transition"
              >
                Officer sign-in <Lock className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
