"use client";

import React from "react";
import { ArrowLeft, Sparkles, GraduationCap, Bot, Award, Users, CheckCircle2, MessageCircle } from "lucide-react";

interface AcademyHeroSectionProps {
  onExploreCourses: () => void;
  onDirectConsultation?: () => void;
}

export default function AcademyHeroSection({
  onExploreCourses,
}: AcademyHeroSectionProps) {
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
        {/* البادج العلوي التفاعلي للأكاديمية */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-af-card border border-af-yellow/30 text-af-yellow text-[11px] sm:text-xs font-mono font-bold mb-8 shadow-yellow-glow-sm animate-float max-w-full">
          <GraduationCap className="w-3.5 h-3.5 text-af-yellow shrink-0" />
          <span className="truncate">AF ACADEMY // CREATIVE & AI INNOVATION LAB</span>
        </div>

        {/* العنوان الرئيسي للأكاديمية */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.3] text-white mb-6">
          اصنع مستقبلك المهني في{" "}
          <span className="text-gradient-yellow relative inline-block">
            التصميم والذكاء الاصطناعي
            <span className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-af-yellow/40 rounded-full" />
          </span>
        </h1>

        {/* النص التوضيحي للأكاديمية */}
        <p className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-af-gray leading-relaxed mb-10 font-normal">
          مسارات تدريبية وتطبيقية مكثفة تؤهلك مباشرة لسوق العمل الحر والشركات. تدريب عملي حقيقي داخل بيئة إنتاج فعلية مع إتقان كامل لأحدث أدوات الذكاء الاصطناعي التوليدي.
        </p>

        {/* أزرار الإجراء السريع */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto mb-14 w-full">
          <button
            onClick={onExploreCourses}
            className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-af-yellow hover:bg-af-yellow-hover text-black font-bold text-xs sm:text-base flex items-center justify-center gap-2 sm:gap-3 shadow-yellow-glow-lg transition-all duration-300 active:scale-95 group hover:-translate-y-0.5"
          >
            <span>استكشف المسارات التدريبية // Explore Tracks</span>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1.5 transition-transform shrink-0" />
          </button>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("مرحباً AF ACADEMY، أود الاستفسار عن تفاصيل الكورسات والمسارات التدريبية المتاحة.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-af-card hover:bg-af-card-hover border border-white/10 hover:border-emerald-500/50 text-white font-bold text-xs sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>استشارة تدريبية عبر WhatsApp</span>
          </a>
        </div>

        {/* شريط الإثبات السريع والمقاييس للأكاديمية */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5 text-right w-full">
          <div className="af-glass-card p-3 sm:p-4 rounded-2xl group min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">Generative AI</p>
                <p className="text-af-muted text-[10px] sm:text-[11px] truncate">أحدث أدوات التوليد</p>
              </div>
            </div>
          </div>

          <div className="af-glass-card p-3 sm:p-4 rounded-2xl group min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">1-on-1 Mentorship</p>
                <p className="text-af-muted text-[10px] sm:text-[11px] truncate">إشراف وتصحيح مباشر</p>
              </div>
            </div>
          </div>

          <div className="af-glass-card p-3 sm:p-4 rounded-2xl group min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">Real Client Work</p>
                <p className="text-af-muted text-[10px] sm:text-[11px] truncate">مشاريع سوق حقيقية</p>
              </div>
            </div>
          </div>

          <div className="af-glass-card p-3 sm:p-4 rounded-2xl group min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-af-yellow/10 text-af-yellow group-hover:scale-110 transition-transform shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">Completion Certificate</p>
                <p className="text-af-muted text-[10px] sm:text-[11px] truncate">شهادة إكمال التدريب</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
