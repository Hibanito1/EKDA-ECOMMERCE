"use client";

/**
 * apps/web/src/lib/auth/DemoAuthContext.tsx
 *
 * Persistent demo session provider for web.
 *
 * - Stores session in localStorage (survives page refresh)
 * - Exposes: demoUser, isDemo, login(), logout(), role
 * - Wraps the entire app via Providers.tsx
 * - Mirrors what Supabase Auth would provide in production
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type DemoUser,
  type DemoSession,
  createDemoSession,
  serializeSession,
  deserializeSession,
  DEMO_SESSION_KEY,
  validateDemoCredentials,
  getDemoRedirectPath,
} from "@ekda/demo";
import type { UserRole } from "@ekda/shared";

// ─── Context Shape ────────────────────────────────────────────────────────────

export interface DemoAuthState {
  /** Currently logged-in demo user, or null if not authenticated */
  demoUser: DemoUser | null;
  /** True if a demo session is active */
  isDemo: boolean;
  /** Loading state while session is being restored from storage */
  isLoading: boolean;
  /** Active role derived from demoUser */
  role: UserRole | null;
  /** Log in with demo credentials. Returns redirect path on success. */
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string; error?: string }>;
  /** Clear demo session and log out */
  logout: () => void;
  /** Programmatically set the user (e.g. after OAuth demo) */
  setDemoUser: (user: DemoUser) => void;
}

const DemoAuthContext = createContext<DemoAuthState>({
  demoUser: null,
  isDemo: false,
  isLoading: true,
  role: null,
  login: async () => ({ success: false, error: "Provider not mounted" }),
  logout: () => {},
  setDemoUser: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [demoUser, setDemoUserState] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session from localStorage on mount ─────────────────────────────
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined"
        ? localStorage.getItem(DEMO_SESSION_KEY)
        : null;
      const session = deserializeSession(raw);
      if (session) {
        setDemoUserState(session.user);
      }
    } catch {
      // localStorage unavailable (SSR, private browsing) — fail silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const result = validateDemoCredentials(email, password);

    if (!result.valid || !result.user) {
      return { success: false, error: result.error };
    }

    const session: DemoSession = createDemoSession(result.user);

    try {
      localStorage.setItem(DEMO_SESSION_KEY, serializeSession(session));
    } catch {
      // Storage full or unavailable — continue without persistence
    }

    setDemoUserState(result.user);

    return {
      success: true,
      redirectTo: getDemoRedirectPath(result.user.role),
    };
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(DEMO_SESSION_KEY);
    } catch {}
    setDemoUserState(null);
  }, []);

  // ── Set user directly ──────────────────────────────────────────────────────
  const setDemoUser = useCallback((user: DemoUser) => {
    const session = createDemoSession(user);
    try {
      localStorage.setItem(DEMO_SESSION_KEY, serializeSession(session));
    } catch {}
    setDemoUserState(user);
  }, []);

  return (
    <DemoAuthContext.Provider
      value={{
        demoUser,
        isDemo: demoUser !== null,
        isLoading,
        role: demoUser?.role ?? null,
        login,
        logout,
        setDemoUser,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDemoAuth(): DemoAuthState {
  return useContext(DemoAuthContext);
}

/** Convenience: true only when demo session is active and user is not null */
export function useIsDemoAuthenticated(): boolean {
  const { isDemo, isLoading } = useDemoAuth();
  return !isLoading && isDemo;
}
