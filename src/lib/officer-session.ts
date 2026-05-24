import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export type OfficerSession = {
  role: string;
  title: string;
  officerId: string;
  signedInAt: string;
  mfaVerified: boolean;
};

const KEY = "ngdxh-officer-session";

export function getOfficerSession(): OfficerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OfficerSession) : null;
  } catch {
    return null;
  }
}

export function setOfficerSession(s: OfficerSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(s));
}

export function clearOfficerSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

/**
 * Soft client-side guard for internal/officer-only pages.
 * Prototype only — production would use server-enforced auth.
 */
export function useOfficerGuard() {
  const nav = useNavigate();
  const [session, setSession] = useState<OfficerSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getOfficerSession();
    if (!s || !s.mfaVerified) {
      nav({ to: "/login", search: { redirect: window.location.pathname } as never });
      return;
    }
    setSession(s);
    setReady(true);
  }, [nav]);

  return { session, ready };
}
