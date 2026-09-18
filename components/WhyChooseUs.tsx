"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Target, Cpu, HeadphonesIcon, CheckCircle, Sparkles } from "lucide-react";
import { agencyStats } from "@/data/services";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: Zap,
      title: "Global High-Speed Infrastructure",
      description: "نعتمد أحدث البنى التحتية السحابية العالمية ومحركات الويب فائقة التطور لنحقق سرعة تحميل قياسية في أجزاء من الثانية تضمن بقاء الزوار واستقرار المنظومة.",
    },
    {
      icon: Cpu,
      title: "AI-Powered Creative Automation",
      description: "ندمج أقوى نماذج الذكاء الاصطناعي التوليدي في هندسة الأفكار، صناعة المحتوى البصري، وتحليل السوق لنمنحك تفوقاً حاسماً على منافسيك.",
    },
    {
      icon: Target,
      title: "Conversion-Centered Design (CRO)",
      description: "لا نصمم صفحات للمشاهدة فقط؛ بل نهندس رحلة العميل النفسية خطوة بخطوة لتحفيزه على اتخاذ قرار الشراء والتواصل الفوري عبر WhatsApp.",
    },
    {
      icon: HeadphonesIcon,
      title: "Direct Access & Continuous Support",
      description: "فريق عمل متخصص وتواصل مباشر على مدار الساعة للرد على استفساراتك وتحديث متطلباتك بمنتهى السرعة والاهتمام.",
    },
  ];

  return (
    <section id="why-us" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* إحصائيات الثقة الرقمية مع عدادات حركية متصاعدة وتأثير ظهور تدريجي */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-24">
          {agencyStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
              className="af-glass-card p-6 sm:p-7 rounded-3xl text-center relative overflow-hidden group hover:border-af-yellow/50 transition-colors"
            >
              <div className="text-3xl sm:text-5xl font-black text-af-yellow mb-2 tracking-tight font-mono">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mb-0.5">
                {stat.label}
              </div>
              <div className="text-xs text-af-gray font-normal">
                {stat.arabicLabel}
              </div>
            </motion.div>
          ))}
        </div>

        {/* رأس القسم */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[ 04 ] // IMPACT & COMPETITIVE ADVANTAGE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            لماذا تختار AF AGENCY لتكون شريك نموك؟
          </h2>
          <p className="text-af-gray text-xs sm:text-base leading-relaxed">
            لأننا نؤمن بأن علامتك التجارية تستحق حضوراً رقمياً يليق بطموحك، نضع خلاصة خبراتنا البرمجية والتسويقية لنصنع لك فارقاً حقيقياً بالأرقام.
          </p>
        </motion.div>

        {/* كروت أسباب التميز مع مؤثر ظهور متسلسل بالترتيب */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: idx * 0.12 }}
                whileHover={{ y: -5 }}
                className="af-glass-card p-6 sm:p-8 rounded-3xl flex items-start gap-4 sm:gap-5 group"
              >
                <div className="p-3.5 rounded-2xl bg-af-yellow/10 text-af-yellow border border-af-yellow/30 shrink-0 group-hover:scale-110 group-hover:bg-af-yellow group-hover:text-black transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                    {reason.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-af-gray leading-relaxed font-normal">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* بانر الضمان والالتزام */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 bg-gradient-to-r from-af-card via-[#0A0C11] to-af-card border border-af-yellow/30 rounded-3xl p-5 sm:p-7 flex items-center justify-center gap-3 text-center shadow-xl"
        >
          <CheckCircle className="w-5 h-5 text-af-yellow shrink-0" />
          <span className="text-xs sm:text-sm text-af-light font-bold">
            معايير الجودة والالتزام: تسليم احترافي وفق المعايير العالمية مع ضمان استقرار الأداء ودعم فني مستمر.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
