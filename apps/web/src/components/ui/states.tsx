/**
 * apps/web/src/components/ui/states.tsx
 *
 * Web-specific UI state components (Tailwind + Framer Motion).
 * Text copy and empty-state configs come from @ekda/ui so they
 * stay in sync with the mobile app.
 */

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Import shared copy from @ekda/ui
export { EMPTY_STATES } from "@ekda/ui";
export type { EmptyStateCopy, EmptyStateKey } from "@ekda/ui";
export { toastConfig as toastStyles } from "@ekda/ui";

// ─── Loading Spinner ──────────────────────────────────────────────────────────

export function Spinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };
  return (
    <div
      className={cn(
        "rounded-full border-primary border-t-transparent animate-spin",
        sizes[size],
        className
      )}
    />
  );
}

// ─── Full Page Loading ────────────────────────────────────────────────────────

export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent"
      />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

// ─── Inline Loading ────────────────────────────────────────────────────────────

export function InlineLoader({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2.5 py-3">
      <Spinner size="sm" />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  );
}

// ─── Skeleton Variants ────────────────────────────────────────────────────────

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card overflow-hidden">
          <div className="h-52 bg-muted animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-3.5 bg-muted animate-pulse rounded-full w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded-full w-1/2" />
            <div className="flex justify-between items-center">
              <div className="h-5 bg-muted animate-pulse rounded-full w-24" />
              <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 bg-muted animate-pulse rounded-full w-24" />
          <div className="h-3 bg-muted animate-pulse rounded-full w-16" />
        </div>
      </div>
      <div className="h-6 bg-muted animate-pulse rounded-full w-32" />
      <div className="h-3 bg-muted animate-pulse rounded-full w-20" />
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="rounded-2xl border overflow-hidden">
      <div className="border-b bg-muted/30 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-muted animate-pulse rounded-full"
            style={{ width: `${60 + (i * 17) % 60}px` }}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b last:border-0 px-4 py-3.5 flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-3 bg-muted animate-pulse rounded-full"
              style={{ width: `${50 + (j * 23) % 80}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Empty State (Web — Framer Motion) ────────────────────────────────────────

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  emoji = "📭",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm max-w-xs mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  code?: number;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again.",
  onRetry,
  code,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="text-5xl mb-4">⚠️</div>
      {code && (
        <div className="text-muted-foreground text-sm font-mono mb-2">
          Error {code}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────

export function SuccessState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 12 }}
        className="h-20 w-20 rounded-full bg-ekda-green-100 dark:bg-ekda-green-900/30 flex items-center justify-center mb-5 shadow-lg shadow-ekda-green-500/20"
      >
        <span className="text-4xl">✅</span>
      </motion.div>
      <h3 className="text-xl font-bold mb-2 text-ekda-green-700 dark:text-ekda-green-400">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground text-sm max-w-xs mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  );
}

// ─── Network Offline Banner ───────────────────────────────────────────────────

export function OfflineBanner() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white text-center text-sm py-2 px-4 font-medium"
    >
      📡 You&apos;re offline — some features may not be available. Saved data is still accessible.
    </motion.div>
  );
}
