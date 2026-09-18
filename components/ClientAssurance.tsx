"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  QrCode,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function ClientAssurance() {
  const pillars = [
    {
      icon: ShieldCheck,
      badge: "ZERO UPFRONT RISK",
      title: "معاينة حية وتفاعلية أولاً (بدون دفعة مقدمة)",
      description:
        "لا نطلب منك أي مقدم مالي لبدء العمل؛ نقوم بتنفيذ نموذج تفاعلي حي لمشروعك أولاً، تعاين فيه التصميم والسرعة على هاتفك، وعندما ينال رضاك التام نستكمل الإجراءات والتعاقد الرسمي.",
      highlight: "عاين النتيجة الحية بنفسك قبل دفع أي مبلغ",
    },
    {
      icon: LayoutDashboard,
      badge: "FULL CONTROL",
      title: "لوحة تحكم إدارية شاملة وسهلة الاستخدام",
      description:
        "نسلمك لوحة تحكم ذكية ومصممة خصيصاً باللغة العربية تمنحك السيطرة المطلقة على موقعك بنقرة واحدة: تحديث الأسعار، إضافة أو حذف المنتجات والخدمات، إدارة الطلبيات، وإرسال العروض التسويقية دون الحاجة لأي خبرة تقنية.",
      highlight: "إدارة كاملة لموقعك ومنتجاتك بنقرة زر",
    },
    {
      icon: CreditCard,
      badge: "FLEXIBLE FINANCING",
      title: "أنظمة تقسيط وسداد مرنة ومجدولة",
      description:
        "لا تجعل الميزانية عائقاً أمام انطلاقتك؛ إذا كانت متطلبات مشروعك متعددة ولا تتوفر لديك كامل السيولة في البداية، نوفر لك خطط دفع مجدولة وميسرة تتناسب مع التدفق المالي لنشاطك التجاري.",
      highlight: "خطط دفع تناسب ميزانيتك دون تعقيد",
    },
    {
      icon: TrendingUp,
      badge: "SCALABLE ARCHITECTURE",
      title: "تطوير تدريجي مرن مع نمو أعمالك",
      description:
        "لست مضطراً لدفع تكاليف ميزات ضخمة دفعة واحدة؛ نصمم لك موقعك ببنية برمجية معيارية تتيح لك البدء بالأساسيات اليوم، وإضافة أي ميزات أو تطويرات برمجية جديدة في أي وقت مستقبلاً مع نمو مبيعاتك.",
      highlight: "توسع خطوة بخطوة مع تطور أرباحك",
    },
    {
      icon: QrCode,
      badge: "COMPLIMENTARY GIFT",
      title: "رمز استجابة سريع مخصص مجاناً مع كل موقع",
      description:
        "هدية خاصة مع مشروعك: نصمم لك رمز استجابة سريع عالي الدقة بهويتك البصرية، مجهز وجاهز للطباعة على بطاقات العمل، العبوات، والبروشورات ليسهل على عملائك الوصول لموقعك بمجرد مسح الرمز بكاميرا الهاتف.",
      highlight: "مجهز للطباعة الفاخرة والمشاركة الفورية",
    },
  ];

  return (
    <section id="assurance" className="py-20 md:py-28 relative scroll-mt-20 border-b border-white/10 bg-[#080A0E]/60">
      {/* هالة خلفية ناعمة */}
      <div className="ambient-orb w-[500px] h-[500px] bg-af-yellow/10 top-1/3 right-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* رأس القسم */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-4 shadow-yellow-glow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE AF ADVANTAGE // ميثاق الثقة والشراكة المرنة</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            ابدأ مشروعك بأمان تام وبدون أي مخاطرة مالية
          </h2>

          <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
            نحن نتحمل المخاطرة عنك.. نبني لك نسختك التجريبية الحية أولاً لتعاينها بنفسك قبل دفع أي مقدم، مع مرونة كاملة في التقسيط والتطوير المستمر.
          </p>
        </motion.div>

        {/* شبكة المزايا الخمس الذهبية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pillars.slice(0, 3).map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="af-glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-white/10 hover:border-af-yellow/50 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-2xl bg-af-yellow/10 text-af-yellow border border-af-yellow/30 group-hover:scale-110 group-hover:bg-af-yellow group-hover:text-black transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-af-yellow bg-af-yellow/10 px-2.5 py-0.5 rounded-full border border-af-yellow/20">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 group-hover:text-af-yellow transition-colors leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-gray-200 text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-af-yellow">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{pillar.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* الصف السفلي (الكارتان الرابع والخامس بتصميم عريض فخم) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.slice(3, 5).map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (idx + 3) * 0.1 }}
                whileHover={{ y: -6 }}
                className="af-glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-white/10 hover:border-af-yellow/50 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-2xl bg-af-yellow/10 text-af-yellow border border-af-yellow/30 group-hover:scale-110 group-hover:bg-af-yellow group-hover:text-black transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-af-yellow bg-af-yellow/10 px-2.5 py-0.5 rounded-full border border-af-yellow/20">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-white mb-3 group-hover:text-af-yellow transition-colors leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-gray-200 text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-af-yellow">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{pillar.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
