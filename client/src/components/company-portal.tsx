import { Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";
import {
  Bell,
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CircleUserRound,
  ClipboardCheck,
  FileText,
  KeyRound,
  LogOut,
  Search,
  Shield,
  ShieldCheck,
  Users,
  UsersRound,
} from "lucide-react";
import { type FormEvent, useState } from "react";

const DEMO_ORG = {
  name: "Kampala Talent & Finance Partners",
  type: "Employer and financial services partner",
  accessTier: "Restricted verification access",
  status: "Verified organization",
  profileId: "ORG-UG-2048",
  contact: "compliance@ktfp.ug",
  lastAudit: "26 May 2026",
};

const ALLOWED_RESPONSE_FIELDS = ["Full name", "NIN status", "District", "Verification reference"];

const INITIAL_QUEUE = [
  {
    id: "VRF-1024",
    nin: "CM900112ABCDE",
    purpose: "Employment onboarding",
    status: "Approved",
    summary: "Identity confirmed and limited public-safe response returned.",
  },
  {
    id: "VRF-1025",
    nin: "CM870501PQRST",
    purpose: "Bank account opening",
    status: "Pending consent",
    summary: "Waiting for consent code from the applicant.",
  },
];

const AUTHORIZED_USERS = [
  { name: "Amina Nanyonga", role: "Compliance admin", status: "Active" },
  { name: "Brian Okello", role: "HR verifier", status: "Active" },
  { name: "Susan Ayo", role: "Loan ops reviewer", status: "Pending approval" },
];

const ACTIVITY_LOG = [
  {
    label: "Request approved",
    detail: "Limited identity response returned for employment onboarding.",
    time: "08:42",
  },
  {
    label: "Consent pending",
    detail: "Applicant has not yet approved the bank account opening check.",
    time: "09:15",
  },
  {
    label: "Receipt issued",
    detail: "Audit receipt stored for a school admission verification.",
    time: "10:03",
  },
];

function CompanyPortal() {
  const [companyEmail, setCompanyEmail] = useState("compliance@ktfp.ug");
  const [accessCode, setAccessCode] = useState("COMP-2048");
  const [signedIn, setSignedIn] = useState(false);
  const [nin, setNin] = useState("CM900112ABCDE");
  const [purpose, setPurpose] = useState("Employment onboarding");
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [message, setMessage] = useState(
    "Organizations can request a limited verification result for hiring, lending, admission, or compliance checks.",
  );
  const unreadMessages = signedIn ? queue.length + 1 : 2;

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignedIn(true);
    setMessage(
      `Signed in as ${companyEmail}. This organization can submit verification requests, view audit receipts, and manage its own verifier users.`,
    );
  };

  const signOut = () => {
    setSignedIn(false);
    setMessage(
      "Signed out. Company access is separate from the public portal and officer workspace.",
    );
  };

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requestId = `VRF-${Math.floor(1000 + Math.random() * 9000)}`;
    setQueue((current) => [
      {
        id: requestId,
        nin: nin.toUpperCase(),
        purpose,
        status: "Queued",
        summary: "Request sent to the public verification channel with a limited response scope.",
      },
      ...current,
    ]);
    setMessage(
      `Request ${requestId} queued for ${purpose.toLowerCase()}. The portal keeps the response limited to public-safe identity fields.`,
    );
  };

  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
            Organization portal
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">
            Verification access for employers, banks, and schools
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Sign in first to see the company profile, request queue, staff accounts, and audit
            receipts. Before sign-in, this page only explains what the portal does.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-gold">
            <span>Limited to your own workers, applicants, or customers</span>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-3 py-2 text-[11px] hover:bg-accent transition"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to public home
            </Link>
          </div>
        </div>

        {!signedIn ? (
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start mb-8">
            <form
              onSubmit={login}
              className="glass rounded-2xl p-6 border border-gold/40 bg-linear-to-br from-background to-background/60"
            >
              <div className="flex items-center gap-2 text-gold mb-3">
                <KeyRound className="w-4 h-4" />
                <div className="text-xs uppercase tracking-[0.18em]">Company sign-in</div>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="company-email"
                    className="text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Company email
                  </label>
                  <input
                    id="company-email"
                    value={companyEmail}
                    onChange={(event) => setCompanyEmail(event.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded bg-input/40 border border-border text-sm"
                    placeholder="name@company.co.ug"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company-code"
                    className="text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Access code
                  </label>
                  <input
                    id="company-code"
                    value={accessCode}
                    onChange={(event) => setAccessCode(event.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded bg-input/40 border border-border font-mono text-sm"
                    placeholder="COMP-2048"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
                >
                  Sign in as company <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Companies get their own workspace, request queue, staff list, and audit trail.
              </div>
            </form>

            <div className="glass rounded-2xl p-6 border border-border/80">
              <div className="flex items-center gap-2 text-gold mb-3">
                <Shield className="w-4 h-4" />
                <div className="text-xs uppercase tracking-[0.18em]">
                  What you unlock after sign-in
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Company profile and access tier",
                  "Verification request queue",
                  "Authorized staff accounts",
                  "Audit receipts and monitoring",
                  "Limited public-safe verification fields",
                  "Your own request workload only",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-border/70 bg-background/70 p-3 text-sm text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-muted-foreground leading-relaxed">
                Sign in first. That unlocks the company profile below and keeps it separate from the
                public website.
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-success/30 bg-success/5 p-4 text-sm text-muted-foreground flex items-center justify-between gap-3">
            <div>
              Signed in as <span className="font-semibold text-foreground">{companyEmail}</span>.
              You can now view and use the company profile, verification queue, staff list, and
              audit receipts below.
            </div>
            <div className="relative inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 bg-background/70 text-sm">
              <Bell className="w-4 h-4 text-gold" />
              Inbox
              <span className="absolute -top-2 -right-2 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-background">
                {unreadMessages}
              </span>
            </div>
          </div>
        )}

        {signedIn ? (
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-start">
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 border border-border/80">
                <div className="flex items-center gap-2 text-gold mb-3">
                  <Building2 className="w-4 h-4" />
                  <div className="text-xs uppercase tracking-[0.18em]">Company profile</div>
                </div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-2xl font-display font-bold">{DEMO_ORG.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{DEMO_ORG.type}</div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 text-success text-xs border border-success/30">
                    <BadgeCheck className="w-3.5 h-3.5" /> {DEMO_ORG.status}
                  </span>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <CircleUserRound className="w-4 h-4 text-gold" />
                  Signed in as {companyEmail} · code {accessCode}
                </div>

                <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Profile ID
                    </div>
                    <div className="mt-1 font-mono font-medium">{DEMO_ORG.profileId}</div>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Access tier
                    </div>
                    <div className="mt-1 font-medium">{DEMO_ORG.accessTier}</div>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Compliance contact
                    </div>
                    <div className="mt-1 font-medium">{DEMO_ORG.contact}</div>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Last audit
                    </div>
                    <div className="mt-1 font-medium">{DEMO_ORG.lastAudit}</div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-gold/30 bg-gold/5 p-4">
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <div className="text-sm font-semibold">What this portal is for</div>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    Employers, banks, schools, and similar organizations can request a limited
                    verification result. They should receive only the fields that are safe and
                    relevant for the request.
                  </div>
                  <div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="rounded-lg border border-border/60 bg-background/70 p-3">
                      Allowed: identity confirmation, status, district, audit receipt
                    </div>
                    <div className="rounded-lg border border-border/60 bg-background/70 p-3">
                      Not allowed: health, tax, property, criminal, or other ministry dossiers
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-border/80">
                <div className="flex items-center gap-2 text-gold mb-3">
                  <ClipboardCheck className="w-4 h-4" />
                  <div className="text-xs uppercase tracking-[0.18em]">Allowed response fields</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ALLOWED_RESPONSE_FIELDS.map((field) => (
                    <span
                      key={field}
                      className="px-3 py-1 rounded-full border border-border/70 bg-background/70 text-xs text-muted-foreground"
                    >
                      {field}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  The portal should not return health, tax, travel, property, criminal, or telecom
                  records for this type of access.
                </div>
              </div>

              <form
                onSubmit={submitRequest}
                className="glass rounded-2xl p-6 border border-border/80"
              >
                <div className="flex items-center gap-2 text-gold mb-3">
                  <Search className="w-4 h-4" />
                  <div className="text-xs uppercase tracking-[0.18em]">Verification request</div>
                </div>
                <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3">
                  <div>
                    <label
                      htmlFor="company-nin"
                      className="text-xs uppercase tracking-wider text-muted-foreground"
                    >
                      National Identification Number (NIN)
                    </label>
                    <input
                      id="company-nin"
                      value={nin}
                      onChange={(event) => setNin(event.target.value.toUpperCase())}
                      placeholder="Enter a National ID / NIN"
                      className="mt-1 w-full px-3 py-2 rounded bg-input/40 border border-border font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company-purpose"
                      className="text-xs uppercase tracking-wider text-muted-foreground"
                    >
                      Purpose
                    </label>
                    <input
                      id="company-purpose"
                      value={purpose}
                      onChange={(event) => setPurpose(event.target.value)}
                      placeholder="Why are you verifying?"
                      className="mt-1 w-full px-3 py-2 rounded bg-input/40 border border-border text-sm"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
                    >
                      Queue request <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={signOut}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border hover:bg-accent transition text-sm"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">{message}</div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 border border-border/80">
                <div className="flex items-center gap-2 mb-3 text-gold">
                  <Activity className="w-4 h-4" />
                  <div className="text-xs uppercase tracking-[0.18em]">Monitoring</div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {[
                    { value: "18", label: "Today" },
                    { value: "97%", label: "Approved" },
                    { value: "4m", label: "Avg. wait" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-border/70 bg-background/70 p-3"
                    >
                      <div className="text-lg font-semibold">{stat.value}</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Companies can monitor only their own request workload, approvals, and receipts.
                  They cannot monitor government system internals or other organizations.
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-border/80">
                <div className="flex items-center gap-2 mb-3 text-gold">
                  <Users className="w-4 h-4" />
                  <div className="text-xs uppercase tracking-[0.18em]">Authorized staff</div>
                </div>
                <div className="space-y-3">
                  {AUTHORIZED_USERS.map((user) => (
                    <div
                      key={user.name}
                      className="rounded-xl border border-border/70 bg-background/70 p-4 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-semibold text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{user.role}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success border border-success/30">
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Companies can request a limited verification result for hiring, lending,
                  admission, or compliance checks on their own workers and applicants.
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-border/80">
                <div className="flex items-center gap-2 mb-3 text-gold">
                  <FileText className="w-4 h-4" />
                  <div className="text-xs uppercase tracking-[0.18em]">Audit receipts</div>
                </div>
                <div className="space-y-3">
                  {ACTIVITY_LOG.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border/70 bg-background/70 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-sm">{item.label}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {item.time}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {item.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-gold/40 bg-linear-to-br from-background to-background/60">
                <div className="flex items-center gap-2 mb-3 text-gold">
                  <UsersRound className="w-4 h-4" />
                  <div className="text-xs uppercase tracking-[0.18em]">Request queue</div>
                </div>
                <div className="space-y-3">
                  {queue.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border/70 bg-background/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-sm">{item.purpose}</div>
                          <div className="text-xs text-muted-foreground mt-1 font-mono">
                            {item.nin}
                          </div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success border border-success/30">
                          {item.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {item.summary}
                      </div>
                      <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                        {item.id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-border/80">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-gold" />
                  <div className="font-semibold">Inbox & messages</div>
                  <span className="ml-auto text-xs text-muted-foreground">
                    Company notifications
                  </span>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="rounded-xl border border-border/60 bg-background/70 p-4">
                    <div className="text-xs uppercase tracking-wider text-gold mb-2">Unread</div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>One verification request is waiting for consent.</li>
                      <li>Audit receipt VRF-1024 is ready to download.</li>
                      <li>New verifier account needs approval.</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/70 p-4">
                    <div className="text-xs uppercase tracking-wider text-gold mb-2">
                      Action items
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Open pending requests and review the scope.</li>
                      <li>Reply to consent notifications from applicants.</li>
                      <li>Check staff access if a new verifier joined.</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/70 p-4">
                    <div className="text-xs uppercase tracking-wider text-gold mb-2">
                      Account bound
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Company inbox stays separate from the public portal.</li>
                      <li>Officer and citizen messages do not mix with this queue.</li>
                      <li>Notifications are tied to this account.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-border/80">
                <div className="flex items-center gap-2 mb-3 text-gold">
                  <CheckCircle2 className="w-4 h-4" />
                  <div className="text-xs uppercase tracking-[0.18em]">Why it stands out</div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <li>
                    Organizations get a proper profile, sign-in, and their own verifier workspace.
                  </li>
                  <li>Verification results are limited to the minimum data needed.</li>
                  <li>Audit-friendly receipts make the system look mature and governable.</li>
                  <li>
                    Companies can monitor their own requests without seeing ministry internals.
                  </li>
                  <li>The public website stays separate from internal government operations.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </PublicShell>
  );
}

export { CompanyPortal };
