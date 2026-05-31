import * as React from "react";
import { cn } from "@/lib/utils";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "circle" | "text" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "animate-pulse rounded-xl bg-muted",
      variant === "circle" && "rounded-full",
      variant === "text" && "rounded h-4",
      className
    )}
    {...props}
  />
));
Skeleton.displayName = "Skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-0 overflow-hidden">
      <Skeleton className="h-52 w-full rounded-none rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton };
