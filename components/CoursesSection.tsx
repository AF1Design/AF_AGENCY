"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  Bot,
  Layers,
  Clock,
  Award,
  Users,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { trackServiceInterest } from "@/lib/analytics";

interface CoursesSectionProps {
  onBookCourse: (courseTitle: string) => void;
}

export default function CoursesSection({ onBookCourse }: CoursesSectionProps) {
  return (
    <section id="courses" className="py-20 md:py-28 relative border-y border-white/10 scroll-mt-20">
      {/* هالة إضاءة خلفية ناعمة */}
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
            <span>[ 02 ] // AF ACADEMY & AI INNOVATION LAB</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            المسارات التدريبية المتخصصة في التصميم والذكاء الاصطناعي
          </h2>
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
            برامج تدريبية وتطبيقية معتمدة من AF AGENCY لتطوير المهارات التنافسية في سوق التصميم وأحدث أدوات الذكاء الاصطناعي.
          </p>
        </motion.div>

        {/* الكروت التفاعلية للكورسات */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* كورس 1: دبلومة الجرافيك ديزاين */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            className="af-glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-af-yellow/10 text-af-yellow border border-af-yellow/30">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-af-yellow bg-af-yellow/10 px-2 py-0.5 rounded-full border border-af-yellow/20">
                      MASTERCLASS DIPLOMA
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold text-white mt-1">
                      Graphic Design & Professional Practice
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-gray-200 text-sm leading-relaxed mb-6">
                مسار مهني وتطبيقي شامل يؤهلك لإتقان صناعة الهويات والتصاميم الإعلانية وإدارة المشاريع وفق المعايير العالمية.
              </p>

              {/* مواصفات الكورس */}
              <div className="grid grid-cols-3 gap-2.5 mb-6 py-3 border-y border-white/10 text-center font-mono">
                <div className="bg-[#0A0C10] p-2.5 rounded-xl border border-white/5">
                  <Clock className="w-4 h-4 text-af-yellow mx-auto mb-1" />
                  <span className="text-[10px] text-af-muted block uppercase">Duration</span>
                  <strong className="text-xs text-white">8 Weeks</strong>
                </div>
                <div className="bg-[#0A0C10] p-2.5 rounded-xl border border-white/5">
                  <Award className="w-4 h-4 text-af-yellow mx-auto mb-1" />
                  <span className="text-[10px] text-af-muted block uppercase">Credential</span>
                  <strong className="text-xs text-white">Certified</strong>
                </div>
                <div className="bg-[#0A0C10] p-2.5 rounded-xl border border-white/5">
                  <Users className="w-4 h-4 text-af-yellow mx-auto mb-1" />
                  <span className="text-[10px] text-af-muted block uppercase">Enrollment</span>
                  <strong className="text-xs text-af-yellow">Limited Seats</strong>
                </div>
              </div>

              {/* المحاور الأساسية */}
              <div className="space-y-2.5 mb-8">
                <h4 className="text-xs font-mono font-bold text-af-yellow uppercase mb-2">
                  Curriculum Highlights:
                </h4>
                <div className="flex items-center gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0" />
                  <span>احتراف برامج التصميم العالمية (Photoshop, Illustrator, InDesign)</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0" />
                  <span>هندسة وتصميم المواد التسويقية والإعلانات الرقمية</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0" />
                  <span>تطوير أنظمة الهوية المؤسسية ودلائل الاستخدام الشاملة</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0" />
                  <span>منهجيات إدارة المشاريع والتسعير والتعاقد المؤسسي</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                trackServiceInterest({
                  serviceName: "دبلومة Graphic Design & Professional Practice",
                  category: "courses",
                  notes: "نقر على زر التسجيل في دبلومة الجرافيك ديزاين المهنية",
                });
                onBookCourse("Graphic Design & Professional Practice");
              }}
              className="w-full py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-yellow-glow-sm transition-all active:scale-98"
            >
              <span>ENROLL NOW // التسجيل في البرنامج</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </motion.div>

          {/* كورس 2: كورس الذكاء الاصطناعي الإبداعي */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            className="af-glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group border-af-yellow/40"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-af-yellow/15 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-af-yellow text-black font-black">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-af-yellow bg-af-yellow/15 px-2 py-0.5 rounded-full border border-af-yellow/30">
                      GENERATIVE AI 2026
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold text-white mt-1">
                      Generative AI for Creative Professionals
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-gray-200 text-sm leading-relaxed mb-6">
                تعلّم استخدام أحدث نماذج الذكاء الاصطناعي التوليدي لإنتاج المخرجات الإبداعية والتصاميم المتقدمة بكفاءة تشغيلية مضاعفة.
              </p>

              {/* مواصفات الكورس */}
              <div className="grid grid-cols-3 gap-2.5 mb-6 py-3 border-y border-white/10 text-center font-mono">
                <div className="bg-[#0A0C10] p-2.5 rounded-xl border border-white/5">
                  <Clock className="w-4 h-4 text-af-yellow mx-auto mb-1" />
                  <span className="text-[10px] text-af-muted block uppercase">Duration</span>
                  <strong className="text-xs text-white">4 Weeks</strong>
                </div>
                <div className="bg-[#0A0C10] p-2.5 rounded-xl border border-white/5">
                  <Award className="w-4 h-4 text-af-yellow mx-auto mb-1" />
                  <span className="text-[10px] text-af-muted block uppercase">Prompts Pack</span>
                  <strong className="text-xs text-white">200+ Prompts</strong>
                </div>
                <div className="bg-[#0A0C10] p-2.5 rounded-xl border border-white/5">
                  <Sparkles className="w-4 h-4 text-af-yellow mx-auto mb-1" />
                  <span className="text-[10px] text-af-muted block uppercase">Method</span>
                  <strong className="text-xs text-af-yellow font-mono">Hands-on</strong>
                </div>
              </div>

              {/* المحاور الأساسية */}
              <div className="space-y-2.5 mb-8">
                <h4 className="text-xs font-mono font-bold text-af-yellow uppercase mb-2">
                  Skills Mastered:
                </h4>
                <div className="flex items-center gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0" />
                  <span>توليد صور واقعية وسينمائية فائقة الدقة بنماذج الجيل الحديث</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0" />
                  <span>صناعة وتوليد المقاطع البصرية الترويجية بالذكاء الاصطناعي</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0" />
                  <span>هندسة الأوامر المتقدمة (Advanced Prompt Engineering)</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0" />
                  <span>دمج وتكامل أدوات الذكاء الاصطناعي في بيئات العمل الاحترافية</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                trackServiceInterest({
                  serviceName: "مسار Generative AI for Creative Professionals",
                  category: "courses",
                  notes: "نقر على زر التسجيل في مسار الذكاء الاصطناعي الإبداعي",
                });
                onBookCourse("Generative AI for Creative Professionals");
              }}
              className="w-full py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-yellow-glow transition-all active:scale-98"
            >
              <span>ENROLL IN AI COURSE // التسجيل في مسار الذكاء الاصطناعي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* كارت الباقة المزدوجة الذهبية */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-amber-500/10 via-[#0F131C] to-af-yellow/10 border border-af-yellow/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="text-center md:text-right">
            <span className="text-[10px] font-mono font-bold bg-af-yellow text-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              INTEGRATED EXECUTIVE TRACK
            </span>
            <h3 className="text-base sm:text-2xl font-bold text-white mb-2">
              المسار المهني المزدوج (Graphic Design + Generative AI)
            </h3>
            <p className="text-gray-200 text-sm max-w-xl leading-relaxed">
              مسار تدريبي شامل يدمج بين منهجيات التصميم المؤسسي وأحدث تقنيات الذكاء الاصطناعي التوليدي مع جلسة توجيه استراتيجية مباشرة.
            </p>
          </div>

          <button
            onClick={() => {
              trackServiceInterest({
                serviceName: "المسار المزدوج Integrated Executive Track (Design + AI)",
                category: "courses",
                notes: "نقر على زر التقديم في المسار المهني المزدوج (تصميم + ذكاء اصطناعي)",
              });
              onBookCourse("Integrated Executive Track (Design + AI)");
            }}
            className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-bold text-xs sm:text-sm whitespace-nowrap shadow-yellow-glow active:scale-95 transition-all"
          >
            APPLY FOR TRACK // التقديم في المسار المزدوج
          </button>
        </motion.div>
      </div>
    </section>
  );
}
