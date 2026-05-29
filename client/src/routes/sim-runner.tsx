import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/sim-runner")({ component: SimRunner });

type SimEvent = {
  t: string;
  ministry: string;
  auditId: number;
  latency?: number;
};

type Receipt = { payload?: { id?: string } } | { error: string } | null;

function SimRunner() {
  const [running, setRunning] = useState(false);
  const [rateMs, setRateMs] = useState(2000);
  const [logs, setLogs] = useState<SimEvent[]>([]);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<Receipt>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/sim/runner/status");
      const json = await res.json();
      setRunning(Boolean(json.running));
      setRateMs(json.rateMs ?? 2000);
    } catch (err) {
      console.error("fetchStatus failed", err);
    }
  }

  async function fetchLogs() {
    try {
      const res = await fetch("/api/sim/runner/logs");
      const json = await res.json();
      setLogs(Array.isArray(json.logs) ? json.logs : []);
    } catch (err) {
      console.error("fetchLogs failed", err);
    }
  }

  async function fetchReceipt(auditId: number) {
    setReceiptLoading(true);
    setReceipt(null);
    try {
      const res = await fetch(`/api/audit/receipt/${auditId}`);
      const json = await res.json();
      setReceipt(json);
    } catch (err) {
      console.error("fetchReceipt failed", err);
      setReceipt({ error: "failed" });
    } finally {
      setReceiptLoading(false);
    }
  }

  function downloadReceipt() {
    if (!receipt) return;
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const id =
      receipt && typeof receipt === "object" && "payload" in receipt
        ? (receipt.payload?.id ?? "unknown")
        : "unknown";
    a.download = `audit-receipt-${id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function assumePersona(role: string) {
    setBusy(true);
    try {
      const body = { actor: role === "citizen" ? "citizen" : "officer", role };
      const res = await fetch(`${API_BASE_URL}/api/sim/sso/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json?.token) {
        localStorage.setItem("demo_sso_token", json.token);
        localStorage.setItem("demo_nin", "CM900112ABCDE");
      }
    } catch (err) {
      console.error("assumePersona failed", err);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    fetchLogs();
    const t = setInterval(() => fetchLogs(), 3000);
    return () => clearInterval(t);
  }, []);

  async function start() {
    setBusy(true);
    try {
      const res = await fetch("/api/sim/runner/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rateMs: Number(rateMs) }),
      });
      await fetchStatus();
      await fetchLogs();
    } catch (err) {
      console.error("start runner failed", err);
    } finally {
      setBusy(false);
    }
  }

  async function stop() {
    setBusy(true);
    try {
      await fetch("/api/sim/runner/stop", { method: "POST" });
      await fetchStatus();
    } catch (err) {
      console.error("stop runner failed", err);
    } finally {
      setBusy(false);
    }
  }

  const displayReceiptId =
    receipt && typeof receipt === "object" && "payload" in receipt
      ? (receipt.payload?.id ?? "unknown")
      : "unknown";

  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-3">Continuous Simulation Runner</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Start or stop a continuous synthetic workload that calls simulated ministry adapters and
          records audit events. Use the rate to control frequency.
        </p>

        <div className="grid gap-3 mb-4">
          <label htmlFor="rateMs" className="text-sm">
            Rate (ms between events)
          </label>
          <input
            id="rateMs"
            aria-label="Rate in milliseconds between events"
            value={rateMs}
            onChange={(e) => setRateMs(Number(e.target.value))}
            className="input w-40"
          />

          <div className="flex gap-2">
            <button onClick={start} disabled={busy || running} className="btn-primary">
              Start
            </button>
            <button onClick={stop} disabled={busy || !running} className="btn">
              Stop
            </button>
            <Link to="/sim-sso" className="btn">
              Simulate SSO
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <div className="text-xs text-muted-foreground">Quick personas (sets demo SSO token)</div>
          <div className="flex gap-2">
            <button onClick={() => assumePersona("citizen")} className="btn">
              Citizen
            </button>
            <button onClick={() => assumePersona("nira")} className="btn">
              NIRA Officer
            </button>
            <button onClick={() => assumePersona("police")} className="btn">
              Police Officer
            </button>
            <button onClick={() => assumePersona("admin")} className="btn">
              System Auditor
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="font-semibold mb-2">Recent simulated events</div>
          <div className="text-xs text-muted-foreground mb-2">Updates every 3s</div>
          <div className="space-y-2 font-mono text-sm">
            {logs.length === 0 && <div className="text-muted-foreground">No events yet</div>}
            {logs.map((l, i) => (
              <div key={i} className="rounded p-2 border border-border/60 bg-background/70">
                <div className="text-xs text-muted-foreground">{l.t}</div>
                <div className="flex items-center justify-between">
                  <div>
                    Ministry: {l.ministry} · Audit: {l.auditId} · {l.latency}ms
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs btn" onClick={() => fetchReceipt(l.auditId)}>
                      View receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {receipt && (
          <div className="mt-6 rounded p-3 border bg-background/60">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Audit Receipt · ID {displayReceiptId}</div>
              <div className="flex gap-2">
                <button className="btn" onClick={() => setReceipt(null)}>
                  Close
                </button>
                <button className="btn-primary" onClick={downloadReceipt}>
                  Download
                </button>
              </div>
            </div>
            {receiptLoading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : (
              <pre className="text-xs font-mono max-h-64 overflow-auto">
                {JSON.stringify(receipt, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
