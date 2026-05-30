import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  ShieldCheck,
  BadgeInfo,
  LogIn,
  Sparkles,
  Headphones,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import coatOfArms from "@/assets/coat-of-arms.png";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/company-page", label: "Company Portal" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/citizen", label: "Citizen Portal" },
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="bg-(--color-surface-strong) border-b border-border text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            Republic of Uganda · Public Digital Services Portal
          </span>
          <span className="hidden md:inline-flex items-center gap-2 font-mono">
            <BadgeInfo className="w-3.5 h-3.5" />
            Public information only
          </span>
        </div>
        <div className="h-0.5 flex">
          <div className="flex-1 bg-foreground" />
          <div className="flex-1 bg-gold" />
          <div className="flex-1 bg-destructive" />
        </div>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/90 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={coatOfArms}
              alt="Republic of Uganda coat of arms"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
            />
            <div className="leading-tight min-w-0">
              <div className="font-display font-bold text-sm tracking-wide">NGDXH</div>
              <div className="hidden sm:block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Public service portal
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {NAV_ITEMS.map((item) => {
              if ("href" in item) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                  >
                    {item.label}
                  </a>
                );
              }

              const active = path === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gold/40 bg-gold/10 text-sm text-gold hover:bg-gold/15 transition"
            >
              <LogIn className="w-4 h-4" /> Officer Gateway
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-border hover:bg-accent transition"
              aria-label="Toggle navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95">
            <div className="max-w-7xl mx-auto px-4 py-3 grid gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-3 py-2 rounded-md text-sm hover:bg-accent/60 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="mt-1 inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gold bg-gold/10 border border-gold/30 hover:bg-gold/15 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Officer Gateway
              </Link>
            </div>
          </div>
        )}
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
              Public portal for citizen services, verification, and help. Internal ministry
              operations remain in a separate secured environment.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-gold">
              Public Services
            </div>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>Service verification</li>
              <li>Citizen portal</li>
              <li>Company portal</li>
              <li>AI assistant</li>
              <li>Help center</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-gold">
              Security
            </div>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>Public and internal separation</li>
              <li>Role-based access</li>
              <li>Organization verification profiles</li>
              <li>Audit logging for officials</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-gold">
              Officer Access
            </div>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>Email-delivered gateway code</li>
              <li>Restricted operational tools</li>
              <li>Internal dashboards not public</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © 2026 Republic of Uganda · Ministry of ICT &amp; National Guidance · Public showcase
          prototype
        </div>
      </footer>
    </div>
  );
}
