"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  RefreshCw,
  Loader2,
  FileText,
  Ship,
  Plane,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatHSCode } from "@ekda/shared";
import type { AIHSCodeSuggestion } from "@ekda/shared";
import toast from "react-hot-toast";

const EXAMPLE_PRODUCTS = [
  "Dried crayfish from Badagry Creek, Nigeria",
  "Frozen stockfish (cod)",
  "Toyota Camry 2021 petrol sedan",
  "Industrial excavator 30-ton",
  "Palm oil, crude, unrefined",
  "Smartphone, Samsung Galaxy S24",
];

// Simulated AI response
function simulateAIHSCode(productDescription: string): AIHSCodeSuggestion {
  const desc = productDescription.toLowerCase();
  
  if (desc.includes("crayfish") || desc.includes("shrimp")) {
    return {
      suggested_code: "0306.17",
      description: "Other shrimps and prawns, dried, salted or in brine",
      confidence: 0.97,
      alternative_codes: [
        { code: "0305.72", description: "Dried fish, salted or in brine", confidence: 0.71 },
        { code: "1605.29", description: "Prepared or preserved crustaceans", confidence: 0.45 },
      ],
      restricted_air_cargo: false,
      estimated_duty_rate: 5,
      notes: "Common export from Nigeria. Air freight is permissible. Sea freight recommended for bulk orders.",
    };
  }
  
  if (desc.includes("stockfish") || desc.includes("cod")) {
    return {
      suggested_code: "0305.41",
      description: "Dried fish, unsalted, not smoked — Pacific cod",
      confidence: 0.96,
      alternative_codes: [
        { code: "0305.49", description: "Other dried fish", confidence: 0.76 },
        { code: "0302.89", description: "Other fresh or chilled fish", confidence: 0.35 },
      ],
      restricted_air_cargo: true,
      restriction_reason: "Frozen/chilled fish products require controlled temperature handling not compatible with standard air freight. Sea freight with cold chain mandatory.",
      estimated_duty_rate: 5,
      notes: "⚠️ Air freight RESTRICTED. Must use refrigerated sea container.",
    };
  }
  
  if (desc.includes("toyota") || desc.includes("camry") || desc.includes("car") || desc.includes("sedan")) {
    return {
      suggested_code: "8703.23",
      description: "Motor cars for transport of persons — spark-ignition engine, 1500–3000cc",
      confidence: 0.99,
      alternative_codes: [
        { code: "8703.24", description: "Motor cars — spark-ignition engine, >3000cc", confidence: 0.72 },
        { code: "8703.22", description: "Motor cars — spark-ignition engine, 1000–1500cc", confidence: 0.55 },
      ],
      restricted_air_cargo: true,
      restriction_reason: "Vehicles cannot be transported by air freight. Sea freight only (RoRo or container).",
      estimated_duty_rate: 35,
      notes: "Import duty to Nigeria: 35% + 7% port levy. Recommend RoRo vessel for cost savings.",
    };
  }
  
  if (desc.includes("excavator") || desc.includes("bulldozer") || desc.includes("crane")) {
    return {
      suggested_code: "8429.52",
      description: "Machinery with a rotating superstructure (excavators)",
      confidence: 0.98,
      alternative_codes: [
        { code: "8426.41", description: "Self-propelled cranes on tyres", confidence: 0.67 },
        { code: "8429.11", description: "Angle dozers, crawler", confidence: 0.43 },
      ],
      restricted_air_cargo: true,
      restriction_reason: "Heavy machinery (>10 tons) is not eligible for air freight.",
      estimated_duty_rate: 10,
      notes: "Duty concessions may apply under ECOWAS trade agreements.",
    };
  }
  
  if (desc.includes("palm oil")) {
    return {
      suggested_code: "1511.10",
      description: "Palm oil, crude",
      confidence: 0.99,
      alternative_codes: [
        { code: "1511.90", description: "Palm oil, refined/other", confidence: 0.81 },
        { code: "1513.21", description: "Crude palm kernel oil", confidence: 0.52 },
      ],
      restricted_air_cargo: false,
      estimated_duty_rate: 0,
      notes: "Zero duty under most trade agreements. EU import regulations require RSPO certification.",
    };
  }
  
  if (desc.includes("smartphone") || desc.includes("samsung") || desc.includes("iphone") || desc.includes("phone")) {
    return {
      suggested_code: "8517.13",
      description: "Smartphones — cellular telephone handsets",
      confidence: 0.99,
      alternative_codes: [
        { code: "8517.14", description: "Other handsets for cellular networks", confidence: 0.78 },
        { code: "8471.30", description: "Portable automatic data processing machines", confidence: 0.41 },
      ],
      restricted_air_cargo: false,
      estimated_duty_rate: 20,
      notes: "Import duty: 20% (HS 8517). Lithium battery devices require ICAO Packing Instructions compliance.",
    };
  }
  
  // Default response
  return {
    suggested_code: "9999.99",
    description: "Unclassified goods — manual review required",
    confidence: 0.42,
    alternative_codes: [],
    restricted_air_cargo: false,
    estimated_duty_rate: undefined,
    notes: "AI could not confidently classify this product. Please provide more details or contact EKDA customs team.",
  };
}

