"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Tag,
  GraduationCap,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { useRegion } from "@/context/RegionContext";

export default function MobileBottomDock() {
  const pathname = usePathname();
  const { portalMode } = useRegion();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // إخفاء الشريط بالكامل في لوحة تحكم الأدمن
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";
  const isSubscriptions = pathname === "/subscriptions" || pathname === "/pricing";
  const isStudentWorks = pathname === "/student-works" || pathname === "/works";

  const whatsappNumber = "201114687759";
  const whatsappMsg =
    portalMode === "academy"
      ? "مرحباً AF ACADEMY، أود الاستفسار عن تفاصيل الكورسات والمسارات التدريبية المتاحة."
      : "مرحباً، أود الاستفسار عن باقات وخدمات المشاريع الرقمية.";

  const handleHomeClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 inset-x-0 z-40 pointer-events-none flex justify-center px-3 xl:hidden">
      <AnimatePresence initial={false}>
        {!isCollapsed ? (
          /* الشريط الكامل الموسع بتصميم النوتش الزجاجي من آبل */
          <motion.nav
            key="dock-expanded"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto relative flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 rounded-full bg-[#080A10]/95 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)_inset] overflow-hidden"
          >
            {/* خط إضاءة زجاجي علوي بنمط آبل */}
            <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {/* زر الرئيسية */}
            <a
              href="/"
              onClick={handleHomeClick}
              className={`relative flex flex-col items-center justify-center px-3 sm:px-4 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 ${
                isHome ? "text-af-yellow font-extrabold" : "text-gray-400 hover:text-white"
              }`}
            >
              {isHome && (
                <span className="absolute inset-0 bg-af-yellow/15 border border-af-yellow/30 rounded-full pointer-events-none" />
              )}
              <Home className="w-4 h-4 mb-0.5 relative z-10 shrink-0" />
              <span className="relative z-10 tracking-tight">الرئيسية</span>
            </a>

            {/* زر الاشتراكات والباقات */}
            <a
              href="/subscriptions"
              className={`relative flex flex-col items-center justify-center px-3 sm:px-4 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 ${
                isSubscriptions
                  ? "text-af-yellow font-extrabold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {isSubscriptions && (
                <span className="absolute inset-0 bg-af-yellow/15 border border-af-yellow/30 rounded-full pointer-events-none" />
              )}
              <div className="relative z-10 flex items-center justify-center">
                <Tag className="w-4 h-4 mb-0.5 shrink-0" />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-af-yellow animate-pulse" />
              </div>
              <span className="relative z-10 tracking-tight">الاشتراكات</span>
            </a>

            {/* زر أعمال الطلبة */}
            <a
              href="/student-works"
              className={`relative flex flex-col items-center justify-center px-3 sm:px-4 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 ${
                isStudentWorks
                  ? "text-af-yellow font-extrabold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {isStudentWorks && (
                <span className="absolute inset-0 bg-af-yellow/15 border border-af-yellow/30 rounded-full pointer-events-none" />
              )}
              <GraduationCap className="w-4 h-4 mb-0.5 relative z-10 shrink-0" />
              <span className="relative z-10 tracking-tight">أعمال الطلبة</span>
            </a>

            {/* زر محادثة الواتساب المباشرة */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col items-center justify-center px-3 sm:px-4 py-1.5 rounded-full text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-all active:scale-95"
            >
              <div className="relative z-10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 mb-0.5 shrink-0 text-emerald-400" />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="relative z-10 tracking-tight text-emerald-400">محادثة</span>
            </a>

            {/* خط فاصل رفيع قبل زر السهم */}
            <div className="w-[1px] h-6 bg-white/10 mx-0.5" />

            {/* زر السهم لإخفاء وتصغير الشريط */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
              title="تصغير شريط الأقسام"
              aria-label="تصغير شريط الأقسام"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.nav>
        ) : (
          /* النوتش الصغير المصغر بنمط Dynamic Island */
          <motion.button
            key="dock-collapsed"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsCollapsed(false)}
            className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#080A10]/95 backdrop-blur-2xl border border-af-yellow/40 shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(255,215,0,0.15)] text-white text-xs font-bold transition-all active:scale-95 hover:border-af-yellow group"
            title="إظهار شريط الأقسام"
            aria-label="إظهار شريط الأقسام"
          >
            <div className="w-2 h-2 rounded-full bg-af-yellow animate-pulse shrink-0" />
            <span className="tracking-tight text-af-light group-hover:text-af-yellow transition-colors">
              الأقسام والأسعار
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-af-yellow group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
