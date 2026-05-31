import type { Metadata } from "next";
import { Suspense } from "react";
import { EscrowDemo } from "@/components/monitoring/EscrowDemo";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "How Escrow Works",
  description: "Interactive demo of EKDA's escrow payment protection system",
};

export default function EscrowDemoPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
        <EscrowDemo />
      </Suspense>
    </div>
  );
}
