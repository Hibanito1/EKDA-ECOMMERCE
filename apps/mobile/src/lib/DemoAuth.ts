/**
 * apps/mobile/src/lib/DemoAuth.ts
 *
 * Demo auth helpers for React Native (Expo).
 * Uses @react-native-async-storage/async-storage for persistence.
 * Shared session logic from @ekda/demo.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
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

/** Load session from AsyncStorage — returns null if expired or missing */
export async function loadDemoSession(): Promise<DemoSession | null> {
  try {
    const raw = await AsyncStorage.getItem(DEMO_SESSION_KEY);
    return deserializeSession(raw);
  } catch {
    return null;
  }
}

/** Save session to AsyncStorage */
export async function saveDemoSession(user: DemoUser): Promise<void> {
  const session = createDemoSession(user);
  try {
    await AsyncStorage.setItem(DEMO_SESSION_KEY, serializeSession(session));
  } catch {
    // Storage unavailable — fail silently
  }
}

/** Remove session from AsyncStorage */
export async function clearDemoSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DEMO_SESSION_KEY);
  } catch {}
}

/**
 * Full login flow for mobile demo mode.
 * Returns the user and redirect tab name on success.
 */
export async function mobileLogin(
  email: string,
  password: string
): Promise<{ success: boolean; user?: DemoUser; tab?: string; error?: string }> {
  const result = validateDemoCredentials(email, password);

  if (!result.valid || !result.user) {
    return { success: false, error: result.error };
  }

  await saveDemoSession(result.user);

  // Map role → tab name for mobile navigation
  const tabMap: Record<string, string> = {
    admin: "account",     // mobile has no admin tab — show account
    vendor: "account",
    carrier: "account",
    enterprise: "account",
    customer: "account",
  };

  return {
    success: true,
    user: result.user,
    tab: tabMap[result.user.role] ?? "account",
  };
}
