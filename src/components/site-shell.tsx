import { Link, useRouterState } from "@tanstack/react-router";
import { Network, Activity, BarChart3, Lock, LogIn, Home, Search, ScanFace, Radar, Brain, GitBranch, Route as RouteIcon, FileText, Bot, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import coatOfArms from "@/assets/coat-of-arms.png";
import { useState } from "react";

const PRIMARY_NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/command-center", label: "Command Center", icon: Radar },
  { to: "/verify", label: "Verify", icon: Search },
  { to: "/fraud-detection", label: "AI Fraud", icon: Brain },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
];

const MORE_NAV = [
  { to: "/architecture", label: "Architecture", icon: Network },
  { to: "/api-gateway", label: "API Gateway", icon: RouteIcon },
  { to: "/events", label: "Event Bus", icon: GitBranch },
  { to: "/simulation", label: "Live Exchange", icon: Activity },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/audit", label: "Audit Ledger", icon: FileText },
  { to: "/security", label: "Security", icon: Lock },
  { to: "/face-scan", label: "Face Scan", icon: ScanFace },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top gov banner */}
      <div className="bg-[color:var(--color-surface-strong)] border-b border-border text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Republic of Uganda · Ministry of ICT &amp; National Guidance
          </span>
          <span className="hidden sm:flex items-center gap-3 font-mono">
            <span className="text-gold">●</span> SECURE CHANNEL
            <span>v2.6.0</span>
          </span>
        </div>
        <div className="h-[2px] flex">
          <div className="flex-1 bg-foreground" />
          <div className="flex-1 bg-gold" />
          <div className="flex-1 bg-destructive" />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/85 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={coatOfArms}
              alt="Republic of Uganda coat of arms"
              className="w-10 h-10 object-contain drop-shadow-sm"
            />
            <div className="leading-tight">
              <div className="font-display font-bold text-sm tracking-wide">NGDXH</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">National Data Exchange Hub</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {NAV.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    active ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm hover:bg-accent transition"
            >
              <LogIn className="w-4 h-4" /> Officer Sign-In
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={coatOfArms} alt="" className="w-8 h-8 object-contain" />
              <div className="font-display font-bold text-base">NGDXH</div>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              National Government Data Exchange Hub — secure interoperability between Ugandan ministries, departments, and agencies.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-gold">Platform</div>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>Architecture</li><li>API Catalogue</li><li>Compliance</li><li>Developer Hub</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-gold">Governance</div>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>Data Protection Act 2019</li><li>RBAC Policy</li><li>Audit Framework</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-gold">Contact</div>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>innovators@ict.go.ug</li><li>gdr@ict.go.ug</li><li>Kampala, Uganda</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © 2026 Republic of Uganda · Ministry of ICT &amp; National Guidance · Demo prototype
        </div>
      </footer>
    </div>
  );
}
