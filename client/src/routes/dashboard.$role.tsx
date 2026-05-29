import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { OfficerShell } from "@/components/officer-shell";
import { ROLES, MINISTRIES } from "@/lib/ministries";
import {
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  Inbox,
  MessageSquareText,
  Network,
  ShieldAlert,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/$role")({ component: Dashboard });

const FEED = [
  { t: "12:42:08", m: "NIRA", a: "Identity verification request received" },
  { t: "12:42:09", m: "HUB", a: "RBAC check passed · scope:identity.read" },
  { t: "12:42:10", m: "URA", a: "Tax compliance verified · TIN match" },
  { t: "12:42:11", m: "LANDS", a: "Ownership record validated · 2 parcels" },
  { t: "12:42:12", m: "AUDIT", a: "Transaction TX-CB1A92F8 securely logged" },
];

const ROLE_QUEUE: Record<
  string,
  { request: string; citizen: string; scope: string; status: string }[]
> = {
  agency: [
    { request: "TX-9182AC", citizen: "CM9001…BCDE", scope: "identity.read", status: "Verified" },
    { request: "TX-9182AD", citizen: "CM8704…F2A1", scope: "tax.compliance", status: "Verified" },
    { request: "TX-9182AE", citizen: "CM9512…77E0", scope: "lands.owner", status: "Pending" },
    { request: "TX-9182AF", citizen: "CM8809…AA13", scope: "education.cert", status: "Verified" },
    {
      request: "TX-9182B0",
      citizen: "CM7711…0DA2",
      scope: "criminal.clearance",
      status: "Restricted",
    },
  ],
  admin: [
    { request: "TX-9182AC", citizen: "CM9001…BCDE", scope: "identity.read", status: "Verified" },
    { request: "TX-9182AD", citizen: "CM8704…F2A1", scope: "tax.compliance", status: "Verified" },
    { request: "TX-9182AE", citizen: "CM9512…77E0", scope: "lands.owner", status: "Pending" },
    { request: "TX-9182AF", citizen: "CM8809…AA13", scope: "education.cert", status: "Verified" },
    {
      request: "TX-9182B0",
      citizen: "CM7711…0DA2",
      scope: "criminal.clearance",
      status: "Restricted",
    },
  ],
  immig: [
    { request: "IM-4411AA", citizen: "CM9001…BCDE", scope: "passport.status", status: "Verified" },
    { request: "IM-4411AB", citizen: "CM8704…F2A1", scope: "visa.records", status: "Pending" },
    { request: "IM-4411AC", citizen: "CM9512…77E0", scope: "border.crossings", status: "Verified" },
  ],
  nira: [
    { request: "NI-7711AA", citizen: "CM9001…BCDE", scope: "identity.read", status: "Verified" },
    { request: "NI-7711AB", citizen: "CM8704…F2A1", scope: "nin.validation", status: "Pending" },
    { request: "NI-7711AC", citizen: "CM9512…77E0", scope: "biometric.match", status: "Verified" },
  ],
  ura: [
    { request: "UR-5511AA", citizen: "CM9001…BCDE", scope: "tax.compliance", status: "Verified" },
    { request: "UR-5511AB", citizen: "CM8704…F2A1", scope: "vat.status", status: "Pending" },
  ],
  lands: [
    { request: "LA-3311AA", citizen: "CM9001…BCDE", scope: "lands.owner", status: "Verified" },
    { request: "LA-3311AB", citizen: "CM8704…F2A1", scope: "title.validation", status: "Pending" },
  ],
  mowt: [
    { request: "TR-2211AA", citizen: "CM9001…BCDE", scope: "permit.check", status: "Verified" },
    {
      request: "TR-2211AB",
      citizen: "CM8704…F2A1",
      scope: "vehicle.registration",
      status: "Pending",
    },
  ],
  police: [
    {
      request: "PO-1111AA",
      citizen: "CM9001…BCDE",
      scope: "criminal.clearance",
      status: "Restricted",
    },
    { request: "PO-1111AB", citizen: "CM8704…F2A1", scope: "case.status", status: "Pending" },
  ],
  moes: [
    {
      request: "ED-9911AA",
      citizen: "CM9001…BCDE",
      scope: "certificate.verify",
      status: "Verified",
    },
    { request: "ED-9911AB", citizen: "CM8704…F2A1", scope: "academic.records", status: "Pending" },
  ],
  ucc: [
    { request: "UC-8811AA", citizen: "CM9001…BCDE", scope: "sim.lookup", status: "Verified" },
    { request: "UC-8811AB", citizen: "CM8704…F2A1", scope: "telecom.records", status: "Pending" },
  ],
};

const ROLE_FEED: Record<string, { t: string; m: string; a: string }[]> = {
  agency: FEED,
  admin: FEED,
  immig: [
    { t: "12:42:08", m: "DCIC", a: "Passport check request received" },
    { t: "12:42:09", m: "HUB", a: "RBAC check passed · scope:passport.status" },
    { t: "12:42:10", m: "DCIC", a: "Visa record confirmed · record found" },
    { t: "12:42:11", m: "AUDIT", a: "Immigration transaction logged" },
  ],
  nira: [
    { t: "12:42:08", m: "NIRA", a: "NIN lookup received" },
    { t: "12:42:09", m: "HUB", a: "RBAC check passed · scope:identity.read" },
    { t: "12:42:10", m: "NIRA", a: "Biometric match verified" },
    { t: "12:42:11", m: "AUDIT", a: "Identity transaction logged" },
  ],
};

const ROLE_NOTIFICATIONS: Record<string, { title: string; body: string; time: string }[]> = {
  agency: [
    { title: "Inbox update", body: "3 new verification requests need attention.", time: "3m" },
    { title: "Audit receipt", body: "TX-CB1A92F8 has been sealed for review.", time: "11m" },
    {
      title: "Policy reminder",
      body: "Check restricted scope requests before approval.",
      time: "21m",
    },
  ],
  admin: [
    { title: "Admin inbox", body: "6 agency messages are waiting in your queue.", time: "2m" },
    { title: "Cross-ministry alert", body: "A lands + NIRA request needs escalation.", time: "8m" },
    { title: "Receipt export", body: "Download the latest signed audit bundle.", time: "18m" },
  ],
  immig: [
    { title: "Incoming request", body: "Passport status lookup from DCIC is pending.", time: "4m" },
    { title: "Message", body: "Border crossing feed refreshed successfully.", time: "12m" },
  ],
  nira: [
    { title: "Incoming request", body: "Two NIN validation requests are queued.", time: "3m" },
    { title: "Message", body: "Biometric match service returned a verified result.", time: "16m" },
  ],
  ura: [
    { title: "Incoming request", body: "Tax compliance checks need a response.", time: "5m" },
    { title: "Message", body: "VAT status fetch completed for the last batch.", time: "20m" },
  ],
  lands: [
    {
      title: "Incoming request",
      body: "Two title validation tasks are awaiting sign-off.",
      time: "6m",
    },
    { title: "Message", body: "Ownership records have been verified.", time: "14m" },
  ],
  mowt: [
    { title: "Incoming request", body: "Permit checks are waiting in the queue.", time: "5m" },
    { title: "Message", body: "Vehicle registration lookup returned a match.", time: "19m" },
  ],
  police: [
    {
      title: "Restricted request",
      body: "Criminal clearance access is blocked for this role.",
      time: "2m",
    },
    { title: "Inbox note", body: "Review the case status lookup exception list.", time: "13m" },
  ],
  moes: [
    {
      title: "Incoming request",
      body: "Certificate verification requests are queued.",
      time: "4m",
    },
    { title: "Message", body: "Academic records query completed with limited scope.", time: "15m" },
  ],
  ucc: [
    {
      title: "Incoming request",
      body: "Telecom records checks are waiting for processing.",
      time: "7m",
    },
    { title: "Message", body: "SIM lookup audit receipt is ready.", time: "17m" },
  ],
};

function Dashboard() {
  const { role } = useParams({ from: "/dashboard/$role" });
  const r = ROLES.find((x) => x.id === role) ?? ROLES[0];
  const granted = MINISTRIES.filter((m) => r.grants.includes(m.id));
  const denied = MINISTRIES.filter((m) => r.denies.includes(m.id));
  const isAdmin = r.grants.length === MINISTRIES.length;
  const queue = ROLE_QUEUE[r.id] ?? ROLE_QUEUE.agency;
  const feed = ROLE_FEED[r.id] ?? FEED;
  const notifications = ROLE_NOTIFICATIONS[r.id] ?? ROLE_NOTIFICATIONS.agency;
  const visibleMinistries = isAdmin ? MINISTRIES : granted;

  return (
    <OfficerShell roleId={r.id} roleTitle={r.title} isAdmin={isAdmin}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div id="overview" className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
              Authenticated session
            </div>
            <h1 className="text-2xl font-display font-bold">{r.title} · Dashboard</h1>
            <div className="text-sm text-muted-foreground">
              Officer ID OFC-2026-0118 · Session expires in 14:52 · Scope{" "}
              {isAdmin ? "all agencies" : r.title}
            </div>
          </div>
          <div className="glass rounded-xl border border-border/70 px-4 py-3 min-w-[280px] max-w-full">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-gold" />
              <div className="text-xs uppercase tracking-wider text-gold">Notifications</div>
              <span className="ml-auto inline-flex items-center rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold">
                {notifications.length} new
              </span>
            </div>
            <div className="space-y-2">
              {notifications.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-border/60 bg-background/70 p-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2">
                        <Inbox className="w-3.5 h-3.5 text-gold" /> {item.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{item.body}</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {item.time} ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { l: "Requests today", v: "248" },
            { l: "Avg latency", v: "318ms" },
            { l: "Authorized scopes", v: r.grants.length.toString() },
            { l: "Audit events", v: "1,402" },
          ].map((k) => (
            <div key={k.l} className="glass rounded-lg p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</div>
              <div className="text-2xl font-display font-bold mt-1">{k.v}</div>
            </div>
          ))}
        </div>

        {(r.id === "agency" || r.id === "admin") && (
          <div
            id="command-center"
            className="mb-6 glass rounded-2xl p-5 border border-gold/30 bg-gold/5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-gold mb-1">
                  Command center
                </div>
                <div className="font-semibold text-lg">AI fraud and architecture controls</div>
                <div className="text-sm text-muted-foreground max-w-2xl mt-1">
                  This is the visible hub for auditors and agency administrators. Use it to open the
                  fraud console, inspect the federation map, and move between internal review
                  surfaces without leaving the dashboard workflow.
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/fraud-detection"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                >
                  <ShieldAlert className="w-4 h-4" /> Open AI fraud console
                </Link>
                <Link
                  to="/architecture"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-4 py-2 text-sm font-medium hover:bg-accent transition"
                >
                  <Network className="w-4 h-4" /> Open architecture map
                </Link>
                <Link
                  to="/verify"
                  className="inline-flex items-center gap-2 rounded-md border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/15 transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Open verification workspace
                </Link>
                <Link
                  to="/simulation"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-4 py-2 text-sm font-medium hover:bg-accent transition"
                >
                  Open simulation lab
                </Link>
              </div>
            </div>
          </div>
        )}

        {(r.id === "agency" || r.id === "admin") && (
          <div className="mb-6 glass rounded-xl p-5 border border-gold/30 bg-gold/5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-gold mb-1">
                Internal intelligence
              </div>
              <div className="font-semibold">Fraud and anomaly review console</div>
              <div className="text-sm text-muted-foreground">
                Review cross-ministry alerts, identity anomalies, and officer behaviour signals.
              </div>
            </div>
            <Link
              to="/fraud-detection"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Open intelligence console
            </Link>
          </div>
        )}

        {r.id === "nira" && (
          <div className="mb-6 glass rounded-xl p-5 border border-primary/30 bg-primary/5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-primary mb-1">
                Biometric workflow
              </div>
              <div className="font-semibold">Face and fingerprint simulation</div>
              <div className="text-sm text-muted-foreground">
                Open the NIRA biometric console to showcase face scan and fingerprint matching.
              </div>
            </div>
            <Link
              to="/face-scan"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Open biometric console
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Permissions */}
          <div id="access" className="glass rounded-xl p-5">
            <div className="font-semibold mb-3">Role-based access</div>
            <div className="text-xs uppercase tracking-wider text-success mb-2">Authorized</div>
            <ul className="space-y-1.5 mb-4">
              {visibleMinistries.map((m) => (
                <li key={m.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="font-mono text-xs text-muted-foreground w-14">{m.code}</span>
                  {m.name}
                </li>
              ))}
            </ul>
            <div className="text-xs uppercase tracking-wider text-destructive mb-2">Restricted</div>
            <ul className="space-y-1.5">
              {denied.length === 0 && (
                <li className="text-xs text-muted-foreground italic">
                  No restrictions (administrator)
                </li>
              )}
              {denied.map((m) => (
                <li key={m.id} className="flex items-center gap-2 text-sm opacity-70">
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span className="font-mono text-xs text-muted-foreground w-14">{m.code}</span>
                  {m.name}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-[11px] text-muted-foreground border-t border-border/60 pt-3">
              Example: Health officers cannot read criminal records. Police cannot read medical
              history. Enforced at the gateway. Administrators see all agencies.
            </div>
          </div>

          {/* Pending verification queue */}
          <div id="queue" className="glass rounded-xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">
                {isAdmin ? "Verification requests" : `${r.title} queue`}
              </div>
              <span className="text-xs text-muted-foreground">
                {isAdmin ? "Last 24h" : "Role scope only"}
              </span>
            </div>
            <div className="overflow-hidden rounded border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-accent/50 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="text-left p-2.5">Request</th>
                    <th className="text-left p-2.5">Citizen</th>
                    <th className="text-left p-2.5">Scope</th>
                    <th className="text-left p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {queue.map((row, i) => (
                    <tr key={i} className="border-t border-border/60">
                      <td className="p-2.5">{row.request}</td>
                      <td className="p-2.5">{row.citizen}</td>
                      <td className="p-2.5">{row.scope}</td>
                      <td className="p-2.5">
                        <StatusPill s={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!isAdmin && (
              <div className="mt-3 text-[11px] text-muted-foreground">
                This queue only shows the scope assigned to {r.title}.
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-5 lg:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquareText className="w-4 h-4 text-gold" />
              <div className="font-semibold">Inbox messages</div>
              <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> sync live
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              {notifications.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/60 bg-background/70 p-4"
                >
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <MessageSquareText className="w-4 h-4" />
                    <div className="font-medium">{item.title}</div>
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed">{item.body}</div>
                  <div className="mt-3 text-[11px] text-muted-foreground">
                    Received {item.time} ago
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit log */}
          <div id="audit" className="glass rounded-xl p-5 lg:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gold" />
              <div className="font-semibold">Live audit trail</div>
              <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> tail -f
              </span>
            </div>
            <div className="font-mono text-xs space-y-1 mono-surface rounded p-3 border border-border/60">
              {feed.map((f, i) => (
                <div key={i}>
                  <span className="text-muted-foreground">{f.t}</span>{" "}
                  <span className="text-gold">[{f.m}]</span> {f.a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}

function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    Verified: "bg-success/15 text-success border-success/40",
    Pending: "bg-warning/15 text-warning border-warning/40",
    Restricted: "bg-destructive/15 text-destructive border-destructive/40",
    Authorized: "bg-primary/15 text-primary border-primary/40",
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] ${map[s] ?? ""}`}>
      {s.toUpperCase()}
    </span>
  );
}
