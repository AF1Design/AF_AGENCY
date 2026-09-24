"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Cpu,
  UserCheck,
  Briefcase,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function AcademyWhyUs() {
  const pillars = [
    {
      icon: Briefcase,
      title: "بيئة تدريب إنتاجية حقيقية",
      englishTag: "Studio-Backed Learning",
      description:
        "أنت لا تتدرب في مركز دورات نظري معزول؛ بل تتدرب داخل مطبخ عمل حقيقي ينفذ مشاريع كبرى في السوق، مما يمنحك الخبرة الواقعية للتعامل مع العملاء وضغوط المشاريع.",
      badge: "الخبرة الميدانية",
    },
    {
      icon: Cpu,
      title: "دمج الذكاء الاصطناعي التوليدي",
      englishTag: "AI-First Workflows",
      description:
        "نتجاوز حدود البرامج التقليدية لنعلمك كيف تدمج أقوى محركات الذكاء الاصطناعي التوليدي لإنشاء الأفكار واللوحات المزاجية وتسريع الإنتاج التصميمي بأضعاف مضاعفة.",
      badge: "الريادة التقنية",
    },
    {
      icon: UserCheck,
      title: "إشراف ومتابعة تطبيقية مباشرة",
      englishTag: "1-on-1 Mentorship",
      description:
        "مراجعات تفصيلية لكل مشروع تنفذه، وتصحيح دقيق للأخطاء التكوينية واللونية والهندسية حتى تصل أعمالك إلى مستوى يتطابق مع المعايير العالمية.",
      badge: "التوجيه الفردي",
    },
    {
      icon: Layers,
      title: "بناء بورتفوليو تنافسي جاهز",
      englishTag: "Job-Ready Portfolio",
      description:
        "الهدف النهائي ليس حفظ الأدوات، بل الخروج بملف أعمال واقعي متكامل (Behance & Portfolio) يمكنك من البدء فوراً في جلب العملاء المستقلين أو التقديم على الشركات.",
      badge: "الجاهزية المهنية",
    },
  ];

  return (
    <section id="academy-why" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>[ 01 ] // WHY AF ACADEMY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            لماذا تختار التدريب معنا في AF ACADEMY؟
          </h2>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            نحن نركز على المهارات التي تطلبها الشركات في السوق الفعلي اليوم، ونمنحك أسبقية حاسمة بفضل دمج الذكاء الاصطناعي والخبرة العملية المباشرة.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="af-glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 hover:border-af-yellow/50 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3.5 rounded-2xl bg-af-yellow/10 text-af-yellow border border-af-yellow/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-af-yellow bg-af-yellow/10 px-3 py-1 rounded-full border border-af-yellow/20">
                      {pillar.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-af-yellow/80 uppercase tracking-wider block mb-1">
                    {pillar.englishTag}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-af-yellow text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>معتمد في كافة خطط التدريب والمتابعة</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
