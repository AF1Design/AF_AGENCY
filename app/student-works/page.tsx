"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import StudentWorksGallery from "@/components/StudentWorksGallery";
import CoursesSection from "@/components/CoursesSection";
import Footer from "@/components/Footer";
import OrderModal from "@/components/OrderModal";
import CursorSpotlight from "@/components/CursorSpotlight";
import { GraduationCap, Sparkles, MessageCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ServiceCategory } from "@/types";
import { useRegion } from "@/context/RegionContext";
import { trackEvent } from "@/lib/fpixel";

export default function StudentWorksPage() {
  const { phone, clientName, country, currency } = useRegion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<{
    serviceCategory: ServiceCategory;
    serviceTitle: string;
    packageName: string;
    packageId: string;
    addons: string[];
    priceDisplay?: string;
  } | null>(null);

  const whatsappNumber = "201114687759";

  const handleBookCourse = (courseTitle: string, priceDisplay?: string) => {
    const courseConfig = {
      serviceCategory: "courses" as ServiceCategory,
      serviceTitle: "AF ACADEMY",
      packageName: courseTitle,
      packageId: "course-direct-booking",
      addons: [],
      priceDisplay: priceDisplay,
    };
    setCurrentOrder(courseConfig);
    setIsModalOpen(true);

    trackEvent("InitiateCheckout", {
      content_name: courseTitle,
      content_category: "student_works_booking",
      currency: currency,
    });

    if (phone && phone !== "011111111112") {
      const verifiedName = clientName?.trim() || `عميل (${phone})`;
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: verifiedName,
          phone: phone,
          country: country === "EG" ? "مصر" : "الخليج العربي",
          currency: currency,
          serviceCategory: "courses",
          selectedPackage: `${courseTitle} (${priceDisplay || ""})`,
          leadType: "intent",
          adSource: "صفحة أعمال الطلاب - حجز كورس",
          clientNotes: `العميل [${verifiedName}] طلب حجز [${courseTitle}] بسعر [${priceDisplay || ""}] من صفحة أعمال الطلاب`,
        }),
      }).catch(() => {});
    }
  };

  const handleScrollToCourses = () => {
    const el = document.getElementById("courses");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#060709] text-af-light selection:bg-af-yellow selection:text-black relative overflow-x-hidden">
      <CursorSpotlight />

      <Navbar onOpenConfigurator={handleScrollToCourses} />

      {/* ترويسة صفحة أعمال الطلاب المستقلة */}
      <section className="pt-28 pb-10 sm:pt-36 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-4 shadow-yellow-glow-sm">
          <GraduationCap className="w-4 h-4" />
          <span>AF ACADEMY // معرض أعمال وتطبيقات الطلاب المعتمدة</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
          معرض أعمال وتطبيقات الطلاب
          <span className="block text-af-yellow text-2xl sm:text-4xl mt-2">
            مخرجات تطبيقية واقعية في الجرافيك ديزاين والذكاء الاصطناعي
          </span>
        </h1>

        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6">
          استعرض نماذج حقيقية نفذها طلاب وخريجو الأكاديمية خلال مسارات التدريب المكثفة، تشمل إعلانات المنتجات، المؤثرات السينمائية، والتصاميم الإعلانية.
        </p>

        {/* مميزات سريعة */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gray-300">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-af-yellow" />
            <span>تطبيقات فوتوشوب وإليستريتور</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-af-yellow" />
            <span>توليد إعلانات وفيديوهات بالذكاء الاصطناعي</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-af-yellow" />
            <span>مشاريع مؤهلة لسوق العمل الحر</span>
          </div>
        </div>
      </section>

      {/* معرض أعمال وتطبيقات الطلاب التفاعلي */}
      <StudentWorksGallery onBookCourse={handleBookCourse} />

      {/* تفاصيل وأسعار الكورسات بالجنيه المصري للمهتمين بالاشتراك فوراً */}
      <CoursesSection onBookCourse={handleBookCourse} />

      <Footer />

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderData={currentOrder}
      />

      {/* زر الواتساب المباشر */}
      <div className="hidden xl:flex fixed bottom-6 left-6 z-40 items-center gap-3">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            "مرحباً AF ACADEMY، اطلعت على أعمال وتطبيقات الطلاب وأود الاستفسار والتسجيل في المسار التدريبي."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-2xl transition-all duration-300 active:scale-95"
        >
          <MessageCircle className="w-4.5 h-4.5 text-black" />
          <span className="font-bold">استفسار مباشر عبر WhatsApp</span>
        </a>
      </div>
    </main>
  );
}
