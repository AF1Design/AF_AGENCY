"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServiceConfigurator from "@/components/ServiceConfigurator";
import CoursesSection from "@/components/CoursesSection";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import OrderModal from "@/components/OrderModal";
import CursorSpotlight from "@/components/CursorSpotlight";
import ClientAssurance from "@/components/ClientAssurance";
import WelcomeGateModal from "@/components/WelcomeGateModal";
import { useRegion } from "@/context/RegionContext";
import { ServiceCategory, RegionCurrency } from "@/types";
import { MessageCircle } from "lucide-react";

export default function HomePage() {
  const { phone, country, currency } = useRegion();
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

  const handleBookCourse = (courseTitle: string) => {
    const courseConfig = {
      serviceCategory: "courses" as ServiceCategory,
      serviceTitle: "AI & Graphic Design Academy",
      packageName: courseTitle,
      packageId: "course-direct-booking",
      addons: ["Certified Official Credential"],
    };
    setCurrentOrder(courseConfig);
    setIsModalOpen(true);

    // تسجيل اهتمام الكورس
    if (phone && phone !== "011111111112") {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "مهتم بحجز دورة تدريبية",
          phone: phone,
          country: country === "EG" ? "مصر" : "الخليج العربي",
          currency: currency,
          serviceCategory: "courses",
          selectedPackage: courseTitle,
          leadType: "intent",
          adSource: "ضغط على حجز كورس تعليمي",
          clientNotes: `أبدى اهتماماً بدورة: [${courseTitle}]`,
        }),
      }).catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-[#060709] text-af-light selection:bg-af-yellow selection:text-black relative overflow-x-hidden">
      {/* مؤثر ضوء الماوس التفاعلي الذي يتحرك مع العميل ويضيء البطاقات والشبكة الهندسية */}
      <CursorSpotlight />

        {/* شريط التنقل العلوي العالمي */}
        <Navbar onOpenConfigurator={handleOpenConfigurator} />

        {/* قسم الترحيب الرئيسي بالخلفية المتحركة */}
        <HeroSection
          onStartConfigurator={handleOpenConfigurator}
          onExploreCourses={handleExploreCourses}
        />

        {/* ميثاق الثقة والأمان: المعاينة الحية أولاً، لوحة التحكم، التقسيط، التوسع، وكود الاستجابة السريع */}
        <ClientAssurance />

        {/* مخصص الباقات وحاسبة الخدمات التفاعلية */}
        <ServiceConfigurator onProceedToOrder={handleProceedToOrder} />

        {/* قسم أكاديمية الكورسات والذكاء الاصطناعي */}
        <CoursesSection onBookCourse={handleBookCourse} />

        {/* سابقة الأعمال والإنجازات */}
        <PortfolioShowcase />

        {/* لماذا نحن ومعايير التميز */}
        <WhyChooseUs />

        {/* تذييل الصفحة الغني بحسابات السوشيال ميديا وواتساب */}
        <Footer />

        {/* نافذة إتمام الطلب والتحويل للواتساب */}
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderData={currentOrder}
        />

        {/* زر الواتساب العائم السريع للتحويل المباشر من إعلانات الموبايل */}
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello AF AGENCY, I would like to inquire about your services.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-2xl transition-all duration-300 active:scale-95 hover:shadow-emerald-500/30 hover:-translate-y-1 font-mono"
          >
            <div className="relative">
              <MessageCircle className="w-4.5 h-4.5 text-black" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-af-yellow animate-ping" />
            </div>
            <span className="hidden sm:inline font-sans font-bold">Direct WhatsApp // تواصل مباشر</span>
            <span className="sm:hidden text-[11px]">01114687759</span>
          </a>
        </div>
      </main>
  );
}
