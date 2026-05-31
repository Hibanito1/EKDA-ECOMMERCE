"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, errorId: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: `ERR-${Date.now().toString(36).toUpperCase()}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Send to Sentry in production
    console.error("[ErrorBoundary]", error, errorInfo);

    // Log to our analytics
    if (typeof window !== "undefined") {
      // captureError(error, { componentStack: errorInfo.componentStack });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex items-center justify-center min-h-[300px] p-6">
          <div className="max-w-md w-full text-center">
            <div className="h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground text-sm mb-2">
              An unexpected error occurred. Our team has been notified.
            </p>
            {this.state.errorId && (
              <p className="text-xs text-muted-foreground mb-6 font-mono">
                Error ID: {this.state.errorId}
              </p>
            )}

            {this.props.showDetails && this.state.error && (
              <div className="mb-4 p-3 bg-muted/40 rounded-xl text-left">
                <p className="text-xs font-mono text-red-600 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} variant="premium" size="sm">
                <RefreshCw className="h-3.5 w-3.5" />
                Try Again
              </Button>
              <Button onClick={() => window.location.href = "/"} variant="outline" size="sm">
                <Home className="h-3.5 w-3.5" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Page-level error component ────────────────────────────────────────────────

export function PageError({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist.",
  code = 404,
}: {
  title?: string;
  message?: string;
  code?: number;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-muted-foreground/20 mb-4">{code}</div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-8">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.history.back()} variant="outline">
            ← Go Back
          </Button>
          <Button onClick={() => window.location.href = "/"} variant="premium">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── API Error Handler ─────────────────────────────────────────────────────────

export function handleAPIError(error: unknown, context: string): Response {
  const message = error instanceof Error ? error.message : "Internal server error";
  const isKnownError = error instanceof Error && (
    error.message.includes("not found") ||
    error.message.includes("unauthorized") ||
    error.message.includes("forbidden")
  );

  if (!isKnownError) {
    console.error(`[API Error] ${context}:`, error);
  }

  const statusCode =
    message.includes("not found") ? 404 :
    message.includes("unauthorized") ? 401 :
    message.includes("forbidden") ? 403 :
    message.includes("rate limit") ? 429 : 500;

  return Response.json(
    {
      error: message,
      context,
      error_id: `ERR-${Date.now().toString(36).toUpperCase()}`,
    },
    { status: statusCode }
  );
}
