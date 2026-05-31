import type { NextResponse } from "next/server";

export type LogLevel = "debug" | "info" | "warn" | "error" | "critical";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  service?: string;
  user_id?: string;
  order_id?: string;
  action?: string;
  duration_ms?: number;
  error?: string;
  stack?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify({
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  });
}

class Logger {
  private service: string;

  constructor(service: string) {
    this.service = service;
  }

  private log(level: LogLevel, message: string, context?: Partial<Omit<LogEntry, "level" | "message" | "timestamp" | "service">>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.service,
      ...context,
    };

    const formatted = formatLog(entry);

    switch (level) {
      case "debug":
        if (process.env.NODE_ENV === "development") console.debug(formatted);
        break;
      case "info":
        console.log(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "error":
      case "critical":
        console.error(formatted);
        break;
    }

    // In production, send to external logging service (Sentry, Datadog, etc.)
    if (level === "error" || level === "critical") {
      this.sendToSentry(entry);
    }
  }

  private sendToSentry(entry: LogEntry) {
    // Sentry.captureException(new Error(entry.message), { extra: entry });
    // For now, just log to stderr
    if (process.env.SENTRY_DSN) {
      // TODO: Initialize Sentry and capture
    }
  }

  debug(message: string, context?: Partial<LogEntry>) {
    this.log("debug", message, context);
  }

  info(message: string, context?: Partial<LogEntry>) {
    this.log("info", message, context);
  }

  warn(message: string, context?: Partial<LogEntry>) {
    this.log("warn", message, context);
  }

  error(message: string, context?: Partial<LogEntry>) {
    this.log("error", message, context);
  }

  critical(message: string, context?: Partial<LogEntry>) {
    this.log("critical", message, context);
  }

  // Domain-specific log helpers
  escrow(action: string, orderId: string, amount: number, context?: Partial<LogEntry>) {
    this.info(`[ESCROW] ${action}`, {
      action,
      order_id: orderId,
      metadata: { amount, ...context?.metadata },
    });
  }

  payment(action: string, orderId: string, gateway: string, context?: Partial<LogEntry>) {
    this.info(`[PAYMENT] ${action}`, {
      action,
      order_id: orderId,
      metadata: { gateway, ...context?.metadata },
    });
  }

  kyc(action: string, userId: string, context?: Partial<LogEntry>) {
    this.info(`[KYC] ${action}`, {
      action,
      user_id: userId,
      ...context,
    });
  }

  ai(action: string, model: string, durationMs: number, context?: Partial<LogEntry>) {
    this.info(`[AI] ${action}`, {
      action,
      duration_ms: durationMs,
      metadata: { model, ...context?.metadata },
    });
  }

  api(method: string, path: string, statusCode: number, durationMs: number, userId?: string) {
    const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
    this.log(level, `${method} ${path} ${statusCode}`, {
      user_id: userId,
      duration_ms: durationMs,
      metadata: { method, path, statusCode },
    });
  }
}

// Create service-specific loggers
export const logger = new Logger("ekda-web");
export const escrowLogger = new Logger("ekda-escrow");
export const paymentLogger = new Logger("ekda-payments");
export const kycLogger = new Logger("ekda-kyc");
export const aiLogger = new Logger("ekda-ai");

// Audit trail helper
export async function createAuditLog(params: {
  action: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}) {
  // In production, insert to audit_logs table
  logger.info(`[AUDIT] ${params.action}`, {
    action: params.action,
    user_id: params.userId,
    metadata: {
      entity_type: params.entityType,
      entity_id: params.entityId,
      ...params.metadata,
    },
    ip: params.ip,
  });
}
