"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { AIChatAssistant } from "@/components/ai/ChatAssistant";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ErrorBoundary } from "@/components/monitoring/ErrorBoundary";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoAuthProvider } from "@/lib/auth/DemoAuthContext";

export function Providers({ children }: { children: ReactNode }) {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {/* DemoAuthProvider wraps everything so any component can call useDemoAuth() */}
      <DemoAuthProvider>
        <ErrorBoundary>
          <DemoBanner />
          <div className={isDemo ? "pt-10" : ""}>{children}</div>
          <AIChatAssistant />
          <ConsentBanner />
        </ErrorBoundary>
      </DemoAuthProvider>
    </ThemeProvider>
  );
}
