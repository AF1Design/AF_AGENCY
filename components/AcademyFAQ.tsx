"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function AcademyFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "هل أحتاج إلى معرفة أو خبرة سابقة في التصميم للتسجيل؟",
      a: "لا، نبدأ معك في كل مسار من أساسيات التكوين البصري وتنسيق الألوان حتى مراحل الاحتراف المتقدمة، مع التدرج السلس حتى يتمكن أي مبتدئ شغوف من الوصول لمستوى احترافي.",
    },
    {
      q: "كيف يتم تقديم التدريب وهل هو أونلاين أم حضوري؟",
      a: "التدريب يتم أونلاين عبر ورش تفاعلية حية ومباشرة (Live Sessions) مع إتاحة التسجيلات بجودة فائقة، بالإضافة لجلسات إشراف وتطبيق فردي وتصحيح تفاعلي للمشاريع.",
    },
    {
      q: "ما هي البرامج والأجهزة المطلوبة للبدء؟",
      a: "تحتاج إلى جهاز كمبيوتر أو لابتوب بمواصفات متوسطة لتشغيل برامج التصميم الأساسية، بالإضافة لمتصفح إنترنت حديث لاستخدام أدوات الذكاء الاصطناعي التوليدي عبر السحابة.",
    },
    {
      q: "هل أحصل على شهادة بعد إتمام التدريب؟",
      a: "نعم، يحصل كل متدرب يجتاز متطلبات المشاريع التطبيقية على شهادة إكمال من AF ACADEMY تحتوي على رقم تسلسلي للتحقق تثبت إنجازه لكافة التطبيقات العملية، مما يعزز موثوقية ملفك المهني.",
    },
    {
      q: "ما هي طرق الدفع المتاحة لحجز المقعد؟",
      a: "نوفر وسائل دفع متعددة ومرنة تناسب الجميع داخل مصر وعبر دول الخليج، تشمل المحافظ الإلكترونية، التحويل البنكي، والبطاقات الائتمانية مع إمكانية التنسيق المالي المريح.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="academy-faq" className="py-20 md:py-28 relative scroll-mt-20 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>[ 04 ] // FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
            الأسئلة الشائعة حول الأكاديمية
          </h2>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            إجابات واضحة ومباشرة لأبرز الاستفسارات التي تهم المتدربين قبل التسجيل.
          </p>
        </motion.div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="af-glass-card rounded-2xl border border-white/10 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg bg-af-yellow/10 text-af-yellow transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 bg-af-yellow text-black" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
