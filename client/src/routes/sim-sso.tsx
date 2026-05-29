import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/sim-sso")({ component: SimSsoPage });

function SimSsoPage() {
  type DemoResult = {
    error?: string;
    token?: string;
    actor?: string;
    role?: string;
    org?: string;
    expiresAt?: string;
  } | null;
  const [actor, setActor] = useState("citizen");
  const [role, setRole] = useState("");
  const [org, setOrg] = useState("Demo Org");
  const [result, setResult] = useState<DemoResult>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/sim/sso/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actor, role, org }),
      });
      const json = await res.json();
      setResult(json);
      if (json?.token) {
        // make it easy to simulate calls: store demo token and demo nin
        localStorage.setItem("demo_sso_token", json.token);
        localStorage.setItem("demo_nin", "CM900112ABCDE");
      }
    } catch (err) {
      setResult({ error: "network" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Simulated SSO (demo)</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Use this page to create a demo SSO token for prototype flows. Tokens are not real
          credentials — they only help simulate authenticated requests inside the showcase.
        </p>

        <div className="grid gap-3">
          <label className="text-sm" htmlFor="actor">
            Actor
          </label>
          <select
            id="actor"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            className="input"
          >
            <option value="citizen">Citizen</option>
            <option value="officer">Officer</option>
            <option value="auditor">Auditor</option>
          </select>

          <label className="text-sm" htmlFor="role">
            Role (optional)
          </label>
          <input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input"
            placeholder="e.g. police_officer"
          />

          <label className="text-sm" htmlFor="org">
            Organization
          </label>
          <input id="org" value={org} onChange={(e) => setOrg(e.target.value)} className="input" />

          <div className="flex gap-2">
            <button onClick={() => submit()} disabled={busy} className="btn-primary">
              {busy ? "Creating token..." : "Create demo token"}
            </button>
            <Link to="/" className="btn">
              Back
            </Link>
          </div>

          {result && (
            <div className="mt-4 rounded-md p-3 border bg-background/60">
              {result.error ? (
                <div className="text-destructive">Error: {String(result.error)}</div>
              ) : (
                <div>
                  <div className="font-medium">Token created</div>
                  <div className="text-sm text-muted-foreground">Actor: {result.actor}</div>
                  <div className="text-sm">Role: {result.role}</div>
                  <div className="text-sm">Org: {result.org}</div>
                  <div className="text-sm">Token: {result.token}</div>
                  <div className="text-sm text-muted-foreground">Expires: {result.expiresAt}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
