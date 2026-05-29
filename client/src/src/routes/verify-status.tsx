import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Search, CheckCircle2, Clock, AlertCircle, FileCheck2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/verify-status")({
  component: VerifyStatusPage,
  head: () => ({
    meta: [
      { title: "Verify Status — NGDXH" },
      {
        name: "description",
        content: "Check the status of any government application, permit or certificate.",
      },
    ],
  }),
});

type Result = {
  ref: string;
  service: string;
  ministry: string;
  status: "Verified" | "In review" | "Pending payment" | "Not found";
  date: string;
  note: string;
};

const SAMPLES: Record<string, Result> = {
  "REQ-2026-0001": {
    ref: "REQ-2026-0001",
    service: "Driving permit renewal",
    ministry: "Ministry of Works & Transport",
    status: "Verified",
    date: "12 May 2026",
    note: "Permit ready for collection at Kampala MoWT one-stop centre.",
  },
  "REQ-2026-0002": {
    ref: "REQ-2026-0002",
    service: "Land title verification",
    ministry: "Ministry of Lands",
    status: "In review",
    date: "15 May 2026",
    note: "Lands officer is verifying parcel records. Expected by 22 May 2026.",
  },
  "REQ-2026-0003": {
    ref: "REQ-2026-0003",
    service: "Tax clearance certificate",
    ministry: "Uganda Revenue Authority",
    status: "Verified",
    date: "18 May 2026",
    note: "Certificate emailed to your registered address.",
  },
  "REQ-2026-0004": {
    ref: "REQ-2026-0004",
    service: "Passport renewal",
    ministry: "Immigration · DCIC",
    status: "Pending payment",
    date: "19 May 2026",
    note: "Outstanding fee UGX 250,000. Pay via MTN/Airtel money.",
  },
};

function VerifyStatusPage() {
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const onCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));
    const found = SAMPLES[ref.toUpperCase().trim()];
    setResult(
      found ?? {
        ref: ref.toUpperCase(),
        service: "—",
        ministry: "—",
        status: "Not found",
        date: "—",
        note: "We could not find a request with that reference. Check the spelling or contact the issuing ministry.",
      },
    );
    setLoading(false);
  };

  const statusColor = (s: Result["status"]) =>
    s === "Verified"
      ? "text-success bg-success/10 border-success/30"
      : s === "In review"
        ? "text-primary bg-primary/10 border-primary/30"
        : s === "Pending payment"
          ? "text-warning bg-warning/10 border-warning/30"
          : "text-destructive bg-destructive/10 border-destructive/30";

  const statusIcon = (s: Result["status"]) =>
    s === "Verified" ? (
      <CheckCircle2 className="w-4 h-4" />
    ) : s === "In review" ? (
      <Clock className="w-4 h-4" />
    ) : s === "Pending payment" ? (
      <AlertCircle className="w-4 h-4" />
    ) : (
      <AlertCircle className="w-4 h-4" />
    );

  return (
    <SiteShell>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Status check</div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold">
            Verify your application or document
          </h1>
          <p className="mt-3 text-muted-foreground">
            Enter a reference number (e.g. <span className="font-mono">REQ-2026-0001</span>) or a
            document ID.
          </p>
        </div>

        <form onSubmit={onCheck} className="glass rounded-xl p-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground ml-3" />
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="REQ-2026-0001"
            className="flex-1 bg-transparent outline-none text-sm px-2 py-2 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 inline-flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileCheck2 className="w-4 h-4" />
            )}{" "}
            Check
          </button>
        </form>

        <div className="mt-3 text-xs text-muted-foreground">
          Try:{" "}
          <button onClick={() => setRef("REQ-2026-0001")} className="text-primary hover:underline">
            REQ-2026-0001
          </button>
          {" · "}
          <button onClick={() => setRef("REQ-2026-0002")} className="text-primary hover:underline">
            REQ-2026-0002
          </button>
          {" · "}
          <button onClick={() => setRef("REQ-2026-0004")} className="text-primary hover:underline">
            REQ-2026-0004
          </button>
        </div>

        {result && (
          <div className="mt-8 glass rounded-xl p-6">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div>
                <div className="text-xs text-muted-foreground font-mono">{result.ref}</div>
                <div className="font-display font-bold text-lg">{result.service}</div>
                <div className="text-sm text-muted-foreground">{result.ministry}</div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${statusColor(result.status)}`}
              >
                {statusIcon(result.status)} {result.status}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">{result.note}</div>
            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              Last updated: {result.date}
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
