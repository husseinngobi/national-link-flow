import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";
import { MINISTRIES } from "@/lib/ministries";

export const Route = createFileRoute("/ministry-map")({ component: MinistryMap });

function MinistryMap() {
  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-3">Ministry Locations</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Simulated locations for each ministry headquarters.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-lg p-4">
            <div className="text-sm mb-3">Map (schematic)</div>
            <div className="w-full h-72 bg-gradient-to-b from-background/80 to-background/60 rounded flex items-center justify-center text-muted-foreground">
              [Uganda map placeholder]
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              This is a schematic. For production use, replace with an interactive map and
              geo-coordinates.
            </div>
          </div>

          <div className="space-y-3">
            {MINISTRIES.map((m) => (
              <div key={m.id} className="glass rounded-lg p-3 flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-gold mt-1" />
                <div>
                  <div className="font-semibold">
                    {m.code} — {m.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{m.full}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Primary capabilities: {m.capabilities.join(", ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-primary underline">
            Back
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
