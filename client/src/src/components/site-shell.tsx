import { Link, useRouterState } from "@tanstack/react-router";
import { LogIn, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import coatOfArms from "@/assets/coat-of-arms.png";
import { useState } from "react";

const PUBLIC_NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/verify-status", label: "Verify Status" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/security", label: "Security" },
  { to: "/help", label: "Help Center" },
  { to: "/citizen", label: "Citizen Portal" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* National banner */}
      <div className="bg-[color:var(--color-surface-strong)] border-b border-border text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success" />
            An official platform of the Republic of Uganda · Ministry of ICT &amp; National Guidance
          </span>
          <span className="hidden sm:flex items-center gap-3 font-mono">
            <span className="text-success">🔒</span> Secure connection
          </span>
        </div>
        <div className="h-[2px] flex">
          <div className="flex-1 bg-foreground" />
          <div className="flex-1 bg-gold" />
          <div className="flex-1 bg-destructive" />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/90 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={coatOfArms}
              alt="Republic of Uganda coat of arms"
              className="w-10 h-10 object-contain"
            />
            <div className="leading-tight">
              <div className="font-display font-bold text-sm tracking-wide">NGDXH</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                National Data Exchange Hub
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {PUBLIC_NAV.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    active
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {/* Subtle officer sign-in — internal staff only */}
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-muted-foreground border border-border/60 hover:border-foreground/40 hover:text-foreground transition"
              title="For authorized government officers only"
            >
              <LogIn className="w-3 h-3" /> Officer Sign-in
            </Link>
            <button
              className="lg:hidden p-2 rounded border border-border"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-1">
              {PUBLIC_NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded text-sm ${
                    path === n.to
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="col-span-2 mt-2 px-3 py-2 rounded text-xs text-center border border-border text-muted-foreground"
              >
                Officer Sign-in
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border mt-20 bg-[color:var(--color-surface-strong)]">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={coatOfArms} alt="" className="w-8 h-8 object-contain" />
              <div className="font-display font-bold text-base">NGDXH</div>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              National Government Data Exchange Hub — secure, citizen-centred digital service
              delivery for the Republic of Uganda.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-gold">
              Services
            </div>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>
                <Link to="/services" className="hover:text-foreground">
                  All services
                </Link>
              </li>
              <li>
                <Link to="/verify-status" className="hover:text-foreground">
                  Verify status
                </Link>
              </li>
              <li>
                <Link to="/citizen" className="hover:text-foreground">
                  Citizen portal
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-foreground">
                  AI assistant
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-gold">
              Trust &amp; Governance
            </div>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>
                <Link to="/security" className="hover:text-foreground">
                  Security &amp; privacy
                </Link>
              </li>
              <li>Data Protection &amp; Privacy Act 2019</li>
              <li>Accessibility statement</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-gold">
              Contact
            </div>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>support@ngdxh.go.ug</li>
              <li>Toll free · 0800 100 000</li>
              <li>Kampala, Uganda</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-[11px] text-muted-foreground">
          © 2026 Republic of Uganda · Ministry of ICT &amp; National Guidance
        </div>
      </footer>
    </div>
  );
}
