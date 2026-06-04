/**
 * packages/demo/src/session.ts
 *
 * Platform-agnostic session serialization for demo mode.
 * Web stores in localStorage; Mobile stores in AsyncStorage.
 * Both use the same key, shape, and helper functions.
 */

import type { DemoUser } from "./users";

export const DEMO_SESSION_KEY = "ekda_demo_session";
export const DEMO_SESSION_VERSION = "1";

export interface DemoSession {
  /** Schema version — invalidate old sessions on update */
  v: string;
  user: DemoUser;
  /** ISO timestamp when session was created */
  created_at: string;
  /** ISO timestamp when session expires (24h from creation) */
  expires_at: string;
}

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Create a new session object for the given user */
export function createDemoSession(user: DemoUser): DemoSession {
  const now = new Date();
  return {
    v: DEMO_SESSION_VERSION,
    user,
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };
}

/** Serialize session to JSON string for storage */
export function serializeSession(session: DemoSession): string {
  return JSON.stringify(session);
}

/** Deserialize and validate a stored session string */
export function deserializeSession(raw: string | null | undefined): DemoSession | null {
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as DemoSession;
    // Version check
    if (session.v !== DEMO_SESSION_VERSION) return null;
    // Expiry check
    if (new Date(session.expires_at) < new Date()) return null;
    // Shape check
    if (!session.user?.email || !session.user?.role) return null;
    return session;
  } catch {
    return null;
  }
}

/** Returns true if a session is valid and non-expired */
export function isValidSession(session: DemoSession | null): session is DemoSession {
  if (!session) return false;
  return new Date(session.expires_at) > new Date();
}
