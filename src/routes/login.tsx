import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteShell } from "@/components/site-shell";
import { ROLES, DEMO_CREDENTIALS, DEMO_PIN } from "@/lib/ministries";
import { setOfficerSession } from "@/lib/officer-session";
import { Shield, Lock, ArrowRight, User, KeyRound, Copy, Check, Smartphone, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

const DEMO_OTP = "428193";

function LoginPage() {
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState(ROLES[0].id);
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const cred = DEMO_CREDENTIALS.find((c) => c.role === selected)!;
  const role = ROLES.find((r) => r.id === selected)!;

  useEffect(() => { setError(null); }, [step]);

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key); setTimeout(() => setCopied(null), 1200);
  };

  const submitPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== DEMO_PIN) {
      setError(`Invalid PIN. Demo PIN is ${DEMO_PIN}.`);
      return;
    }
    setOtpSent(true);
    setStep(3);
  };

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== DEMO_OTP) {
      setError(`Invalid OTP. Demo OTP is ${DEMO_OTP}.`);
      return;
    }
    setOfficerSession({
      role: selected,
      title: role.title,
      officerId: cred.officerId,
      signedInAt: new Date().toISOString(),
      mfaVerified: true,
    });
    nav({ to: "/command-center" });
  };

  return (
    <SiteShell>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <Shield className="w-8 h-8 text-gold mx-auto mb-3" />
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Officer & Agency Sign-in</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Authorized government personnel only. Multi-factor authentication and full audit logging are enforced.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 text-xs mb-8">
          {[
            { n: 1, label: "Role" },
            { n: 2, label: "PIN" },
            { n: 3, label: "MFA" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold ${
                step >= s.n ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
              }`}>{s.n}</div>
              <span className={step >= s.n ? "text-foreground font-medium" : "text-muted-foreground"}>{s.label}</span>
              {i < 2 && <div className={`w-10 h-px ${step > s.n ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Role selection */}
        {step === 1 && (
          <div>
            <div className="grid md:grid-cols-3 gap-3 mb-6">
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
            <div className="flex justify-center">
              <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PIN */}
        {step === 2 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={submitPin} className="glass rounded-xl p-6">
              <div className="text-xs uppercase tracking-wider text-gold mb-1">Step 2 · Officer credentials</div>
              <div className="font-semibold mb-4">{role.title}</div>

              <label className="text-xs text-muted-foreground">Officer ID</label>
              <input value={cred.officerId} readOnly className="mt-1 w-full px-3 py-2 rounded bg-input border border-border font-mono text-sm" />

              <label className="text-xs text-muted-foreground mt-3 block">Secure PIN</label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                type="password"
                maxLength={6}
                className="mt-1 w-full px-3 py-2 rounded bg-input border border-border font-mono text-sm tracking-widest"
                autoFocus
              />

              {error && (
                <div className="mt-3 text-xs text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> {error}
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 px-4 py-2.5 rounded-md border border-border hover:bg-accent text-sm">
                  Back
                </button>
                <button type="submit" className="flex-[2] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
                  <Lock className="w-4 h-4" /> Verify PIN
                </button>
              </div>
            </form>

            <CredentialSheet selected={selected} setSelected={setSelected} setPin={setPin} copied={copied} copy={copy} />
          </div>
        )}

        {/* STEP 3: MFA OTP */}
        {step === 3 && (
          <div className="max-w-md mx-auto">
            <form onSubmit={submitOtp} className="glass rounded-xl p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-1">
                <Smartphone className="w-3.5 h-3.5" /> Step 3 · Multi-factor authentication
              </div>
              <div className="font-semibold mb-1">One-time code</div>
              <p className="text-xs text-muted-foreground mb-4">
                A 6-digit code was sent to your registered government device. Enter it below to complete sign-in.
              </p>

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                maxLength={6}
                className="w-full px-3 py-3 rounded bg-input border border-border font-mono text-center text-2xl tracking-[0.5em]"
                autoFocus
              />

              {otpSent && (
                <div className="mt-2 text-[11px] text-success">
                  Demo OTP: <span className="font-mono font-bold">{DEMO_OTP}</span>
                </div>
              )}
              {error && (
                <div className="mt-3 text-xs text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> {error}
                </div>
              )}

              <button type="submit" className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
                <Shield className="w-4 h-4" /> Enter Operations Center <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setStep(2)} className="mt-2 w-full px-4 py-2 rounded-md border border-border text-xs text-muted-foreground hover:bg-accent">
                Back
              </button>
            </form>
          </div>
        )}
      </div>
    </SiteShell>
  );
}

function CredentialSheet({
  selected, setSelected, setPin, copied, copy,
}: {
  selected: string; setSelected: (id: string) => void; setPin: (p: string) => void;
  copied: string | null; copy: (t: string, k: string) => void;
}) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <KeyRound className="w-4 h-4 text-gold" />
        <div className="text-xs uppercase tracking-wider text-gold">Demo credentials</div>
      </div>
      <div className="font-semibold mb-3">Mock officer accounts</div>
      <p className="text-xs text-muted-foreground mb-4">
        Showcase only — all officers share PIN <span className="font-mono text-foreground">{DEMO_PIN}</span>.
        MFA OTP is <span className="font-mono text-foreground">{DEMO_OTP}</span>.
      </p>

      <div className="overflow-hidden rounded border border-border max-h-[340px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-accent text-muted-foreground uppercase sticky top-0">
            <tr><th className="text-left p-2">Role</th><th className="text-left p-2">Officer ID</th><th className="p-2"></th></tr>
          </thead>
          <tbody className="font-mono">
            {DEMO_CREDENTIALS.map((c) => (
              <tr
                key={c.role}
                onClick={() => { setSelected(c.role); setPin(c.pin); }}
                className={`border-t border-border cursor-pointer hover:bg-accent/60 transition ${selected === c.role ? "bg-accent/40" : ""} ${c.role === "agency" ? "text-gold" : ""}`}
              >
                <td className="p-2 font-sans">{c.title}</td>
                <td className="p-2">{c.officerId}</td>
                <td className="p-2 text-right">
                  <button type="button" onClick={(e) => { e.stopPropagation(); copy(`${c.officerId} / ${c.pin}`, c.role); }}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border hover:bg-accent text-[10px]">
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
  );
}
