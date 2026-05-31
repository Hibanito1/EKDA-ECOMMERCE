"use client";

import { Suspense } from "react";
import { KYCForm } from "@/components/kyc/KYCForm";
import { useSearchParams, useRouter } from "next/navigation";
import type { UserRole } from "@ekda/shared";

function KYCPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = (searchParams.get("role") as UserRole) || "vendor";

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4">
        <KYCForm
          role={role}
          onComplete={(appId) => {
            router.push(`/dashboard?kyc_submitted=${appId}`);
          }}
        />
      </div>
    </div>
  );
}

export default function KYCPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <KYCPageContent />
    </Suspense>
  );
}
