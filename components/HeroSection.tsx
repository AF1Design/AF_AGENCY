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
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-36 overflow-hidden">
      {/* هالات النيون والأضواء الكروية المتحركة في الخلفية */}
      <div className="ambient-orb w-[450px] h-[450px] bg-af-yellow/15 top-12 right-1/4 animate-float pointer-events-none" />
      <div className="ambient-orb w-[380px] h-[380px] bg-amber-500/10 bottom-8 left-12 animate-float-slow pointer-events-none" />
      <div className="ambient-orb w-[300px] h-[300px] bg-yellow-400/10 top-1/2 left-1/3 animate-pulse-glow pointer-events-none" />

      {/* خطوط تقنية هندسية ناعمة */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center z-10">
        {/* البادج العلوي التفاعلي */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-af-card border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-8 shadow-yellow-glow-sm animate-float">
          <Sparkles className="w-3.5 h-3.5 text-af-yellow" />
          <span className="tracking-wide">AF AGENCY // DIGITAL CREATIVE & PERFORMANCE STUDIO</span>
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-lg mx-auto mb-16">
          <button
            onClick={onStartConfigurator}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-af-yellow hover:bg-af-yellow-hover text-black font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-yellow-glow-lg transition-all duration-300 active:scale-95 group hover:-translate-y-0.5"
          >
            <span>صمم باقتك المخصصة // Configure Project</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
          </button>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello AF AGENCY, I would like to consult with you regarding a new project.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-af-card hover:bg-af-card-hover border border-white/10 hover:border-emerald-500/50 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>استشارة مباشرة عبر WhatsApp</span>
          </a>
        </div>

        {/* شريط الإثبات السريع والمقاييس */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 text-right">
          <div className="af-glass-card p-4 rounded-2xl group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm">Ultra Fast Performance</p>
                <p className="text-af-muted text-[11px]">تحميل فوري للأجهزة الذكية</p>
              </div>
            </div>
          </div>

          <div className="af-glass-card p-4 rounded-2xl group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm">Bespoke Design</p>
                <p className="text-af-muted text-[11px]">معايير تصميم حصرية</p>
              </div>
            </div>
          </div>

          <div className="af-glass-card p-4 rounded-2xl group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm">Global Cloud Network</p>
                <p className="text-af-muted text-[11px]">بنية سحابية فائقة السرعة والأمان</p>
              </div>
            </div>
          </div>

          <div className="af-glass-card p-4 rounded-2xl group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm">AI-Powered Workflow</p>
                <p className="text-af-muted text-[11px]">أدوات الذكاء الاصطناعي</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
