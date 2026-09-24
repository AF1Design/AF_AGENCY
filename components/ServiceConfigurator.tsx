"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Palette,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  Check,
  Sparkles,
  ArrowLeft,
  Briefcase,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { servicesData } from "@/data/services";
import { ServiceCategory, RegionCurrency } from "@/types";
import { useRegion } from "@/context/RegionContext";
import { trackServiceInterest } from "@/lib/analytics";

interface ServiceConfiguratorProps {
  onProceedToOrder: (config: {
    serviceCategory: ServiceCategory;
    serviceTitle: string;
    packageName: string;
    packageId: string;
    addons: string[];
    currency?: RegionCurrency;
    estimatedPrice?: string;
  }) => void;
}

export default function ServiceConfigurator({ onProceedToOrder }: ServiceConfiguratorProps) {
  const { currency } = useRegion();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("web");
  const [selectedPackages, setSelectedPackages] = useState<Record<ServiceCategory, string>>({
    web: "web-landing",
    branding: "brand-full",
    marketing: "market-growth",
    courses: "course-graphic-diploma",
  });
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // مراجع وإعدادات السحب بالماوس واللمس على الكمبيوتر والهاتف
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // حصر الخدمات المعروضة في مخصص باقات المشاريع على خدمات الشركات B2B فقط
  const businessServices = servicesData.filter((s) => s.id !== "courses");
  const currentService =
    businessServices.find((s) => s.id === activeCategory) || businessServices[0];
  const currentPackageId = selectedPackages[activeCategory] || currentService.packages[0].id;
  const currentPackage =
    currentService.packages.find((p) => p.id === currentPackageId) || currentService.packages[0];

  // مزامنة مؤشر الكارت النشط عند تغيير الخدمة
  useEffect(() => {
    const pkgIndex = currentService.packages.findIndex((p) => p.id === currentPackageId);
    if (pkgIndex !== -1) {
      setActiveCardIndex(pkgIndex);
    } else {
      setActiveCardIndex(0);
    }
    setExpandedPackageId(null);
  }, [activeCategory, currentPackageId, currentService.packages]);

  const handleCategoryChange = (catId: ServiceCategory) => {
    setActiveCategory(catId);
    const targetService = servicesData.find((s) => s.id === catId);
    trackServiceInterest({
      serviceName: `قسم: ${targetService?.title || catId}`,
      category: catId,
      notes: `نقر على قسم [${targetService?.title || catId}] واستعرض باقاته`,
    });
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackages((prev) => ({
      ...prev,
      [activeCategory]: packageId,
    }));
    const pkg = currentService.packages.find((p) => p.id === packageId);
    if (pkg) {
      trackServiceInterest({
        serviceName: `${currentService.title} - ${pkg.name}`,
        category: activeCategory,
        notes: `نقر على باقة [${pkg.name}] واطلع على تفاصيلها ومخرجاتها`,
      });
    }
  };

  const toggleExpand = (packageId: string) => {
    setExpandedPackageId((prev) => (prev === packageId ? null : packageId));
  };

  const scrollToCard = (index: number, pkgId?: string) => {
    setActiveCardIndex(index);
    if (pkgId) {
      handleSelectPackage(pkgId);
    }
    const target = cardRefs.current[index];
    if (target && carouselRef.current) {
      target.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const handleNextCard = () => {
    const nextIdx = (activeCardIndex + 1) % currentService.packages.length;
    scrollToCard(nextIdx, currentService.packages[nextIdx].id);
  };

  const handlePrevCard = () => {
    const prevIdx =
      (activeCardIndex - 1 + currentService.packages.length) % currentService.packages.length;
    scrollToCard(prevIdx, currentService.packages[prevIdx].id);
  };

  // رصد الكارت الذي يظهر في منتصف الحاوية أثناء السحب على الهاتف أو الكمبيوتر
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (card) {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(containerCenter - cardCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      }
    });

    if (closestIdx !== activeCardIndex) {
      setActiveCardIndex(closestIdx);
    }
  };

  // ميزات السحب عبر الماوس للكمبيوتر (Drag to Scroll)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !carouselRef.current) return;
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 8) {
      setHasDragged(true);
    }
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setHasDragged(false), 50);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleProceed = () => {
    const packagePrice = currentPackage.pricing
      ? currency === "EGP"
        ? currentPackage.pricing.EGP.display
        : currentPackage.pricing.SAR.display
      : undefined;

    trackServiceInterest({
      serviceName: `${currentService.title} - ${currentPackage.name}`,
      category: activeCategory,
      notes: `نقر على زر تأكيد الباقة وبدء الحجز لباقة: [${currentPackage.name}] بتكلفة تقديرية: ${packagePrice || "حسب التسعيرة"}`,
    });

    onProceedToOrder({
      serviceCategory: activeCategory,
      serviceTitle: currentService.title,
      packageName: currentPackage.name,
      packageId: currentPackage.id,
      currency: currency,
      estimatedPrice: packagePrice,
      addons: [],
    });
  };

  return (
    <section id="configurator" className="py-16 md:py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* رأس القسم */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-3.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[ 01 ] // INTERACTIVE SERVICE BUILDER</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            صمّم باقة مشروعك بنقرة واحدة
          </h2>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            اختر نوع الخدمة وحدد الباقة المناسبة لطموحك، وسيقوم فريقنا بتنفيذها بأعلى معايير الإتقان التقني والهندسي.
          </p>
        </motion.div>

        {/* أزرار التبديل بين خدمات الأعمال الثلاث */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 mb-8">
          {businessServices.map((service) => {
            const isActive = activeCategory === service.id;
            const Icon =
              service.id === "web"
                ? Globe
                : service.id === "branding"
                ? Palette
                : TrendingUp;

            return (
              <button
                key={service.id}
                onClick={() => handleCategoryChange(service.id)}
                className={`p-3.5 sm:p-5 rounded-2xl text-right transition-all duration-300 flex flex-col justify-between border relative overflow-hidden active:scale-98 ${
                  isActive
                    ? "bg-[#0E1118] border-af-yellow shadow-yellow-glow ring-1 ring-af-yellow"
                    : "bg-[#0A0C10]/85 border-white/10 hover:border-white/20 hover:bg-[#0E1118]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute top-0 right-0 left-0 h-1 bg-af-yellow shadow-sm"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 sm:p-2.5 rounded-xl transition-colors ${
                      isActive
                        ? "bg-af-yellow text-black"
                        : "bg-white/5 text-af-gray border border-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  {isActive && (
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-af-yellow/15 text-af-yellow px-2 py-0.5 rounded-full border border-af-yellow/30">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div>
                  <h3
                    className={`font-bold text-xs sm:text-sm mb-0.5 ${
                      isActive ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p className="text-[11px] text-af-muted">
                    {service.packages.length} Available Packages
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* وصف الخدمة المختارة */}
        <motion.div
          key={activeCategory + "-header"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="af-glass-card p-4 sm:p-5 rounded-2xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-af-yellow animate-pulse" />
              <span>{currentService.title}</span>
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {currentService.shortDescription}
            </p>
          </div>
          <span className="text-[11px] text-af-yellow font-mono font-bold bg-af-yellow/10 px-3 py-1 rounded-xl border border-af-yellow/30 whitespace-nowrap">
            STEP 01: CHOOSE PACKAGE
          </span>
        </motion.div>

        {/* شريط التحكم والتنقل: متاح بالسحب أو بالأسهم على الكمبيوتر والهاتف معاً */}
        <div className="flex items-center justify-between mb-4 px-2 bg-[#0A0D14] border border-white/10 p-2.5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-af-muted font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-af-yellow animate-pulse" />
            <span className="text-white font-medium">
              تصفح الباقات بالسحب (بالماوس أو اللمس) أو باستخدام الأسهم:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevCard}
              className="p-2 rounded-xl bg-white/5 hover:bg-af-yellow hover:text-black border border-white/10 text-gray-200 active:scale-95 transition-all flex items-center gap-1 text-xs font-bold"
              aria-label="الباقة السابقة"
              title="الباقة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="hidden sm:inline">السابق</span>
            </button>

            <span className="text-xs font-mono font-bold text-af-yellow px-2 py-1 bg-af-yellow/10 rounded-lg border border-af-yellow/20">
              {activeCardIndex + 1} / {currentService.packages.length}
            </span>

            <button
              onClick={handleNextCard}
              className="p-2 rounded-xl bg-white/5 hover:bg-af-yellow hover:text-black border border-white/10 text-gray-200 active:scale-95 transition-all flex items-center gap-1 text-xs font-bold"
              aria-label="الباقة التالية"
              title="الباقة التالية"
            >
              <span className="hidden sm:inline">التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* حاوية الكروت الأفقية: سحب مباشر بالماوس على الكمبيوتر وباللمس على الهاتف + أسهم */}
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`flex gap-4 overflow-x-auto pb-5 pt-4 px-2 snap-x snap-mandatory scroll-smooth no-scrollbar select-none ${
            isMouseDown ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {currentService.packages.map((pkg, idx) => {
            const isSelected = pkg.id === currentPackageId;
            const isExpanded = expandedPackageId === pkg.id;

            return (
              <div
                key={pkg.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onClick={() => {
                  if (!hasDragged) {
                    handleSelectPackage(pkg.id);
                  }
                }}
                className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between w-[85vw] sm:w-[330px] md:w-[360px] lg:w-[380px] shrink-0 snap-center ${
                  isSelected
                    ? "bg-[#121620] border-2 border-af-yellow shadow-[0_0_30px_rgba(255,229,0,0.22)] ring-1 ring-af-yellow scale-[1.01]"
                    : "bg-[#090C12]/95 border-white/10 hover:border-white/20 hover:bg-[#0E121B]"
                }`}
              >
                {/* بادج التميز في أعلى حافة الكارت مثل هيجزفيلد */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 right-6 z-10">
                    <span
                      className={`text-[10px] font-mono px-3 py-0.5 rounded-full font-bold shadow-md whitespace-nowrap flex items-center gap-1 ${
                        pkg.recommended
                          ? "bg-af-yellow text-black shadow-yellow-glow-sm"
                          : "bg-[#181D2A] border border-white/20 text-gray-200"
                      }`}
                    >
                      {pkg.recommended && <Sparkles className="w-3 h-3 text-black" />}
                      <span>{pkg.badge}</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* رأس الكارت: دائرة الاختيار (راديو) + اسم الباقة + صندوق السعر المدمج */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2.5">
                      {/* دائرة الراديو الذكية */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!hasDragged) handleSelectPackage(pkg.id);
                        }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-af-yellow text-black font-black ring-2 ring-af-yellow/40 ring-offset-2 ring-offset-[#0B0D13]"
                            : "border-2 border-white/25 text-transparent hover:border-white/50"
                        }`}
                        aria-label="تحديد الباقة"
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </button>

                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                          {pkg.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                          {pkg.description}
                        </p>
                      </div>
                    </div>

                    {/* صندوق السعر البارز والمختصر (مثل ستايل هيجزفيلد) */}
                    {pkg.pricing && (
                      <div className="bg-[#05070B] border border-white/10 rounded-xl px-2.5 py-1.5 text-left shrink-0">
                        <span className="block text-[9px] font-mono text-af-muted leading-none mb-1">
                          التكلفة التقديرية
                        </span>
                        <span className="block text-xs sm:text-sm font-black text-af-yellow font-mono whitespace-nowrap">
                          {currency === "EGP" ? pkg.pricing.EGP.display : pkg.pricing.SAR.display}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* خط فاصل أنيق */}
                  <div className="border-t border-white/10 my-3" />

                  {/* أهم المخرجات المختصرة (سريعة القراءة بدون استهلاك الشاشة) */}
                  <div className="space-y-1.5 mb-3">
                    {pkg.features.slice(0, 2).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-200">
                        <Zap className="w-3 h-3 text-af-yellow shrink-0" />
                        <span className="line-clamp-1 leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* زر إظهار / إخفاء التفاصيل الكاملة والمجالات المناسبة (أكورديون هيجزفيلد) */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!hasDragged) toggleExpand(pkg.id);
                      }}
                      className="text-[11px] text-af-yellow hover:text-white transition-colors flex items-center gap-1 font-mono py-1"
                    >
                      <span>{isExpanded ? "عرض تفاصيل أقل" : "تفاصيل أكثر والمخرجات"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden pt-2.5 space-y-3 text-right"
                        >
                          {/* الوصف الكامل للباقة */}
                          <p className="text-xs text-gray-300 leading-relaxed bg-[#05070B]/80 p-2.5 rounded-xl border border-white/5">
                            {pkg.description}
                          </p>

                          {/* المجالات والأنشطة المناسبة */}
                          {pkg.suitableFields && pkg.suitableFields.length > 0 && (
                            <div className="p-2.5 rounded-xl bg-[#05070B]/80 border border-white/5">
                              <p className="text-[11px] font-bold text-af-yellow mb-1.5 flex items-center gap-1.5 font-mono">
                                <Briefcase className="w-3 h-3 text-af-yellow shrink-0" />
                                <span>المجالات والأنشطة المناسبة:</span>
                              </p>
                              <ul className="space-y-1 text-xs text-gray-300">
                                {pkg.suitableFields.map((field, fIdx) => (
                                  <li key={fIdx} className="flex items-start gap-1.5">
                                    <span className="text-af-yellow font-bold">•</span>
                                    <span className="leading-snug">{field}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* كامل المخرجات المشمولة */}
                          <div className="space-y-1.5 pt-1">
                            <p className="text-[10px] font-mono font-bold text-af-yellow uppercase">
                              كافة المخرجات المشمولة بالباقة:
                            </p>
                            {pkg.features.map((feature, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-af-yellow shrink-0 mt-0.5" />
                                <span className="leading-snug">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* زر اختيار الباقة الداخلي المخصص (مثل ستايل هيجزفيلد تماماً) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasDragged) handleSelectPackage(pkg.id);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2 ${
                    isSelected
                      ? "bg-af-yellow text-black font-bold shadow-sm ring-1 ring-af-yellow"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-af-yellow/40"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>الباقة المحددة حالياً</span>
                    </>
                  ) : (
                    <span>اختيار هذه الباقة</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* نقاط مؤشر التمرير السريع: متاحة على الكمبيوتر والهاتف */}
        <div className="flex items-center justify-center gap-2 mt-3 mb-8">
          {currentService.packages.map((pkg, idx) => (
            <button
              key={pkg.id}
              onClick={() => scrollToCard(idx, pkg.id)}
              className={`transition-all duration-300 rounded-full ${
                activeCardIndex === idx
                  ? "w-8 h-2.5 bg-af-yellow shadow-yellow-glow-sm"
                  : "w-2.5 h-2.5 bg-white/25 hover:bg-white/45"
              }`}
              aria-label={`الانتقال للباقة ${idx + 1}`}
            />
          ))}
        </div>

        {/* بطاقة تأكيد الباقة المجهزة وزر التنفيذ الفوري (Higgsfield Bottom Action Bar) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 bg-gradient-to-r from-[#0E1118] via-[#151A24] to-[#0E1118] border border-af-yellow/40 p-5 sm:p-7 rounded-3xl shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-5"
        >
          <div className="space-y-1.5 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold text-af-yellow bg-af-yellow/10 px-3 py-0.5 rounded-full border border-af-yellow/30">
              <Sparkles className="w-3 h-3" />
              <span>PACKAGE READY // جاهزة للتنفيذ المباشر</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white">
              {currentService.title} - <span className="text-af-yellow">{currentPackage.name}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              تشمل باقتك المختارة {currentPackage.features.length} مخرجات تقنية وهندسية متكاملة ومجهزة للبدء الفوري.
            </p>
            {currentPackage.pricing && (
              <div className="pt-1 flex flex-col sm:flex-row items-center sm:items-baseline gap-2">
                <span className="text-xs font-mono text-af-muted">التكلفة التقديرية:</span>
                <span className="text-xl sm:text-2xl font-black text-af-yellow font-mono">
                  {currency === "EGP" ? currentPackage.pricing.EGP.display : currentPackage.pricing.SAR.display}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleProceed}
            className="w-full lg:w-auto px-7 py-3.5 rounded-2xl bg-af-yellow hover:bg-af-yellow-hover text-black font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-yellow-glow-lg transition-all active:scale-95 shrink-0 group"
          >
            <span>CONFIRM & START // تأكيد الباقة وبدء التنفيذ</span>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
