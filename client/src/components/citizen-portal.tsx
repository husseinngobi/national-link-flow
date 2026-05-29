import { useEffect, useMemo, useState, type FormEvent } from "react";
import { PublicShell } from "@/components/public-shell";
import {
  createCitizenPortalRequest,
  getCitizenSession,
  listCitizenPortalRequests,
  loginCitizen,
  logoutCitizen,
  type CitizenRecord,
  type RequestRecord,
} from "@/lib/api";
import {
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  LockKeyhole,
  MailOpen,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const STORAGE_KEY = "ngdxh-citizen-token";
const DEMO_CITIZEN_NIN = "CM900112ABCDE";
const DEMO_CITIZEN_PIN = "771194";

const SERVICE_OPTIONS = [
  "Driving permit renewal",
  "Land title verification",
  "Tax clearance certificate",
  "Passport renewal",
  "Business registration support",
];

function formatCitizenName(citizen: CitizenRecord | null) {
  return citizen ? citizen.name : "Citizen";
}

export function CitizenPortal() {
  const [token, setToken] = useState<string | null>(null);
  const [citizen, setCitizen] = useState<CitizenRecord | null>(null);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [nin, setNin] = useState(DEMO_CITIZEN_NIN);
  const [pin, setPin] = useState(DEMO_CITIZEN_PIN);
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [notes, setNotes] = useState("");
  const [authError, setAuthError] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    "Sign in to view your own government services.",
  );

  const sessionActive = Boolean(token && citizen);
  const unreadMessages = sessionActive ? Math.max(requests.length, 1) + 1 : 2;

  const loadSession = async (sessionToken: string) => {
    setAuthLoading(true);
    try {
      const response = await getCitizenSession(sessionToken);
      setCitizen(response.citizen);
      setRequests(response.requests);
      setToken(response.token);
      setStatusMessage(`Welcome back, ${response.citizen.name}.`);
      sessionStorage.setItem(STORAGE_KEY, response.token);
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setCitizen(null);
      setRequests([]);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = sessionStorage.getItem(STORAGE_KEY);
    if (savedToken) {
      void loadSession(savedToken);
      return;
    }

    setAuthLoading(false);
  }, []);

  const refreshRequests = async (sessionToken: string) => {
    const response = await listCitizenPortalRequests(sessionToken);
    setCitizen(response.citizen);
    setRequests(response.requests);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginLoading(true);
    setAuthError("");

    try {
      const response = await loginCitizen({ nin, pin });
      setToken(response.token);
      setCitizen(response.citizen);
      setRequests(response.requests);
      setStatusMessage(`Signed in as ${response.citizen.name}.`);
      sessionStorage.setItem(STORAGE_KEY, response.token);
    } catch (error) {
      setAuthError("Invalid citizen credentials. Use the demo NIN and PIN shown on the page.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!token) {
      return;
    }

    try {
      await logoutCitizen(token);
    } finally {
      sessionStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setCitizen(null);
      setRequests([]);
      setNotes("");
      setStatusMessage("Signed out.");
    }
  };

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !citizen) {
      return;
    }

    setRequestLoading(true);
    try {
      const response = await createCitizenPortalRequest(token, { service, notes });
      setRequests(response.requests);
      setStatusMessage(`Submitted ${response.request.id} and saved it to your portal.`);
      setNotes("");
      await refreshRequests(token);
    } catch {
      setStatusMessage("Could not submit the request right now.");
    } finally {
      setRequestLoading(false);
    }
  };

  const loginCard = useMemo(
    () => (
      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-start">
        <div className="glass rounded-2xl p-6 border border-border/80">
          <div className="flex items-center gap-2 mb-3 text-gold">
            <LockKeyhole className="w-4 h-4" />
            <div className="text-xs uppercase tracking-[0.18em]">Citizen sign-in</div>
          </div>
          <h2 className="text-2xl font-display font-bold">Sign in to your own service portal</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            This portal is now account-based. Each citizen signs in with a NIN and a private PIN so
            they only see their own requests and updates.
          </p>

          <form className="mt-5 space-y-3" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="citizen-nin"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                National ID number
              </label>
              <input
                id="citizen-nin"
                value={nin}
                onChange={(event) => setNin(event.target.value.toUpperCase())}
                placeholder="Enter your NIN"
                className="mt-1 w-full px-3 py-2 rounded bg-input/40 border border-border font-mono text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="citizen-pin"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Portal PIN
              </label>
              <input
                id="citizen-pin"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Enter your portal PIN"
                className="mt-1 w-full px-3 py-2 rounded bg-input/40 border border-border font-mono text-sm tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading || authLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm disabled:opacity-60"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Open citizen portal
                </>
              )}
            </button>

            {authError && <div className="text-xs text-destructive">{authError}</div>}
          </form>

          <div className="mt-5 pt-5 border-t border-border/60 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <UserRound className="w-3.5 h-3.5 text-gold" /> Only your requests are shown after
              sign-in
            </div>
            <div className="flex items-center gap-2">
              <LockKeyhole className="w-3.5 h-3.5 text-gold" /> Separate from the officer workspace
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-gold/40 bg-linear-to-br from-background to-background/60">
          <div className="text-xs uppercase tracking-[0.18em] text-gold">Demo credentials</div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background/70 px-3 py-2">
              <span className="text-muted-foreground">NIN</span>
              <span className="font-mono font-medium">{DEMO_CITIZEN_NIN}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background/70 px-3 py-2">
              <span className="text-muted-foreground">PIN</span>
              <span className="font-mono font-medium">{DEMO_CITIZEN_PIN}</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border/70 bg-background/60 p-4">
            <div className="font-semibold text-sm mb-2">Why this is better</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Citizens only see their own service records.</li>
              <li>Public verification stays separate and limited.</li>
              <li>The portal feels closer to a real government account system.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    [authError, authLoading, handleLogin, loginLoading, nin, pin],
  );

  if (authLoading) {
    return (
      <PublicShell>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="glass rounded-2xl p-8 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-gold" />
            <div className="text-sm text-muted-foreground">Loading your portal session…</div>
          </div>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
            Citizen service portal
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">
            Track your own government services
          </h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Sign in to view only your personal requests, updates, and submission history. Public
            verification remains separate for status checks that do not require a login.
          </p>
        </div>

        {!sessionActive ? (
          loginCard
        ) : (
          <>
            <div className="glass rounded-2xl p-5 mb-6 flex flex-wrap items-center justify-between gap-3 border border-border/80">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-gold">Signed in</div>
                <div className="mt-1 font-semibold">{formatCitizenName(citizen)}</div>
                <div className="text-xs text-muted-foreground font-mono">{citizen?.nin}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="relative inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-accent text-sm"
                  aria-label="Citizen notifications"
                >
                  <Bell className="w-4 h-4 text-gold" />
                  Messages
                  <span className="absolute -top-1 -right-1 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-background">
                    {unreadMessages}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-accent text-sm"
                >
                  Sign out
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              <div className="glass rounded-xl p-5">
                <div className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold" />
                  My requests
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  Private portal for{" "}
                  <span className="font-mono text-foreground">{citizen?.nin}</span>
                </div>
                <ul className="divide-y divide-border/60">
                  {requests.map((request) => (
                    <li key={request.id} className="py-3 flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gold" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{request.service}</div>
                        <div className="text-xs text-muted-foreground font-mono truncate">
                          {request.id} · {request.date}
                        </div>
                        {request.notes && (
                          <div className="text-xs text-muted-foreground mt-1">{request.notes}</div>
                        )}
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          request.status === "Verified"
                            ? "bg-success/15 text-success border-success/40"
                            : request.status === "In review"
                              ? "bg-warning/15 text-warning border-warning/40"
                              : "bg-accent text-muted-foreground border-border"
                        }`}
                      >
                        {request.status.toUpperCase()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-xl p-5">
                <div className="font-semibold mb-3">Submit a service request</div>
                <form className="space-y-3" onSubmit={submitRequest}>
                  <div>
                    <label htmlFor="service-type" className="sr-only">
                      Service type
                    </label>
                    <select
                      id="service-type"
                      value={service}
                      onChange={(event) => setService(event.target.value)}
                      className="w-full px-3 py-2 rounded bg-input/40 border border-border text-sm"
                    >
                      {SERVICE_OPTIONS.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="request-notes" className="sr-only">
                      Request notes
                    </label>
                    <textarea
                      id="request-notes"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Add a short note for the officer"
                      rows={4}
                      className="w-full px-3 py-2 rounded bg-input/40 border border-border text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm disabled:opacity-60"
                  >
                    {requestLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit request
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5 pt-5 border-t border-border/60 text-xs text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Only the signed-in citizen
                    can see this list
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gold" /> Average processing: 2.4 hours
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MailOpen className="w-4 h-4 text-gold" />
                <div className="font-semibold">Inbox & messages</div>
                <span className="ml-auto text-xs text-muted-foreground">
                  Personal account notifications
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-background/70 p-4">
                  <div className="text-xs uppercase tracking-wider text-gold mb-2">Unread</div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Your passport renewal request is under review.</li>
                    <li>Upload one more document for your land title check.</li>
                    <li>Your latest tax clearance receipt is available to view.</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 p-4">
                  <div className="text-xs uppercase tracking-wider text-gold mb-2">
                    What this replaces
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>No need to keep checking a public page for updates.</li>
                    <li>Messages and requests stay inside your account.</li>
                    <li>Only your own notifications are shown here.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">{statusMessage}</div>
          </>
        )}
      </div>
    </PublicShell>
  );
}
