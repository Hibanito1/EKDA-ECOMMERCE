/**
 * @ekda/ui — Design Tokens
 *
 * Shared design constants expressed as JavaScript objects.
 * Web uses these to sync with Tailwind config.
 * Mobile uses these directly in StyleSheet.create().
 *
 * Never use platform-specific APIs here.
 */

// ─── Brand Colors ─────────────────────────────────────────────────────────────

export const colors = {
  // Primary greens (ekda-green)
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  // Accent golds (ekda-gold)
  gold: {
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
  },
  // Earth tones
  earth: {
    50: "#fdf8f0",
    100: "#faefd9",
    600: "#b86918",
    700: "#974e16",
    800: "#7c4019",
  },
  // Dark backgrounds
  dark: {
    navy: "#0a1628",
    navyMid: "#0f2044",
  },
  // Status
  success: "#16a34a",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  // Neutrals
  white: "#ffffff",
  black: "#000000",
} as const;

// ─── Typography Scale ─────────────────────────────────────────────────────────

export const typography = {
  // Font sizes (in dp/px)
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  // Font weights
  weight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
} as const;

// ─── Spacing Scale ────────────────────────────────────────────────────────────

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  "2xl": 24,
  full: 9999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

/** React Native shadow props */
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  brand: {
    shadowColor: colors.green[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// ─── Toast Styles (platform-agnostic config) ──────────────────────────────────

export const toastConfig = {
  success: {
    backgroundColor: "#14532d",
    borderColor: "rgba(34,197,94,0.3)",
    iconColor: "#22c55e",
  },
  error: {
    backgroundColor: "#450a0a",
    borderColor: "rgba(239,68,68,0.3)",
    iconColor: "#ef4444",
  },
  info: {
    backgroundColor: "#1e3a5f",
    borderColor: "rgba(59,130,246,0.3)",
    iconColor: "#3b82f6",
  },
  warning: {
    backgroundColor: "#431407",
    borderColor: "rgba(245,158,11,0.3)",
    iconColor: "#f59e0b",
  },
} as const;
