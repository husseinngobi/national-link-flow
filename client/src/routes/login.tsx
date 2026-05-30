import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PublicShell } from "@/components/public-shell";
import { API_BASE_URL } from "@/lib/api";
import {
  DEMO_CREDENTIALS,
  DEMO_GATEWAY_CODE,
  GATEWAY_CODE_BY_ROLE,
  GATEWAY_MAILBOXES,
  MINISTRIES,
  ROLES,
} from "@/lib/ministries";
import { ArrowRight, CheckCircle2, EyeOff, KeyRound, Lock, Mail, Send, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const nav = useNavigate();
  const [selected, setSelected] = useState(ROLES[0].id);
  const [gatewayEmail, setGatewayEmail] = useState("officer@agency.go.ug");
  const [gatewayCode, setGatewayCode] = useState("");
  const [gatewayRequested, setGatewayRequested] = useState(false);
  const [gatewayUnlocked, setGatewayUnlocked] = useState(false);
  const [gatewayError, setGatewayError] = useState("");
  const [showInbox, setShowInbox] = useState(false);
  const [pin, setPin] = useState("");

  const activeRole = selected;
  const cred = DEMO_CREDENTIALS.find((candidate) => candidate.role === activeRole)!;
  const selectedMailbox =
    GATEWAY_MAILBOXES.find((mailbox) => mailbox.role === activeRole) ?? GATEWAY_MAILBOXES[0];
  const selectedMinistry = MINISTRIES.find((ministry) => ministry.id === activeRole);

  const chooseRoleMailbox = (roleId: string) => {
    const mailbox = GATEWAY_MAILBOXES.find((candidate) => candidate.role === roleId);
    const roleCred = DEMO_CREDENTIALS.find((candidate) => candidate.role === roleId);
    setSelected(roleId);
    setGatewayEmail(mailbox?.email ?? gatewayEmail);
    setGatewayRequested(false);
    setGatewayUnlocked(false);
    setGatewayCode("");
    setGatewayError("");
    setShowInbox(false);
    setPin(roleCred?.pin ?? "");
  };

  const sendCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGatewayRequested(true);
    setGatewayCode("");
    setGatewayError("");
  };

  const verifyCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (gatewayCode.trim() !== (GATEWAY_CODE_BY_ROLE[selected] ?? DEMO_GATEWAY_CODE)) {
      setGatewayError(
        "That code did not match the latest gateway code. Check your email and try again.",
      );
      return;
    }

    setGatewayUnlocked(true);
    setGatewayError("");
  };

  const enterDashboard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem("demo_officer_id", cred.officerId);
    localStorage.setItem("demo_officer_role", selected);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sim/sso/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actor: "officer", role: selected, org: selected }),
      });
      const json = await response.json();
      if (json?.token) {
        localStorage.setItem("demo_sso_token", json.token);
      }
    } catch {
      // keep going for the demo
    }

    await nav({ to: `/dashboard/${selected}` });
  };

  const selectedPin = cred.pin;

  return (
    <PublicShell>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Shield className="w-8 h-8 text-gold mx-auto mb-3" />
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Officer & Agency Sign-in</h1>
          <p className="mt-2 text-muted-foreground">
            Demo government access with gateway code, role selection, and a simulated SSO token.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!gatewayUnlocked && (
            <section className="glass rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <EyeOff className="w-4 h-4 text-gold" />
                <div className="text-xs uppercase tracking-wider text-gold">
                  Step 1 · Gateway access
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose the ministry mailbox for the showcase. These are demo accounts generated in
                code, so no live government inbox access is required.
              </p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROLES.map((role) => {
                  const mailbox = GATEWAY_MAILBOXES.find((candidate) => candidate.role === role.id);
                  const isActive = selected === role.id;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => chooseRoleMailbox(role.id)}
                      className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                        isActive
                          ? "border-gold/70 bg-gold/10 text-foreground"
                          : "border-border/70 bg-background/60 text-muted-foreground hover:text-foreground hover:border-gold/40"
                      }`}
                    >
                      <div className="text-xs font-semibold">{role.title}</div>
                      <div className="mt-1 font-mono text-[10px] break-all">{mailbox?.email}</div>
                    </button>
                  );
                })}
              </div>

              {!gatewayRequested ? (
                <form onSubmit={sendCode} className="mt-5 space-y-3">
                  <label className="block text-xs text-muted-foreground">
                    Government email
                    <input
                      value={gatewayEmail}
                      onChange={(event) => setGatewayEmail(event.target.value)}
                      placeholder={selectedMailbox.email}
                      className="mt-1 w-full px-3 py-2 rounded bg-input border border-border font-mono text-sm"
                    />
                  </label>

                  <div className="rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                    Selected mailbox:{" "}
                    <span className="font-mono text-foreground">{selectedMailbox.email}</span>
                  </div>

                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium">
                    <Send className="w-4 h-4" /> Send gateway code
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyCode} className="mt-5 space-y-3">
                  <label className="block text-xs text-muted-foreground">
                    Gateway code
                    <input
                      value={gatewayCode}
                      onChange={(event) => setGatewayCode(event.target.value)}
                      placeholder="Enter gateway code"
                      className="mt-1 w-full px-3 py-2 rounded bg-input border border-border font-mono text-sm tracking-widest"
                    />
                  </label>

                  {gatewayError && <div className="text-xs text-destructive">{gatewayError}</div>}

                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium">
                    <Lock className="w-4 h-4" /> Verify gateway code{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                <button
                  type="button"
                  onClick={() => {
                    setGatewayRequested(false);
                    setGatewayUnlocked(false);
                    setGatewayCode("");
                    setGatewayError("");
                    setShowInbox(false);
                  }}
                  className="text-gold hover:text-gold/90"
                >
                  Reset demo
                </button>
                <button
                  type="button"
                  onClick={() => setShowInbox((value) => !value)}
                  className="hover:text-foreground"
                >
                  Toggle inbox preview
                </button>
              </div>

              {showInbox && (
                <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm">
                  <div className="text-xs uppercase tracking-wider text-gold mb-2">
                    Demo inbox preview
                  </div>
                  <div className="text-muted-foreground">Selected role: {selected}</div>
                  <div className="mt-1 font-mono text-gold">{selectedMailbox.code}</div>
                  <button
                    type="button"
                    onClick={() => {
                      chooseRoleMailbox(selectedMailbox.role);
                      setGatewayRequested(true);
                      setGatewayCode(selectedMailbox.code);
                    }}
                    className="mt-3 text-xs text-gold hover:text-gold/90"
                  >
                    Use this code
                  </button>
                </div>
              )}
            </section>
          )}

          {gatewayUnlocked ? (
            <section className="glass rounded-xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="w-4 h-4 text-gold" />
                <div className="text-xs uppercase tracking-wider text-gold">
                  Step 2 · Authenticate role
                </div>
              </div>
              <div className="font-semibold mb-1">{selectedMailbox.label}</div>
              <div className="mb-4 text-xs text-muted-foreground">
                Ministry dashboard ready for {selectedMailbox.role}. Complete the PIN and open the
                role workspace.
              </div>

              <label className="block text-xs text-muted-foreground">
                Officer ID
                <input
                  value={cred.officerId}
                  readOnly
                  className="mt-1 w-full px-3 py-2 rounded bg-input border border-border font-mono text-sm"
                />
              </label>

              <label className="block mt-4 text-xs text-muted-foreground">
                Secure PIN
                <span className="ml-2 text-[10px] uppercase tracking-wider text-gold">
                  Auto-filled for showcase
                </span>
                <input
                  value={pin}
                  onChange={(event) => setPin(event.target.value)}
                  placeholder={selectedPin}
                  maxLength={6}
                  className="mt-1 w-full px-3 py-2 rounded bg-input border border-border font-mono text-sm tracking-widest"
                />
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Demo PIN for {selectedMailbox.role}:{" "}
                  <span className="font-mono text-foreground">{selectedPin}</span>. In production,
                  officers would use their own secured credential.
                </div>
              </label>

              <div className="mt-4 rounded-xl border border-border/70 bg-background/60 p-4">
                <div className="text-xs uppercase tracking-wider text-gold mb-2">
                  Dashboard guide
                </div>
                <div className="font-semibold text-sm">
                  {selectedMinistry?.code ?? selectedMailbox.role.toUpperCase()} ·{" "}
                  {selectedMailbox.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {selectedMinistry?.full ?? "Selected ministry dashboard"}
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground">
                  This workspace shows the queue, inbox, permitted scopes, and audit trail for the
                  selected ministry role.
                </div>
                {selectedMinistry && (
                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="text-foreground font-medium">Capabilities:</span>{" "}
                      {selectedMinistry.capabilities.slice(0, 3).join(" · ")}
                    </div>
                    <div>
                      <span className="text-foreground font-medium">Key endpoint:</span>{" "}
                      {selectedMinistry.endpoints[0]?.method} {selectedMinistry.endpoints[0]?.path}
                    </div>
                  </div>
                )}
                <Link
                  to="/roles"
                  className="mt-3 inline-flex items-center gap-2 text-xs text-primary hover:underline"
                >
                  View all roles and dashboard responsibilities
                </Link>
              </div>

              <form onSubmit={enterDashboard} className="mt-5">
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium">
                  <Lock className="w-4 h-4" /> Open {selectedMailbox.role} dashboard{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {selected === "admin"
                  ? "Administrators can see every agency account and switch between ministries."
                  : `Role-scoped access is issued for the ${selectedMailbox.role} ministry dashboard after the SSO token is created.`}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </PublicShell>
  );
}
