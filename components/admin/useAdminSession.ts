"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { AdminRole } from "@/types";

export type SessionStatus = "loading" | "signed-out" | "forbidden" | "ready";

export interface AdminSession {
  status: SessionStatus;
  email: string;
  userId: string;
  role: AdminRole | null;
  signOut: () => Promise<void>;
}

function roleFrom(session: Session | null): AdminRole | null {
  const role = session?.user.app_metadata?.role;
  return role === "admin" || role === "editor" ? role : null;
}

/** Tracks the Supabase Auth session in the browser and the admin role stored in app_metadata. */
export function useAdminSession(): AdminSession {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let active = true;

    const apply = (next: Session | null) => {
      if (!active) return;
      setSession(next);
      if (!next) setStatus("signed-out");
      else setStatus(roleFrom(next) ? "ready" : "forbidden");
    };

    supabase.auth.getSession().then(({ data }) => apply(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => apply(next));

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    status,
    email: session?.user.email ?? "",
    userId: session?.user.id ?? "",
    role: roleFrom(session),
    signOut,
  };
}

export function hasRole(role: AdminRole | null, min: AdminRole): boolean {
  if (!role) return false;
  return role === "admin" || min === "editor";
}
