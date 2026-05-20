import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { ROLES } from "@/lib/ministries";
import { Shield, Lock, ArrowRight, User } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const nav = useNavigate();
  const [selected, setSelected] = useState(ROLES[0].id);
  const [pin, setPin] = useState("");

  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <Shield className="w-8 h-8 text-gold mx-auto mb-3" />
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Ministry portal sign-in</h1>
          <p className="mt-2 text-muted-foreground">Select your role. Authentication is simulated for showcase.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-8">
          {ROLES.map((r) => (
            <button key={r.id} onClick={() => setSelected(r.id)}
              className={`glass rounded-lg p-4 text-left transition ${
                selected === r.id ? "border-gold/60 ring-1 ring-gold/40" : "hover:border-border"
              }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center"><User className="w-4 h-4" /></div>
                <div>
                  <div className="font-semibold text-sm">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.desc}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success">+{r.grants.length} grants</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/15 text-destructive">−{r.denies.length} restricted</span>
              </div>
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard/$role", params: { role: selected } }); }}
          className="glass rounded-xl p-6 max-w-md mx-auto"
        >
          <div className="text-xs uppercase tracking-wider text-gold mb-1">Step 2 · Authenticate</div>
          <div className="font-semibold mb-4">{ROLES.find((r) => r.id === selected)?.title}</div>
          <label className="text-xs text-muted-foreground">Officer ID</label>
          <input defaultValue="OFC-2026-0118" readOnly className="mt-1 w-full px-3 py-2 rounded bg-input/40 border border-border font-mono text-sm" />
          <label className="text-xs text-muted-foreground mt-3 block">Secure PIN</label>
          <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="•••• ••" maxLength={6} className="mt-1 w-full px-3 py-2 rounded bg-input/40 border border-border font-mono text-sm tracking-widest" />
          <button type="submit" className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition">
            <Lock className="w-4 h-4" /> Enter dashboard <ArrowRight className="w-4 h-4" />
          </button>
          <div className="mt-3 text-[11px] text-muted-foreground text-center">Demo: any PIN is accepted</div>
        </form>
      </div>
    </SiteShell>
  );
}
