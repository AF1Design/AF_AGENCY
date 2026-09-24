"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AcademyHeroSection from "@/components/AcademyHeroSection";
import ServiceConfigurator from "@/components/ServiceConfigurator";
import CoursesSection from "@/components/CoursesSection";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import WhyChooseUs from "@/components/WhyChooseUs";
import AcademyWhyUs from "@/components/AcademyWhyUs";
import AcademyOutcomes from "@/components/AcademyOutcomes";
import AcademyFAQ from "@/components/AcademyFAQ";
import Footer from "@/components/Footer";
import OrderModal from "@/components/OrderModal";
import CursorSpotlight from "@/components/CursorSpotlight";
import ClientAssurance from "@/components/ClientAssurance";
import { useRegion } from "@/context/RegionContext";
import { ServiceCategory, RegionCurrency } from "@/types";
import { MessageCircle, GraduationCap, Briefcase, ArrowLeft } from "lucide-react";

export default function HomePage() {
  const { phone, country, currency, portalMode, setPortalMode } = useRegion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<{
    serviceCategory: ServiceCategory;
    serviceTitle: string;
    packageName: string;
    packageId: string;
    addons: string[];
    currency?: RegionCurrency;
    estimatedPrice?: string;
  } | null>(null);

  const whatsappNumber = "201114687759";
  const isAcademy = portalMode === "academy";

  const handleOpenConfigurator = () => {
    const el = document.getElementById("configurator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreCourses = () => {
    const el = document.getElementById("courses");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProceedToOrder = (config: {
    serviceCategory: ServiceCategory;
    serviceTitle: string;
    packageName: string;
    packageId: string;
    addons: string[];
  }) => {
    setCurrentOrder(config);
    setIsModalOpen(true);

    // تسجيل نقرة العميل على الباقة كاهتمام في حال لم يؤكد الطلب
    if (phone && phone !== "011111111112") {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "عميل مهتم (ضغط على الباقة ولم يؤكد)",
          phone: phone,
          country: country === "EG" ? "مصر" : "الخليج العربي",
          currency: currency,
          serviceCategory: config.serviceCategory,
          selectedPackage: config.packageName,
          selectedAddons: config.addons,
          leadType: "intent",
          adSource: "ضغط على الباقة وفتح نافذة الحجز",
          clientNotes: `أبدى اهتماماً بالباقة: [${config.packageName}] للخدمة: [${config.serviceTitle}]`,
        }),
      }).catch(() => {});
    }
  };

  const handleBookCourse = (courseTitle: string, priceDisplay?: string) => {
    const courseConfig = {
      serviceCategory: "courses" as ServiceCategory,
      serviceTitle: "AF ACADEMY",
      packageName: courseTitle,
      packageId: "course-direct-booking",
      addons: [],
      estimatedPrice: priceDisplay,
    };
    setCurrentOrder(courseConfig);
    setIsModalOpen(true);

    // تسجيل اهتمام الكورس
    if (phone && phone !== "011111111112") {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "مهتم بحجز كورس تدريبي",
          phone: phone,
          country: country === "EG" ? "مصر" : "الخليج العربي",
          currency: currency,
          serviceCategory: "courses",
          selectedPackage: `${courseTitle} (${priceDisplay || ""})`,
          leadType: "intent",
          adSource: "ضغط على حجز كورس تدريبي في الأكاديمية",
          clientNotes: `أبدى اهتماماً بكورس: [${courseTitle}] بسعر [${priceDisplay || ""}]`,
        }),
      }).catch(() => {});
    }
  };

  const whatsappFloatingMsg = isAcademy
    ? "مرحباً AF ACADEMY، أود الاستفسار عن تفاصيل الكورسات والمسارات التدريبية المتاحة."
    : "مرحباً AF AGENCY، أود الاستفسار عن باقات وخدمات تطوير الويب والتسويق.";

  return (
    <main className="min-h-screen bg-[#060709] text-af-light selection:bg-af-yellow selection:text-black relative overflow-x-hidden">
      {/* مؤثر ضوء الماوس التفاعلي الذي يتحرك مع العميل ويضيء البطاقات والشبكة الهندسية */}
      <CursorSpotlight />

      {/* شريط التنقل العلوي مع مفتاح التبديل الذكي المتوافق مع الهواتف */}
      <Navbar onOpenConfigurator={handleOpenConfigurator} />

      {/* عرض الأقسام بسلاسة تامة بناءً على الوضع المختار */}
      <AnimatePresence mode="wait">
        {!isAcademy ? (
          <motion.div
            key="agency-portal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* واجهة خدمات المشاريع B2B */}
            <HeroSection
              onStartConfigurator={handleOpenConfigurator}
              onExploreCourses={() => {
                setPortalMode("academy");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />

            {/* ميثاق الثقة والأمان */}
            <ClientAssurance />

            {/* مخصص باقات المشاريع */}
            <ServiceConfigurator onProceedToOrder={handleProceedToOrder} />

            {/* سابقة أعمال الشركات والمشاريع */}
            <PortfolioShowcase />

            {/* لماذا تختار مؤسستنا */}
            <WhyChooseUs />

            {/* جسر التحويل الترويجي للأكاديمية */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
              <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#0E1118] via-[#141824] to-[#0E1118] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="ambient-orb w-64 h-64 bg-af-yellow/10 -top-20 -right-20 pointer-events-none" />
                <div className="space-y-2 text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-af-yellow/10 text-af-yellow text-xs font-mono font-bold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>AF ACADEMY // تأهيل الكوادر والتطوير التقني</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    هل ترغب في تدريب فريقك أو احتراف مهارات التصميم والذكاء الاصطناعي؟
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm max-w-xl">
                    اكتشف برامجنا التدريبية التطبيقية المكثفة التي تصقل مهارات المصممين وتمنحهم الأسبقية بأحدث تقنيات وأدوات الذكاء الاصطناعي.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPortalMode("academy");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-af-yellow hover:bg-af-yellow-hover text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-yellow-glow shrink-0 transition-transform active:scale-95"
                >
                  <span>استكشف مسارات الأكاديمية</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="academy-portal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* واجهة الأكاديمية والتدريب */}
            <AcademyHeroSection onExploreCourses={handleExploreCourses} />

            {/* لماذا أكاديمية AF */}
            <AcademyWhyUs />

            {/* قسم المسارات التدريبية المتخصصة */}
            <CoursesSection onBookCourse={handleBookCourse} />

            {/* الشهادات والمخرجات التنافسية */}
            <AcademyOutcomes />

            {/* الأسئلة الشائعة */}
            <AcademyFAQ />

            {/* جسر التحويل الترويجي لخدمات الشركات */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
              <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#0E1118] via-[#141824] to-[#0E1118] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="ambient-orb w-64 h-64 bg-af-yellow/10 -top-20 -right-20 pointer-events-none" />
                <div className="space-y-2 text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-af-yellow/10 text-af-yellow text-xs font-mono font-bold">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>AF AGENCY // استوديو الحلول والمشاريع الرقمية</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    هل تبحث عن تطوير موقع متكامل أو تصميم هوية تجارية لشركتك؟
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm max-w-xl">
                    استكشف حلولنا البرمجية والتسويقية للشركات ورواد الأعمال مع سرعة فائقة وضمان مالي وميثاق أمان معتمد.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPortalMode("agency");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-af-yellow hover:bg-af-yellow-hover text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-yellow-glow shrink-0 transition-transform active:scale-95"
                >
                  <span>استكشف خدمات ومشاريع الشركات</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تذييل الصفحة الغني بالشعار الديناميكي وحسابات التواصل */}
      <Footer />

      {/* نافذة إتمام الطلب والتحويل للواتساب */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderData={currentOrder}
      />

      {/* زر الواتساب العائم السريع المتكيف مع وضع التصفح */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappFloatingMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-2xl transition-all duration-300 active:scale-95 hover:shadow-emerald-500/30 hover:-translate-y-1 font-mono"
        >
          <div className="relative">
            <MessageCircle className="w-4.5 h-4.5 text-black" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-af-yellow animate-ping" />
          </div>
          <span className="hidden sm:inline font-sans font-bold">
            {!isAcademy ? "Direct WhatsApp // استشارة مشاريع" : "Direct WhatsApp // استشارة تدريب"}
          </span>
          <span className="sm:hidden text-[11px]">01114687759</span>
        </a>
      </div>
    </main>
  );
}