export default function HSCodeToolPage() {
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIHSCodeSuggestion | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const handleAnalyze = async () => {
    if (!productDescription.trim()) {
      toast.error("Please enter a product description");
      return;
    }
    setIsLoading(true);
    setResult(null);
    
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const suggestion = simulateAIHSCode(productDescription);
    setResult(suggestion);
    setIsLoading(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("HS Code copied!");
  };

  const confidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600";
    if (confidence >= 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const confidenceBg = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800";
    if (confidence >= 0.7) return "bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    return "bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800";
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-ekda-gold-500 to-ekda-gold-700 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI HS Code Engine</h1>
          <p className="text-muted-foreground text-sm">
            Automatic Harmonized System Code classification powered by AI
          </p>
        </div>
        <Badge variant="gold" className="ml-auto">
          <Sparkles className="h-3 w-3" />
          AI Powered
        </Badge>
      </div>

      {/* Input Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Product Description <span className="text-destructive">*</span>
            </label>
            <textarea
              className="w-full h-28 px-4 py-3 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              placeholder="Describe your product in detail. Example: 'Dried crayfish from Badagry Creek, Nigeria. Sun-dried freshwater crayfish, rich in protein, packaged in sealed bags. Used in West African soups.'"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category (optional)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Auto-detect</option>
                <option value="groceries">African Groceries</option>
                <option value="dried_produce">Dried Produce</option>
                <option value="frozen_produce">Frozen Produce</option>
                <option value="agri_commodities">Agri Commodities</option>
                <option value="vehicles">Vehicles</option>
                <option value="electronics">Electronics</option>
                <option value="machinery">Machinery</option>
                <option value="general_goods">General Goods</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Origin Country</label>
              <select className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Nigeria (NG)</option>
                <option>United States (US)</option>
                <option>United Kingdom (GB)</option>
                <option>Germany (DE)</option>
                <option>China (CN)</option>
                <option>Japan (JP)</option>
              </select>
            </div>
          </div>

          {/* Example prompts */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PRODUCTS.map((example) => (
                <button
                  key={example}
                  onClick={() => setProductDescription(example)}
                  className="text-xs bg-muted hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            size="lg"
            variant="premium"
            className="w-full"
            loading={isLoading}
          >
            {isLoading ? (
              "Analyzing with AI..."
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Classify with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Main Result */}
            <Card className={cn("border-2", confidenceBg(result.confidence))}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        AI Classification Result
                      </span>
                      <Badge
                        variant={result.confidence >= 0.9 ? "success" : result.confidence >= 0.7 ? "warning" : "error"}
                      >
                        {Math.round(result.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="text-3xl font-bold font-mono text-foreground">
                        {formatHSCode(result.suggested_code)}
                      </code>
                      <button
                        onClick={() => copyCode(result.suggested_code)}
                        className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
                        title="Copy HS Code"
                      >
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                  </div>
                  <div className="text-right">
                    {result.estimated_duty_rate !== undefined && (
                      <div className="bg-background rounded-xl p-3 text-center border border-border">
                        <div className="text-lg font-bold">{result.estimated_duty_rate}%</div>
                        <div className="text-xs text-muted-foreground">Est. Duty Rate</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cargo Restriction Alert */}
                {result.restricted_air_cargo && (
                  <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 mb-4">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm text-destructive mb-1">
                        ✈️ Air Freight RESTRICTED
                      </div>
                      <p className="text-sm text-destructive/80">
                        {result.restriction_reason}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Ship className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          Sea freight strongly recommended
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {!result.restricted_air_cargo && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-sm">
                      <Plane className="h-3.5 w-3.5" />
                      Air freight permitted
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm">
                      <Ship className="h-3.5 w-3.5" />
                      Sea freight available
                    </div>
                  </div>
                )}

                {/* Notes */}
                {result.notes && (
                  <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-xl text-sm">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{result.notes}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alternative Codes */}
            {result.alternative_codes.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <button
                    onClick={() => setShowAlternatives(!showAlternatives)}
                    className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-medium text-sm">
                      Alternative HS Codes ({result.alternative_codes.length})
                    </span>
                    {showAlternatives ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showAlternatives && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                          {result.alternative_codes.map((alt) => (
                            <div key={alt.code} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                              <div>
                                <code className="font-mono font-semibold text-sm">
                                  {formatHSCode(alt.code)}
                                </code>
                                <p className="text-xs text-muted-foreground mt-0.5">{alt.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={cn("text-xs font-medium", confidenceColor(alt.confidence))}>
                                  {Math.round(alt.confidence * 100)}%
                                </span>
                                <button
                                  onClick={() => copyCode(alt.code)}
                                  className="p-1 rounded hover:bg-black/5 transition-colors"
                                >
                                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="premium" className="flex-1">
                <CheckCircle2 className="h-4 w-4" />
                Apply to Product
              </Button>
              <Button variant="outline" onClick={() => { setResult(null); setProductDescription(""); }}>
                <RefreshCw className="h-4 w-4" />
                New Analysis
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
