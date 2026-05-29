import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";
import { ROLES, MINISTRIES } from "@/lib/ministries";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/roles")({ component: RolesPage });

function RoleCard({ role }: { role: (typeof ROLES)[0] }) {
  const grants = useMemo(() => MINISTRIES.filter((m) => role.grants.includes(m.id)), [role]);
  const denies = useMemo(() => MINISTRIES.filter((m) => role.denies.includes(m.id)), [role]);

  return (
    <div className="glass rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold">{role.title}</div>
          <div className="text-xs text-muted-foreground">{role.desc}</div>
        </div>
        <div className="text-sm font-mono text-muted-foreground">{role.id.toUpperCase()}</div>
      </div>

      <div className="mt-3 grid gap-2">
        <div className="rounded border border-border/60 bg-background/60 p-3 text-xs text-muted-foreground">
          Dashboard focus: queue, inbox, audit trail, and only the authorized ministry scopes for
          this role.
        </div>

        <div>
          <div className="text-xs text-muted-foreground">Granted ministries</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {grants.map((g) => (
              <div key={g.id} className="px-2 py-1 rounded border text-xs bg-background/60">
                <div className="font-medium">{g.code}</div>
                <div className="text-[11px] text-muted-foreground">{g.name}</div>
              </div>
            ))}
            {grants.length === 0 && <div className="text-xs text-muted-foreground">None</div>}
          </div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground">Restricted ministries</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {denies.map((g) => (
              <div
                key={g.id}
                className="px-2 py-1 rounded border text-xs bg-background/60 opacity-80"
              >
                <div className="font-medium">{g.code}</div>
                <div className="text-[11px] text-muted-foreground">{g.name}</div>
              </div>
            ))}
            {denies.length === 0 && <div className="text-xs text-muted-foreground">None</div>}
          </div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground">Key capabilities (sample)</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {grants
              .flatMap((g) => g.capabilities)
              .slice(0, 6)
              .map((c, i) => (
                <span key={i} className="inline-block mr-2 text-xs">
                  • {c}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RolesPage() {
  const nav = useNavigate();

  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Roles & Permissions</h1>
            <p className="text-sm text-muted-foreground mt-2">
              View the showcase roles and the ministries each role can access. This helps make the
              platform's governance model transparent during demonstrations.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              window.history.length > 1 ? window.history.back() : nav({ to: "/login" })
            }
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-3 py-2 text-sm hover:bg-accent transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to authenticate
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {ROLES.map((r) => (
            <RoleCard key={r.id} role={r} />
          ))}
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <Link to="/login" className="text-primary underline">
            Back to authenticate page
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
