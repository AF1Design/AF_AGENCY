"use client";

import React from "react";
import { useRegion } from "@/context/RegionContext";
import { Globe, RefreshCw } from "lucide-react";

export default function CurrencySwitcher() {
  const { country, currency, toggleCurrency } = useRegion();

  return (
    <button
      onClick={toggleCurrency}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-af-card border border-white/10 hover:border-af-yellow/60 text-xs font-mono font-bold text-white transition-all shadow-sm hover:shadow-yellow-glow-sm group"
      title="انقر للتبديل بين الجنيه المصري والريال السعودي"
    >
      <span className="text-sm">
        {country === "EG" ? "🇪🇬" : "🇸🇦"}
      </span>
      <span className="text-af-yellow font-bold">
        {currency === "EGP" ? "EGP (ج.م)" : "SAR (ر.س)"}
      </span>
      <RefreshCw className="w-3 h-3 text-af-muted group-hover:text-af-yellow group-hover:rotate-180 transition-all duration-300" />
    </button>
  );
}
