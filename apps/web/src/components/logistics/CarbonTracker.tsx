"use client";

import { motion } from "framer-motion";
import { Leaf, TrendingDown, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CarbonEstimate {
  kg_co2: number;
  equivalent: string;
  offset_cost: number;
  route: string;
  cargo_type: "air" | "sea" | "road";
}

const CO2_RATES = {
  air: 0.82,    // kg CO2 per tonne-km (air freight)
  sea: 0.015,   // kg CO2 per tonne-km (sea freight)
  road: 0.062,  // kg CO2 per tonne-km (road)
};

const ROUTE_DISTANCES: Record<string, number> = {
  "NG-GB": 8000,   // Lagos to UK (km)
  "NG-US": 11000,  // Lagos to USA
  "NG-DE": 6500,   // Lagos to Germany
  "NG-CN": 12000,  // Lagos to/from China
  "NG-AE": 5500,   // Lagos to UAE
  "NG-CA": 10000,  // Lagos to Canada
};

function estimateCarbon(
  weightKg: number,
  cargoType: "air" | "sea" | "road",
  originCountry: string,
  destinationCountry: string
): CarbonEstimate {
  const routeKey = `${originCountry}-${destinationCountry}`;
  const reverseKey = `${destinationCountry}-${originCountry}`;
  const distanceKm = ROUTE_DISTANCES[routeKey] || ROUTE_DISTANCES[reverseKey] || 7000;
  const weightTonnes = weightKg / 1000;
  const kgCo2 = CO2_RATES[cargoType] * weightTonnes * distanceKm;
  const equivalents = [
    { threshold: 100, text: `${Math.round(kgCo2)} km driven in a car` },
    { threshold: 500, text: `${Math.round(kgCo2 / 100)} trees needed to offset` },
    { threshold: 1000, text: `${Math.round(kgCo2 / 250)} UK homes powered for a day` },
  ];
  const eq = equivalents.find((e) => kgCo2 < e.threshold) || equivalents[equivalents.length - 1]!;
  const offsetCostNGN = Math.round(kgCo2 * 1.2 * 1650); // $1.2/kg CO2 → NGN

  return {
    kg_co2: Math.round(kgCo2 * 10) / 10,
    equivalent: eq.text,
    offset_cost: offsetCostNGN,
    route: `${originCountry} → ${destinationCountry}`,
    cargo_type: cargoType,
  };
}

interface CarbonTrackerProps {
  weightKg: number;
  cargoType: "air" | "sea" | "road";
  originCountry?: string;
  destinationCountry?: string;
  compact?: boolean;
}

export function CarbonTracker({
  weightKg,
  cargoType,
  originCountry = "NG",
  destinationCountry = "GB",
  compact = false,
}: CarbonTrackerProps) {
  const estimate = estimateCarbon(weightKg, cargoType, originCountry, destinationCountry);
  const seaEstimate = estimateCarbon(weightKg, "sea", originCountry, destinationCountry);
  const savingsVsAir = cargoType !== "sea"
    ? estimateCarbon(weightKg, "air", originCountry, destinationCountry).kg_co2 - estimate.kg_co2
    : 0;

  const intensity = estimate.kg_co2 < 5 ? "low" : estimate.kg_co2 < 50 ? "medium" : "high";

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
        <Leaf className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
        <span className="text-xs text-green-700 dark:text-green-400">
          ~{estimate.kg_co2} kg CO₂ · {cargoType === "sea" ? "🚢 Greener Choice" : "✈️ High Emissions"}
        </span>
        {cargoType !== "sea" && (
          <Badge className="text-[9px] px-1.5 py-0 bg-green-100 text-green-700 border-0 ml-auto">
            Sea saves {Math.round(savingsVsAir)}kg
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Leaf className="h-4 w-4 text-green-600" />
        <span className="text-sm font-semibold">Carbon Footprint</span>
        <Badge
          className={cn(
            "text-[10px] ml-auto",
            intensity === "low" ? "bg-green-100 text-green-700 border-green-200" :
            intensity === "medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
            "bg-red-100 text-red-700 border-red-200"
          )}
        >
          {intensity === "low" ? "🌿 Low Impact" : intensity === "medium" ? "⚠️ Medium Impact" : "🔴 High Impact"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-muted/40 rounded-xl text-center">
          <div className="text-2xl font-bold text-foreground">{estimate.kg_co2}</div>
          <div className="text-[10px] text-muted-foreground">kg CO₂ estimated</div>
        </div>
        <div className="p-3 bg-muted/40 rounded-xl text-center">
          <div className="text-sm font-bold text-foreground">{estimate.equivalent}</div>
          <div className="text-[10px] text-muted-foreground">equivalent impact</div>
        </div>
      </div>

      {cargoType === "air" && (
        <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <TrendingDown className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold text-green-700 dark:text-green-400">
              Switch to Sea Freight: Save {Math.round(savingsVsAir)} kg CO₂
            </div>
            <p className="text-[10px] text-green-600 dark:text-green-500 mt-0.5">
              Sea freight emits ~98% less CO₂ than air freight per tonne-km
            </p>
          </div>
        </div>
      )}

      {cargoType === "sea" && (
        <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-400">
          <Leaf className="h-3.5 w-3.5 flex-shrink-0" />
          🌿 Great choice! Sea freight is the most carbon-efficient option for this route.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Offset this shipment</div>
          <div className="text-sm font-bold text-foreground">
            + {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(estimate.offset_cost)}
          </div>
        </div>
        <button className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-xl font-medium hover:bg-green-200 transition-colors">
          🌳 Add Carbon Offset
        </button>
      </div>
    </div>
  );
}
