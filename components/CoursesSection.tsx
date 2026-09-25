"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  Bot,
  Layers,
  CheckCircle2,
  ArrowLeft,
  Flame,
  Award,
  Users,
} from "lucide-react";
import { useRegion } from "@/context/RegionContext";
import { trackServiceInterest } from "@/lib/analytics";

interface CoursesSectionProps {
  onBookCourse: (courseTitle: string, priceDisplay?: string) => void;
}

export default function CoursesSection({ onBookCourse }: CoursesSectionProps) {
  const { currency } = useRegion();

  const isSAR = currency === "SAR";

  const courses = [
    {
      id: "course-graphic-design",
      title: "كورس أساسيات الجرافيك ديزاين",
      englishTitle: "Graphic Design Fundamentals",
      software: "Photoshop & Illustrator",
      description:
        "تعلم أساسيات التصميم الجرافيكي الاحترافي من الصفر عبر برنامجي فوتوشوب وإليستريتور مع تطبيقات عملية للمشاريع.",
      price: isSAR ? "300 ر.س" : "3,000 ج.م",
      originalPrice: isSAR ? "600 ر.س" : "6,000 ج.م",
      discountBadge: "خصم 50% للطلاب وحديثي التخرج",
      seatNotice: "متاح حتى اكتمال المقاعد",
      icon: Layers,
      highlight: false,
      features: [
        "إتقان أدوات وتقنيات برنامج أدوبي فوتوشوب (Photoshop)",
        "إتقان أدوات وتقنيات برنامج أدوبي إليستريتور (Illustrator)",
        "مخصص للطلاب وحديثي التخرج لتأسيس المهارات من الصفر",
        "تطبيقات ومشاريع عملية على التصاميم خلال فترة الكورس",
        "شهادة إكمال المسار التدريبي من الأكاديمية",
      ],
    },
    {
      id: "course-ai",
      title: "كورس أدوات الذكاء الاصطناعي (AI)",
      englishTitle: "AI Video & Ads Creation",
      software: "AI Tools & Video Generation",
      description:
        "تعلم أحدث تقنيات وأدوات الذكاء الاصطناعي المتخصصة في صناعة وتوليد مقاطع الفيديو والإعلانات الرقمية بكفاءة عالية.",
      price: isSAR ? "300 ر.س" : "3,000 ج.م",
      originalPrice: isSAR ? "600 ر.س" : "6,000 ج.م",
      discountBadge: "خصم 50% للطلاب وحديثي التخرج",
      seatNotice: "متاح حتى اكتمال المقاعد",
      icon: Bot,
      highlight: false,
      features: [
        "تعلم إنشاء وتوليد مقاطع الفيديو بالذكاء الاصطناعي",
        "صناعة وتصميم الإعلانات الرقمية الترويجية بأدوات الذكاء الاصطناعي",
        "مخصص للطلاب وحديثي التخرج لمواكبة متطلبات السوق",
        "تطبيقات عملية لإنتاج مواد إعلانية وفيديوهات متكاملة",
        "شهادة إكمال المسار التدريبي من الأكاديمية",
      ],
    },
    {
      id: "course-pro-bundle",
      title: "الكورس البرو (جرافيك ديزاين + ذكاء اصطناعي)",
      englishTitle: "Pro Course - Graphic Design & AI",
      software: "Photoshop + Illustrator + AI Video & Ads",
      description:
        "المسار المتكامل الأقوى: يجمع بين مسار أساسيات الجرافيك ديزاين ومسار الذكاء الاصطناعي في باقة واحدة شاملة بأعلى نسبة توفير.",
      price: isSAR ? "450 ر.س" : "4,500 ج.م",
      originalPrice: isSAR ? "800 ر.س" : "8,000 ج.م",
      discountBadge: "توفير 3,500 ج.م - الباقة الشاملة",
      seatNotice: "للطلاب وحديثي التخرج فقط وحتى اكتمال المقاعد",
      icon: Sparkles,
      highlight: true,
      features: [
        "يشمل مسار أساسيات الجرافيك ديزاين كاملاً (فوتوشوب + إليستريتور)",
        "يشمل مسار الذكاء الاصطناعي كاملاً (إنشاء الفيديوهات والإعلانات)",
        "دمج مهارات التصميم الجرافيكي مع أدوات الذكاء الاصطناعي في مشاريع مشتركة",
        "مخصص حصرياً للطلاب وحديثي التخرج",
        "شهادة إكمال المسار الشامل (Pro Track) من الأكاديمية",
      ],
    },
  ];

  return (
    <section id="courses" className="py-20 md:py-28 relative scroll-mt-20">
      {/* هالة خلفية ناعمة */}
      <div className="ambient-orb w-96 h-96 bg-af-yellow/10 top-1/2 left-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>[ 02 ] // AF ACADEMY TRACKS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            المسارات التدريبية الاحترافية
          </h2>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            عروض خاصة وحصرية للطلاب وحديثي التخرج لتأهيلهم لسوق العمل بأسعار مدعومة وحتى اكتمال المقاعد المحددة.
          </p>
        </motion.div>

        {/* شبكة الكروت الثلاثة المتناسقة */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {courses.map((course, idx) => {
            const Icon = course.icon;
            const isPro = course.highlight;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border ${
                  isPro
                    ? "bg-gradient-to-b from-[#141824] to-[#0A0C10] border-af-yellow shadow-yellow-glow ring-1 ring-af-yellow"
                    : "af-glass-card border-white/10 hover:border-white/30"
                }`}
              >
                {/* بادج التميز للكورس البرو */}
                {isPro && (
                  <div className="absolute top-0 right-0 left-0 bg-af-yellow text-black text-[11px] font-mono font-black py-1.5 text-center tracking-wider uppercase">
                    RECOMMENDED // الباقة الأكثر شمولاً وتوفيراً
                  </div>
                )}

                <div className={isPro ? "pt-4" : ""}>
                  {/* رأس الكارت */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-2xl border ${
                          isPro
                            ? "bg-af-yellow text-black border-af-yellow"
                            : "bg-af-yellow/10 text-af-yellow border-af-yellow/30"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-af-yellow bg-af-yellow/10 px-2.5 py-0.5 rounded-full border border-af-yellow/20 block w-fit mb-1">
                          {course.software}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                          {course.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed mb-6">
                    {course.description}
                  </p>

                  {/* قسم السعر المشطوب والعرض */}
                  <div className="bg-[#06080E] p-4 rounded-2xl border border-white/10 mb-6 text-right">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] text-gray-400">سعر الكورس بالعرض:</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {course.discountBadge}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-af-yellow font-mono">
                        {course.price}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through font-mono">
                        {course.originalPrice}
                      </span>
                    </div>

                    {/* تنبيه المقاعد والطلاب */}
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-medium text-gray-300">
                      <span className="text-af-yellow font-bold">{course.seatNotice}</span>
                      <span className="text-gray-400">طلاب وحديثي تخرج</span>
                    </div>
                  </div>

                  {/* قائمة المميزات الدقيقة */}
                  <div className="space-y-2.5 mb-8">
                    <h4 className="text-[11px] font-mono font-bold text-af-yellow uppercase mb-2">
                      محتويات ومميزات الدورة:
                    </h4>
                    {course.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* زر التسجيل الفوري */}
                <button
                  onClick={() => {
                    trackServiceInterest({
                      serviceName: `حجز ${course.title}`,
                      category: "courses",
                      notes: `نقر على تسجيل في [${course.title}] بسعر [${course.price}]`,
                    });
                    onBookCourse(course.title, course.price);
                  }}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm ${
                    isPro
                      ? "bg-af-yellow hover:bg-af-yellow-hover text-black shadow-yellow-glow"
                      : "bg-af-yellow/90 hover:bg-af-yellow text-black shadow-yellow-glow-sm"
                  }`}
                >
                  <span>حجز مقعد في الكورس // Enroll</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
