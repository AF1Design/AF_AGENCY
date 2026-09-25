"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Download, Users2, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function AcademyOutcomes() {
  const outcomes = [
    {
      icon: Award,
      title: "شهادة إكمال المسار التدريبي",
      description: "شهادة إكمال رقمية تثبت اجتيازك لكافة متطلبات وتطبيقات المسار التدريبي برقم تسلسلي خاص يمكنك إضافتها لسيرتك الذاتية ولينكد إن.",
    },
    {
      icon: Download,
      title: "حقيبة موارد تصميمية وأدوات ذكاء اصطناعي",
      description: "مكتبة حصرية من ملحقات التصميم، ملفات عمل مفتوحة المصدر، وقوالب موجهة بالذكاء الاصطناعي لتسريع مشاريعك المستقبلية.",
    },
    {
      icon: ShieldCheck,
      title: "مراجعة وتطوير بورتفوليو التخرج",
      description: "جلسة تقييم شاملة لمعرض أعمالك مع تصحيح احترافي لطريقة عرض دراسات الحالة ليصبح جاهزاً لجذب أول عميل فوراً.",
    },
    {
      icon: Users2,
      title: "عضوية مجتمع خريجي AF التفاعلي",
      description: "انضمام حصري لمجتمع خاص بالمتدربين لتبادل الفرص، التحديثات المستمرة في أدوات الذكاء الاصطناعي، ومشاركة عروض المشاريع.",
    },
  ];

  return (
    <section id="academy-outcomes" className="py-20 md:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-4">
            <Award className="w-4 h-4" />
            <span>[ 03 ] // GRADUATION OUTCOMES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            ماذا تجني عند تخرجك من AF ACADEMY؟
          </h2>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            استثمارك في تدريبك يمنحك مخرجات ملموسة تؤهلك للمنافسة بقوة في السوق المحلي والإقليمي.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {outcomes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="af-glass-card rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-af-yellow/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 rounded-xl bg-af-yellow/10 text-af-yellow w-fit mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-af-yellow text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>مشمول تلقائياً لكل متدرب</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
