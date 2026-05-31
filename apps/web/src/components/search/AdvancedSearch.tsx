"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Camera,
  Mic,
  Filter,
  X,
  Loader2,
  SlidersHorizontal,
  Globe,
  Leaf,
  Clock,
  CheckCircle2,
  Sparkles,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const DIASPORA_FILTER_PRESETS = [
  { id: "uk_friendly", label: "🇬🇧 UK-Friendly", description: "HMRC pre-cleared, Tilbury port ready" },
  { id: "us_ready", label: "🇺🇸 US-Ready", description: "FDA-compliant, US customs cleared" },
  { id: "halal", label: "☪️ Halal Certified", description: "Third-party Halal verified products" },
  { id: "organic", label: "🌿 Organic Certified", description: "NAFDAC/international organic certified" },
  { id: "fastest_canada", label: "🇨🇦 Fastest to Canada", description: "Air-eligible, ships within 48h" },
  { id: "bulk_ready", label: "📦 Bulk/Container Ready", description: "Supports 20ft/40ft container orders" },
  { id: "farm_direct", label: "🌾 Farm Direct", description: "Purchased directly from verified farmers" },
  { id: "carbon_neutral", label: "🌳 Carbon Neutral", description: "Ships with carbon offset included" },
];

const VOICE_COMMANDS = [
  "Find dried crayfish under ₦10,000",
  "Show me palm oil for UK delivery",
  "What's cheapest to import Toyota to Nigeria?",
  "Halal certified groceries",
];

interface AdvancedSearchProps {
  onSearch?: (query: string, filters: string[]) => void;
  placeholder?: string;
  showVisualSearch?: boolean;
}

export function AdvancedSearch({
  onSearch,
  placeholder = "Search products, vendors, HS codes...",
  showVisualSearch = true,
}: AdvancedSearchProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVisualSearch, setIsVisualSearch] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [visualSearchResults, setVisualSearchResults] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Voice search not supported in this browser");
      return;
    }
    setIsListening(true);
    // Simulate voice recognition for demo
    setTimeout(() => {
      const randomQuery = VOICE_COMMANDS[Math.floor(Math.random() * VOICE_COMMANDS.length)];
      setQuery(randomQuery!);
      setIsListening(false);
      toast.success("Voice captured: " + randomQuery);
    }, 2000);
  };

  const handleVisualSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    setIsVisualSearch(true);
    setAnalyzing(true);

    // Simulate AI visual search
    await new Promise((r) => setTimeout(r, 2500));
    setVisualSearchResults([
      "Dried Egusi Seeds (91% match)",
      "Ground Melon Seeds (88% match)",
      "Pumpkin Seeds (72% match)",
    ]);
    setAnalyzing(false);
    toast.success("🔍 Visual search complete — 3 matches found!");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, activeFilters);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center gap-2 h-14 bg-background border-2 border-border rounded-2xl px-4 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center gap-1 border-l border-border pl-2">
            {/* Voice Search */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
                isListening ? "bg-red-100 text-red-600 animate-pulse" : "hover:bg-muted text-muted-foreground"
              )}
              title="Voice search"
            >
              <Mic className="h-3.5 w-3.5" />
            </button>
            {/* Visual Search */}
            {showVisualSearch && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                title="Search by image"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleVisualSearch} />
            {/* Filters Toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center transition-all relative",
                showFilters || activeFilters.length > 0 ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {activeFilters.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>
          {query && (
            <Button type="submit" size="sm" className="h-8 px-3 rounded-xl flex-shrink-0">
              Search
            </Button>
          )}
        </div>
      </form>

      {/* Visual Search Result */}
      <AnimatePresence>
        {isVisualSearch && uploadedImage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-3 bg-muted/40 rounded-2xl border border-border"
          >
            <img src={uploadedImage} alt="Search" className="h-14 w-14 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-ekda-gold-600" />
                <span className="text-xs font-semibold">Visual Search</span>
                {analyzing && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              </div>
              {analyzing ? (
                <p className="text-xs text-muted-foreground">AI analyzing your image...</p>
              ) : (
                <div className="space-y-1">
                  {visualSearchResults.map((result) => (
                    <div key={result} className="text-xs text-muted-foreground flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => { setIsVisualSearch(false); setUploadedImage(null); setVisualSearchResults([]); }}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeFilters.map((filterId) => {
            const filter = DIASPORA_FILTER_PRESETS.find((f) => f.id === filterId);
            return (
              <button
                key={filterId}
                onClick={() => toggleFilter(filterId)}
                className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                {filter?.label}
                <X className="h-3 w-3" />
              </button>
            );
          })}
          <button
            onClick={() => setActiveFilters([])}
            className="flex items-center gap-1 px-2.5 py-1 bg-muted text-muted-foreground rounded-full text-xs hover:bg-muted/80 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Presets Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-muted/30 rounded-2xl border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Quick Filter Presets
                </span>
                <Badge variant="outline" className="text-[10px]">
                  <Globe className="h-2.5 w-2.5 mr-1" />
                  Diaspora Optimized
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DIASPORA_FILTER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => toggleFilter(preset.id)}
                    className={cn(
                      "flex flex-col items-start p-2.5 rounded-xl border-2 text-left transition-all",
                      activeFilters.includes(preset.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <span className="text-xs font-semibold mb-0.5">{preset.label}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
