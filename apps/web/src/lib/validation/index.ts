/**
 * apps/web/src/lib/validation/index.ts
 *
 * Re-exports platform-agnostic validators from @ekda/validators,
 * then adds web-specific ARIA helpers that are DOM-only.
 */

export * from "@ekda/validators";

// ─── Web-only: ARIA accessibility helpers ────────────────────────────────────
// These use HTML attribute patterns — not available in React Native.

export function getAriaDescribedBy(
  fieldId: string,
  hasError: boolean,
  hasHint: boolean
): string | undefined {
  const ids: string[] = [];
  if (hasError) ids.push(`${fieldId}-error`);
  if (hasHint) ids.push(`${fieldId}-hint`);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function getInputAriaProps(fieldId: string, error?: string, hint?: string) {
  return {
    id: fieldId,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": getAriaDescribedBy(fieldId, !!error, !!hint),
    "aria-required": true as const,
  };
}
