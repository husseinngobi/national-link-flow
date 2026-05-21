import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { ROLES, DEMO_CREDENTIALS, DEMO_PIN } from "@/lib/ministries";
import { Shield, Lock, ArrowRight, User, KeyRound, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const nav = useNavigate();
  const [selected, setSelected] = useState(ROLES[0].id);
  const [pin, setPin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const cred = DEMO_CREDENTIALS.find((c) => c.role === selected)!;

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <SiteShell>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <Shield className="w-8 h-8 text-gold mx-auto mb-3" />
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Officer & Agency Sign-in</h1>
          <p className="mt-2 text-muted-foreground">
            Select your role. <span className="text-gold font-medium">Agency Administrator</span> has cross-ministry access; others are scoped by RBAC.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-8">
          {ROLES.map((r) => {
            const active = selected === r.id;
            const isAgency = r.id === "agency";
            return (
              <button key={r.id} onClick={() => setSelected(r.id)}
                className={`glass rounded-lg p-4 text-left transition relative ${
                  active ? "border-gold ring-1 ring-gold" : "hover:border-foreground/30"
                } ${isAgency ? "border-gold/50" : ""}`}>
                {isAgency && (
                  <span className="absolute top-2 right-2 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold/20 text-gold border border-gold/40">
                    Super
                  </span>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center ${isAgency ? "bg-gold/20 text-gold" : "bg-accent"}`}>
                    <User className="w-4 h-4" />
                  </div>
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
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sign-in form */}
          <form
            onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard/$role", params: { role: selected } }); }}
            className="glass rounded-xl p-6"
          >
            <div className="text-xs uppercase tracking-wider text-gold mb-1">Step 2 · Authenticate</div>
            <div className="font-semibold mb-4">{ROLES.find((r) => r.id === selected)?.title}</div>

            <label className="text-xs text-muted-foreground">Officer ID</label>
            <input
              value={cred.officerId}
              readOnly
              className="mt-1 w-full px-3 py-2 rounded bg-input border border-border font-mono text-sm"
            />

            <label className="text-xs text-muted-foreground mt-3 block">Secure PIN</label>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              maxLength={6}
              className="mt-1 w-full px-3 py-2 rounded bg-input border border-border font-mono text-sm tracking-widest"
            />

            <button type="submit" className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition">
              <Lock className="w-4 h-4" /> Enter dashboard <ArrowRight className="w-4 h-4" />
            </button>
            <div className="mt-3 text-[11px] text-muted-foreground text-center">
              Demo: any PIN unlocks the dashboard · Use <span className="font-mono text-gold">{DEMO_PIN}</span> for realism
            </div>
          </form>

          {/* Mock credential cheat-sheet */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="w-4 h-4 text-gold" />
              <div className="text-xs uppercase tracking-wider text-gold">Demo credentials</div>
            </div>
            <div className="font-semibold mb-3">Mock officer accounts</div>
            <p className="text-xs text-muted-foreground mb-4">
              Showcase only — all officers share the same PIN <span className="font-mono text-foreground">{DEMO_PIN}</span>.
              Click a row to load it into the sign-in form.
            </p>

            <div className="overflow-hidden rounded border border-border">
              <table className="w-full text-xs">
                <thead className="bg-accent text-muted-foreground uppercase">
                  <tr>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Officer ID</th>
                    <th className="text-left p-2">PIN</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {DEMO_CREDENTIALS.map((c) => (
                    <tr
                      key={c.role}
                      onClick={() => { setSelected(c.role); setPin(c.pin); }}
                      className={`border-t border-border cursor-pointer hover:bg-accent/60 transition ${
                        selected === c.role ? "bg-accent/40" : ""
                      } ${c.role === "agency" ? "text-gold" : ""}`}
                    >
                      <td className="p-2 font-sans">{c.title}</td>
                      <td className="p-2">{c.officerId}</td>
                      <td className="p-2">{c.pin}</td>
                      <td className="p-2 text-right">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); copy(`${c.officerId} / ${c.pin}`, c.role); }}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border hover:bg-accent text-[10px]"
                        >
                          {copied === c.role ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                          {copied === c.role ? "Copied" : "Copy"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
