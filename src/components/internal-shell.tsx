import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Radar, Search, Brain, Network, Route as RouteIcon, GitBranch, Activity,
  BarChart3, FileText, Lock, ScanFace, ShieldAlert, LogOut, ChevronDown, Bot,
} from "lucide-react";
import { useEffect, useState } from "react";
import coatOfArms from "@/assets/coat-of-arms.png";
import { clearOfficerSession, getOfficerSession } from "@/lib/officer-session";

const OPS_PRIMARY = [
  { to: "/command-center", label: "Command Center", icon: Radar },
  { to: "/verify", label: "Verify Citizen", icon: Search },
  { to: "/fraud-detection", label: "AI Fraud", icon: Brain },
  { to: "/threat-monitoring", label: "Threats", icon: ShieldAlert },
  { to: "/architecture", label: "Architecture", icon: Network },
];

const OPS_MORE = [
  { to: "/api-gateway", label: "API Gateway", icon: RouteIcon },
  { to: "/events", label: "Event Bus", icon: GitBranch },
  { to: "/simulation", label: "Live Exchange", icon: Activity },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/audit", label: "Audit Ledger", icon: FileText },
  { to: "/face-scan", label: "Face Scan", icon: ScanFace },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
];

export function InternalShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const [session, setSession] = useState(getOfficerSession());

  // Force dark theme on the internal ops surface
  useEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");
    html.classList.add("dark");
    setSession(getOfficerSession());
    return () => {
      if (!wasDark) html.classList.remove("dark");
    };
  }, []);

  const signOut = () => {
    clearOfficerSession();
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Classified banner */}
      <div className="bg-destructive/15 border-b border-destructive/40 text-[11px]">
        <div className="max-w-[1600px] mx-auto px-4 py-1 flex items-center justify-between font-mono">
          <span className="flex items-center gap-2 text-destructive">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            RESTRICTED · GOVERNMENT OPERATIONS NETWORK · ZERO-TRUST CHANNEL
          </span>
          <span className="hidden md:flex items-center gap-3 text-muted-foreground">
            <span>SOC monitoring · all actions logged</span>
            <span className="text-gold">●</span> mTLS · MFA · RBAC
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/85 border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={coatOfArms} alt="Uganda coat of arms" className="w-8 h-8 object-contain" />
            <div className="leading-tight">
              <div className="font-display font-bold text-sm tracking-wide">
                NGDXH <span className="text-gold">· OPS</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Interoperability Operations Center
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {OPS_PRIMARY.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
                    active
                      ? "bg-gold/15 text-gold border border-gold/40"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60 border border-transparent"
                  }`}
                >
                  <n.icon className="w-3.5 h-3.5" /> {n.label}
                </Link>
              );
            })}
            <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
              <button
                onMouseEnter={() => setMoreOpen(true)}
                onClick={() => setMoreOpen((o) => !o)}
                className="px-3 py-1.5 rounded-md text-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/60 inline-flex items-center gap-1"
              >
                More <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 rounded-md border border-border bg-popover shadow-xl p-1 z-50">
                  {OPS_MORE.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded text-xs ${
                        path === n.to ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                      }`}
                    >
                      <n.icon className="w-3.5 h-3.5" /> {n.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {session && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs">
                <Lock className="w-3 h-3 text-success" />
                <div className="leading-tight">
                  <div className="font-semibold">{session.title}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{session.officerId}</div>
                </div>
              </div>
            )}
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs hover:bg-accent transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>NGDXH Operations · Internal use only · Republic of Uganda</span>
          <span>Session encrypted · TLS 1.3 · AES-256-GCM</span>
        </div>
      </footer>
    </div>
  );
}
