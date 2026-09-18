"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioItems } from "@/data/services";
import { ArrowUpLeft, Layers } from "lucide-react";

export default function PortfolioShowcase() {
  const [filter, setFilter] = useState<"all" | "web" | "branding" | "marketing">("all");

  const filteredItems =
    filter === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.categoryTag === filter);

  return (
    <section id="portfolio" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-af-card border border-white/10 text-af-yellow text-xs font-mono font-bold mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>[ 03 ] // SELECTED CASE STUDIES & IMPACT</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
              أعمال صنعت الفارق لشركاء نجاحنا
            </h2>
          </div>

          {/* فلاتر التصنيف */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                filter === "all"
                  ? "bg-af-yellow text-black shadow-sm"
                  : "bg-af-card text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              All Works
            </button>
            <button
              onClick={() => setFilter("web")}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                filter === "web"
                  ? "bg-af-yellow text-black shadow-sm"
                  : "bg-af-card text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              Web & UI/UX
            </button>
            <button
              onClick={() => setFilter("branding")}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                filter === "branding"
                  ? "bg-af-yellow text-black shadow-sm"
                  : "bg-af-card text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              Branding
            </button>
            <button
              onClick={() => setFilter("marketing")}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                filter === "marketing"
                  ? "bg-af-yellow text-black shadow-sm"
                  : "bg-af-card text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              Performance Ads
            </button>
          </div>
        </motion.div>

        {/* شبكة الأعمال مع كروت زجاجية وهوفر تفاعلي وانتقال سلس */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -6 }}
                className="group rounded-3xl af-glass-card overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#0A0C10]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent opacity-85" />
                  <div className="absolute top-4 right-4">
                    <span className="text-[11px] font-mono font-bold bg-[#060709]/85 backdrop-blur-md text-af-light border border-white/10 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between">
                    <span className="text-xs font-mono font-black bg-af-yellow text-black px-3 py-1.5 rounded-lg shadow-sm">
                      {item.results}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4 mb-2.5">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-af-yellow transition-colors">
                      {item.title}
                    </h3>
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-af-gray group-hover:text-af-yellow group-hover:border-af-yellow/40 transition-colors shrink-0">
                      <ArrowUpLeft className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
