import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell, Layers3, LogOut, ShieldCheck, FileText } from "lucide-react";
import { type ReactNode } from "react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

const OFFICER_NAV = [
  { href: "#overview", label: "Overview", icon: Layers3 },
  { href: "#access", label: "Access", icon: ShieldCheck },
  { href: "#queue", label: "Queue", icon: FileText },
  { href: "#audit", label: "Audit", icon: FileText },
  { to: "/architecture", label: "Architecture", icon: Layers3 },
] as const;

type OfficerShellProps = {
  roleId: string;
  roleTitle: string;
  isAdmin?: boolean;
  allowedRoles?: string[];
  children: ReactNode;
};

export function OfficerShell({
  roleId,
  roleTitle,
  isAdmin = false,
  allowedRoles,
  children,
}: OfficerShellProps) {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  const unreadCount = isAdmin ? 6 : 3;

  useEffect(() => {
    async function validate() {
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const hashToken = hash.get("demoToken");
      const hashRole = hash.get("demoRole");
      const hashOfficer = hash.get("demoOfficer");

      if (hashToken) {
        localStorage.setItem("demo_sso_token", hashToken);
        if (hashRole) localStorage.setItem("demo_officer_role", hashRole);
        if (hashOfficer) localStorage.setItem("demo_officer_id", hashOfficer);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.search,
        );
      }

      const token = localStorage.getItem("demo_sso_token");
      const storedRole = localStorage.getItem("demo_officer_role");
      const storedOfficer = localStorage.getItem("demo_officer_id");
      const roleAllowed = !allowedRoles || allowedRoles.includes(storedRole ?? roleId);

      if (!token && storedRole === roleId && storedOfficer && roleAllowed) {
        setChecking(false);
        return;
      }

      if (!token) {
        setChecking(false);
        nav({ to: "/login" });
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/sim/sso/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          // try to capture response body for debugging
          let body = "";
          try {
            body = JSON.stringify(await res.json());
          } catch (e) {
            try {
              body = await res.text();
            } catch (e2) {
              body = "<unreadable>";
            }
          }
          throw new Error(`status:${res.status} body:${body}`);
        }
        const session = await res.json();
        const sessionRole = String(session?.role ?? storedRole ?? roleId);
        if (allowedRoles && !allowedRoles.includes(sessionRole))
          throw new Error("role not allowed");
        setChecking(false);
      } catch (err: any) {
        // debug flag: prevent redirect and surface error details
        const DEBUG_SSO = import.meta.env.VITE_DEBUG_SSO === "true";
        console.error("SSO validate failed:", err?.message ?? err);
        localStorage.removeItem("demo_sso_token");
        if (storedRole === roleId && storedOfficer && roleAllowed) {
          setChecking(false);
          return;
        }

        setChecking(false);
        if (DEBUG_SSO) {
          // show error message instead of navigating away so we can inspect
          // write a visible error to document body for quick troubleshooting
          const el = document.getElementById("ngdxh-sso-debug");
          if (el) el.textContent = String(err?.message ?? err);
          else {
            const debugEl = document.createElement("div");
            debugEl.id = "ngdxh-sso-debug";
            debugEl.style.position = "fixed";
            debugEl.style.left = "12px";
            debugEl.style.bottom = "12px";
            debugEl.style.zIndex = "99999";
            debugEl.style.background = "rgba(0,0,0,0.85)";
            debugEl.style.color = "white";
            debugEl.style.padding = "12px";
            debugEl.style.borderRadius = "6px";
            debugEl.style.maxWidth = "min(90vw,560px)";
            debugEl.style.fontFamily = "monospace";
            debugEl.textContent = String(err?.message ?? err);
            document.body.appendChild(debugEl);
          }
          return;
        }

        nav({ to: "/login" });
      }
    }

    validate();
  }, [nav, allowedRoles, roleId]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="font-medium">Validating demo SSO token…</div>
          <div className="text-sm text-muted-foreground mt-2">
            If you don't have a token, use Simulate SSO.
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/90 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-sm tracking-wide">NGDXH Officer</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {roleTitle} workspace
              </div>
            </div>
            <span className="ml-2 rounded-full border border-border/70 bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {roleId}
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {OFFICER_NAV.map((item) =>
              "to" in item ? (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors inline-flex items-center gap-1.5"
                >
                  <item.icon className="w-3.5 h-3.5" /> {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors inline-flex items-center gap-1.5"
                >
                  <item.icon className="w-3.5 h-3.5" /> {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                  return;
                }

                nav({ to: `/dashboard/${roleId}` });
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border/80 hover:bg-accent transition text-muted-foreground hover:text-foreground"
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
            <button
              type="button"
              className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border/80 hover:bg-accent transition text-muted-foreground hover:text-foreground"
              aria-label="Officer notifications"
              title="Officer notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Inbox</span>
              <span className="absolute -top-1 -right-1 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-background">
                {unreadCount}
              </span>
            </button>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gold/40 bg-gold/10 text-sm text-gold hover:bg-gold/15 transition"
            >
              <LogOut className="w-4 h-4" /> Exit gateway
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
