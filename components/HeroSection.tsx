"use client";

import React from "react";
import { ArrowLeft, Sparkles, Zap, ShieldCheck, Award, MessageCircle } from "lucide-react";

interface HeroSectionProps {
  onStartConfigurator: () => void;
  onExploreCourses: () => void;
}

export default function HeroSection({
  onStartConfigurator,
  onExploreCourses,
}: HeroSectionProps) {
  const whatsappNumber = "201114687759";

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-36 overflow-hidden w-full max-w-full isolate">
      {/* هالات النيون والأضواء الكروية المتحركة في الخلفية مع تحجيمها لمنع تسربها في الهاتف */}
      <div className="ambient-orb w-[220px] sm:w-[450px] h-[220px] sm:h-[450px] bg-af-yellow/15 top-12 right-1/4 animate-float pointer-events-none" />
      <div className="ambient-orb w-[200px] sm:w-[380px] h-[200px] sm:h-[380px] bg-amber-500/10 bottom-8 left-12 animate-float-slow pointer-events-none" />
      <div className="ambient-orb w-[180px] sm:w-[300px] h-[180px] sm:h-[300px] bg-yellow-400/10 top-1/2 left-1/3 animate-pulse-glow pointer-events-none" />

      {/* خطوط تقنية هندسية ناعمة */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center z-10 w-full overflow-hidden">
        {/* البادج العلوي التفاعلي */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-af-card border border-af-yellow/30 text-af-yellow text-[11px] sm:text-xs font-mono font-bold mb-8 shadow-yellow-glow-sm animate-float max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-af-yellow shrink-0" />
          <span className="truncate">AF AGENCY // DIGITAL CREATIVE & PERFORMANCE STUDIO</span>
        </div>

        {/* العنوان الرئيسي المستوحى من رسالة المؤسسة */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.3] text-white mb-6">
          نحقق أحلامك{" "}
          <span className="text-gradient-yellow relative inline-block">
            ونبني معك المستقبل
            <span className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-af-yellow/40 rounded-full" />
          </span>
        </h1>

        {/* النص التوضيحي المؤسسي الرصين */}
        <p className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-af-gray leading-relaxed mb-10 font-normal">
          حلول رقمية متكاملة تشمل تطوير الويب فائق السرعة، تصميم الهويات المؤسسية، إدارة الحملات الإعلانية الموجهة بالأداء، والتدريب الاحترافي بأحدث أدوات الذكاء الاصطناعي.
        </p>

        {/* أزرار الإجراء السريع */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto mb-14 w-full">
          <button
            onClick={onStartConfigurator}
            className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-af-yellow hover:bg-af-yellow-hover text-black font-bold text-xs sm:text-base flex items-center justify-center gap-2 sm:gap-3 shadow-yellow-glow-lg transition-all duration-300 active:scale-95 group hover:-translate-y-0.5"
          >
            <span>صمم باقتك المخصصة // Configure Project</span>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1.5 transition-transform shrink-0" />
          </button>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello AF AGENCY, I would like to consult with you regarding a new project.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-af-card hover:bg-af-card-hover border border-white/10 hover:border-emerald-500/50 text-white font-bold text-xs sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>استشارة مباشرة عبر WhatsApp</span>
          </a>
        </div>

        {/* شريط الإثبات السريع والمقاييس */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5 text-right w-full">
          <div className="af-glass-card p-3 sm:p-4 rounded-2xl group min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">Ultra Fast Performance</p>
                <p className="text-af-muted text-[10px] sm:text-[11px] truncate">تحميل فوري للأجهزة</p>
              </div>
            </div>
          </div>

          <div className="af-glass-card p-3 sm:p-4 rounded-2xl group min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">Bespoke Design</p>
                <p className="text-af-muted text-[10px] sm:text-[11px] truncate">معايير تصميم حصرية</p>
              </div>
            </div>
          </div>

          <div className="af-glass-card p-3 sm:p-4 rounded-2xl group min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">Global Cloud Network</p>
                <p className="text-af-muted text-[10px] sm:text-[11px] truncate">بنية سحابية فائقة الأمان</p>
              </div>
            </div>
          </div>

          <div className="af-glass-card p-3 sm:p-4 rounded-2xl group min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">AI-Powered Workflow</p>
                <p className="text-af-muted text-[10px] sm:text-[11px] truncate">أدوات الذكاء الاصطناعي</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
