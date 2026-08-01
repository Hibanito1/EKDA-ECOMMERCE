"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { AIChatAssistant } from "@/components/ai/ChatAssistant";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ErrorBoundary } from "@/components/monitoring/ErrorBoundary";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <ErrorBoundary>
        {children}
        <AIChatAssistant />
        <ConsentBanner />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
