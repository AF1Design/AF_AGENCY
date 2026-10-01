"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderModal from "@/components/OrderModal";
import CursorSpotlight from "@/components/CursorSpotlight";
import ClientAssurance from "@/components/ClientAssurance";
import AcademyOutcomes from "@/components/AcademyOutcomes";
import AcademyFAQ from "@/components/AcademyFAQ";
import {
  GraduationCap,
  Briefcase,
  Globe,
  Palette,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  Tag,
} from "lucide-react";
import { ServiceCategory } from "@/types";
import { useRegion } from "@/context/RegionContext";
import { trackEvent } from "@/lib/fpixel";

export default function SubscriptionsPage() {
  const { phone, clientName, currency, portalMode, setPortalMode } = useRegion();
  const [b2bTab, setB2bTab] = useState<"web" | "branding" | "marketing">("web");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<{
    serviceCategory: ServiceCategory;
    serviceTitle: string;
    packageName: string;
    packageId: string;
    addons: string[];
    priceDisplay?: string;
  } | null>(null);

  const isAcademy = portalMode === "academy";
  const whatsappNumber = "201114687759";

  // فحص معلمات الرابط عند التحميل لتحديد وضع العرض
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode") || params.get("portal") || params.get("tab");
      if (modeParam === "academy" || modeParam === "agency") {
        setPortalMode(modeParam);
      }
    }
  }, [setPortalMode]);

  const handleBook = (
    category: ServiceCategory,
    serviceTitle: string,
    packageName: string,
    packageId: string,
    priceDisplay: string
  ) => {
    const order = {
      serviceCategory: category,
      serviceTitle: serviceTitle,
      packageName: packageName,
      packageId: packageId,
      addons: [],
      priceDisplay: priceDisplay,
    };
    setCurrentOrder(order);
    setIsModalOpen(true);

    trackEvent("InitiateCheckout", {
      content_name: packageName,
      content_category: category,
      currency: "EGP",
    });

    if (phone && phone !== "011111111112") {
      const verifiedName = clientName?.trim() || `عميل (${phone})`;
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: verifiedName,
          phone: phone,
          country: "مصر",
          currency: "EGP",
          serviceCategory: category,
          selectedPackage: `${packageName} (${priceDisplay})`,
          leadType: "intent",
          adSource: isAcademy ? "صفحة اشتراكات الكورسات" : "صفحة باقات المشاريع",
          clientNotes: `العميل [${verifiedName}] طلب حجز باقة [${packageName}] بسعر [${priceDisplay}] من صفحة الاشتراكات`,
        }),
      }).catch(() => {});
    }
  };

  const getDirectWhatsAppUrl = (pkgName: string, price: string) => {
    const msg = isAcademy
      ? `مرحباً AF ACADEMY، أود الاشتراك في [${pkgName}] المحدد بسعر [${price}] وأرغب في معرفة خطوات البدء وتأكيد الحجز.`
      : `مرحباً، أود الاستفسار والتعاقد على [${pkgName}] المحددة بسعر [${price}] للمشاريع الرقمية.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  // بيانات اشتراكات الكورسات التدريبية (خاصة بالأكاديمية فقط)
  const courseSubscriptions = [
    {
      id: "course-graphic-design",
      name: "كورس أساسيات الجرافيك ديزاين",
      tools: "Photoshop & Illustrator",
      description: "تعلم أساسيات التصميم الجرافيكي من الصفر مع تطبيقات عملية ومشاريع واقعية تؤهلك للعمل الحر.",
      price: "3,000 ج.م",
      originalPrice: "6,000 ج.م",
      badge: "خصم 50% للطلاب",
      highlight: false,
      features: [
        "إتقان أدوات وتقنيات فوتوشوب (Photoshop) الاحترافية",
        "إتقان أدوات وتقنيات إليستريتور (Illustrator) في رسم الشعارات",
        "تطبيقات عملية ومشاريع حقيقية خلال كل أسبوع",
        "متابعة دورية وتصحيح للتطبيقات مع المدرب",
        "شهادة إتمام المسار التدريبي معتمدة من الأكاديمية",
      ],
    },
    {
      id: "course-ai",
      name: "كورس أدوات الذكاء الاصطناعي (AI)",
      tools: "AI Video & Ads Creation",
      description: "صناعة وتوليد الفيديوهات والإعلانات الرقمية الاحترافية باستخدام أقوى أدوات الذكاء الاصطناعي الحديثة.",
      price: "3,000 ج.م",
      originalPrice: "6,000 ج.م",
      badge: "خصم 50% للطلاب",
      highlight: false,
      features: [
        "إنشاء وتوليد مقاطع الفيديو الإعلانية بالذكاء الاصطناعي",
        "صياغة وتحريك المشاهد السينمائية وعروض المنتجات الفاخرة",
        "إتقان أوامر التوليد (Prompts) للحصول على أعلى دقة واقعية",
        "إنتاج إعلانات تجارية متكاملة للسوشيال ميديا",
        "شهادة إتمام المسار التدريبي معتمدة من الأكاديمية",
      ],
    },
    {
      id: "course-pro-bundle",
      name: "الكورس البرو الشامل (جرافيك + ذكاء اصطناعي)",
      tools: "Photoshop + Illustrator + AI Video",
      description: "المسار الأقوى والأشمل: يجمع بين الجرافيك ديزاين والذكاء الاصطناعي في باقة واحدة بأكبر توفير ممكن.",
      price: "4,500 ج.م",
      originalPrice: "8,000 ج.م",
      badge: "توفير 3,500 ج.م - الباقة الأكثر طلباً",
      highlight: true,
      features: [
        "يشمل كورس أساسيات الجرافيك ديزاين كاملاً (فوتوشوب + إليستريتور)",
        "يشمل كورس الذكاء الاصطناعي كاملاً (الفيديوهات والإعلانات)",
        "دمج مهارات التصميم مع الذكاء الاصطناعي لإنتاج مواد بصرية خارقة",
        "أولوية المتابعة الفردية والدعم الفني طوال فترة الدراسة",
        "شهادة المسار الشامل (Pro Track) المعتمدة من الأكاديمية",
      ],
    },
  ];

  // باقات تطوير المواقع (خاصة بخدمات الشركات فقط)
  const webSubscriptions = [
    {
      id: "web-landing",
      name: "صفحة هبوط إعلانية (Landing Page)",
      tools: "مخصصة لحملات الإعلانات الممولة",
      description: "صفحة هبوط فائقة السرعة مصممة لتحويل زوار الإعلانات إلى عملاء مشترين ومسجلين بأعلى نسبة تحويل.",
      price: "تبدأ من 950 ج.م",
      originalPrice: "1,900 ج.م",
      badge: "الأكثر طلباً للحملات الإعلانية",
      highlight: true,
      features: [
        "تصميم تفاعلي متجاوب 100% مع شاشات الهواتف المحمولة",
        "زر تواصل مباشر عبر WhatsApp ونموذج حجز مدمج",
        "ربط بيكسل التتبع المعتمد (Meta Pixel & TikTok Pixel)",
        "ربط قواعد بيانات سحابية لحفظ وتنظيم بيانات العملاء فورياً",
        "سرعة تحميل فائقة واستضافة سحابية عالمية",
      ],
    },
    {
      id: "web-corporate",
      name: "موقع شركات ومؤسسات متكامل",
      tools: "من 4 إلى 7 صفحات رسمية",
      description: "واجهة رقمية احترافية تعكس ثقل شركتك وتبني الثقة مع عملائك وتبرز خدماتك وسابقة أعمالك.",
      price: "2,500 - 7,500 ج.م",
      originalPrice: "9,000 ج.م",
      badge: "المثالي للشركات والمصانع",
      highlight: false,
      features: [
        "تصميم عصري حصري متعدد الصفحات يعبر عن علامتك التجارية",
        "لوحة تحكم ذكية لإدارة وتحديث محتوى الموقع والمشاريع",
        "تهيئة لمحركات البحث (SEO) لظهور الموقع في نتائج البحث",
        "نماذج اتصال متقدمة وربط كامل مع وسائل التواصل",
        "استضافة سحابية فائقة الأمان وسرعة تصفح عالمية",
      ],
    },
    {
      id: "web-ecommerce",
      name: "متجر إلكتروني شامل للمبيعات",
      tools: "متجر متكامل بوابات دفع وسلة",
      description: "متجر إلكتروني متكامل يدعم عرض المنتجات وتصنيفاتها وسلة المشتريات وتتبع الطلبيات بكل سهولة.",
      price: "7,500 - 13,500 ج.م",
      originalPrice: "18,000 ج.م",
      badge: "جاهز للمبيعات والتوسع",
      highlight: false,
      features: [
        "عرض وتصنيف المنتجات مع فلترة وبحث سريع وتحديد المقاسات",
        "سلة تسوق سلسة وإتمام الطلب في خطوة واحدة",
        "تفعيل الشراء المباشر عبر WhatsApp وربط بوابات الدفع الإلكتروني",
        "لوحة تحكم كاملة لإدارة المخزون والمبيعات والطلبيات",
        "حماية مشددة وأعلى معايير تشفير لبيانات العملاء",
      ],
    },
  ];

  // باقات الهويات البصرية (خاصة بخدمات الشركات فقط)
  const brandingSubscriptions = [
    {
      id: "brand-starter",
      name: "باقة الهوية البصرية الأساسية",
      tools: "شعار وهوية مبدئية",
      description: "تصميم شعار فريد يعبر عن نشاطك مع تحديد الألوان والخطوط الرسمية لبداية قوية في السوق.",
      price: "1,500 - 3,000 ج.م",
      originalPrice: "4,000 ج.م",
      badge: "للمشاريع الناشئة",
      highlight: false,
      features: [
        "تصميم شعار مبتكر (Logo Design) بصيغ متعددة عالية الجودة",
        "دليل الألوان والخطوط الرسمية للعلامة التجارية",
        "تصميم كروت العمل (Business Cards) والترويسة الرسمية",
        "تسليم ملفات الفيكتور الأصلية المفتوحة للطباعة",
      ],
    },
    {
      id: "brand-full",
      name: "باقة الهوية المؤسسية الكاملة",
      tools: "دليل علامة تجارية متكامل",
      description: "تأسيس بصري متكامل للشركات يشمل كافة المطبوعات والواجهات والمطبوعات الإعلانية والتغليف.",
      price: "3,500 - 6,500 ج.م",
      originalPrice: "8,500 ج.م",
      badge: "الهوية الشاملة للشركات",
      highlight: true,
      features: [
        "شعار حصري مع 3 مفاهيم بصرية مختلفة للاختيار بينها",
        "دليل استخدام الهوية التجارية (Brand Guidelines)",
        "تصميم كافة المطبوعات والأوراق الرسمية والأظرف واليونيفورم",
        "تصميم قوالب السوشيال ميديا وتصاميم البروفايل الرسمية",
      ],
    },
  ];

  // باقات التسويق الرقمي (خاصة بخدمات الشركات فقط)
  const marketingSubscriptions = [
    {
      id: "marketing-growth",
      name: "باقة إدارة الحملات الإعلانية الممولة",
      tools: "Meta & TikTok Ads",
      description: "إدارة الحملات الإعلانية الموجهة بالأداء والبيانات لتحقيق أعلى عائد مالي على الإنفاق الإعلاني.",
      price: "3,000 - 6,000 ج.م / شهرياً",
      originalPrice: "8,000 ج.م",
      badge: "لزيادة المبيعات والطلبات",
      highlight: true,
      features: [
        "تحديد الجماهير المستهدفة بدقة ودراسة المنافسين",
        "إعداد وربط بيكسل التتبع والتحويلات المتقدمة",
        "إدارة الميزانيات وتحسين الحملات بشكل يومي (A/B Testing)",
        "تقارير أسبوعية وشهرية توضح أرقام المبيعات والتكلفة الفعلية",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#060709] text-af-light selection:bg-af-yellow selection:text-black relative overflow-x-hidden">
      <CursorSpotlight />

      <Navbar onOpenConfigurator={() => {}} />

      {/* ترويسة الصفحة */}
      <section className="pt-28 pb-6 sm:pt-36 sm:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 text-center">
        {/* نصوص الترويسة الديناميكية حسب الوضع النشط */}
        {isAcademy ? (
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-3 shadow-yellow-glow-sm">
              <GraduationCap className="w-4 h-4" />
              <span>AF ACADEMY // اشتراكات المسارات التدريبية المعتمدة</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 leading-tight">
              اشتراكات الكورسات التدريبية
            </h1>

            <p className="text-gray-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
              اختر المسار التدريبي التطبيقي المناسب لك في الجرافيك ديزاين والذكاء الاصطناعي مع تدريب عملي ومتابعة شخصية وشهادة معتمدة.
            </p>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-3 shadow-yellow-glow-sm">
              <Briefcase className="w-4 h-4" />
              <span>خدمات الشركات والمشاريع // استوديو الحلول الرقمية</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 leading-tight">
              باقات واشتراكات خدمات الشركات والمشاريع
              <span className="block text-af-yellow text-2xl sm:text-4xl mt-2">
                حلول برمجية وتصميمية متكاملة لرواد الأعمال بالجنيه المصري
              </span>
            </h1>

            <p className="text-gray-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed mb-6">
              باقات محددة التكلفة لتطوير المواقع والمتاجر، وتصميم الهويات المؤسسية، وإدارة الحملات الإعلانية الممولة.
            </p>

            {/* أزرار التبديل لخدمات الشركات فقط */}
            <div className="inline-flex p-1 bg-[#0E1118] border border-white/10 rounded-2xl mx-auto">
              <button
                onClick={() => setB2bTab("web")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  b2bTab === "web"
                    ? "bg-af-yellow text-black shadow-yellow-glow font-extrabold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>المواقع والمتاجر</span>
              </button>
              <button
                onClick={() => setB2bTab("branding")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  b2bTab === "branding"
                    ? "bg-af-yellow text-black shadow-yellow-glow font-extrabold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>الهويات البصرية</span>
              </button>
              <button
                onClick={() => setB2bTab("marketing")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  b2bTab === "marketing"
                    ? "bg-af-yellow text-black shadow-yellow-glow font-extrabold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>الحملات الإعلانية</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* قسم المحتوى بناءً على الوضع المختار */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* وضع الأكاديمية: باقات الكورسات فقط وحصرياً */}
        {isAcademy && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courseSubscriptions.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative text-right ${
                    item.highlight
                      ? "bg-gradient-to-b from-[#141824] to-[#0E1118] border-2 border-af-yellow shadow-yellow-glow-sm"
                      : "bg-[#0E1118]/80 border border-white/10 hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold text-af-yellow bg-af-yellow/10 px-3 py-1 rounded-full border border-af-yellow/30 font-mono">
                        {item.badge}
                      </span>
                      {item.highlight && (
                        <span className="text-[11px] font-extrabold text-black bg-af-yellow px-2.5 py-0.5 rounded-full shadow-yellow-glow-sm">
                          الباقة الشاملة
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-white mb-1">{item.name}</h3>
                    <p className="text-xs text-af-yellow font-mono mb-3">{item.tools}</p>
                    <p className="text-xs text-gray-400 leading-relaxed mb-6">{item.description}</p>

                    {/* منطقة السعر بالجنيه المصري */}
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 mb-6 text-right">
                      <div className="flex items-baseline gap-2 justify-start">
                        <span className="text-2xl sm:text-3xl font-black text-af-yellow font-mono">
                          {item.price}
                        </span>
                        <span className="text-xs text-gray-500 line-through font-mono">
                          {item.originalPrice}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-1">
                        شامل التدريب والمشاريع والشهادة
                      </span>
                    </div>

                    {/* قائمة المزايا */}
                    <div className="space-y-2.5 mb-8 text-right">
                      <span className="text-xs font-bold text-gray-300 block mb-2">
                        ما يشمله هذا الاشتراك:
                      </span>
                      {item.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* أزرار الإجراء */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    <button
                      onClick={() =>
                        handleBook("courses", "AF ACADEMY", item.name, item.id, item.price)
                      }
                      className="w-full py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-yellow-glow transition-all active:scale-98"
                    >
                      <span>تأكيد الحجز والتسجيل</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <a
                      href={getDirectWhatsAppUrl(item.name, item.price)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors block text-center"
                    >
                      <MessageCircle className="w-4 h-4 inline-block ml-1" />
                      <span>حجز مباشر عبر واتساب</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* مخرجات وشهادات التخرج الخاصة بالأكاديمية فقط */}
            <AcademyOutcomes />

            {/* الأسئلة الشائعة الخاصة بالمتدربين والكورسات فقط */}
            <AcademyFAQ />
          </div>
        )}

        {/* وضع الشركات والمشاريع: باقات B2B فقط وحصرياً */}
        {!isAcademy && (
          <div className="space-y-12">
            {b2bTab === "web" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {webSubscriptions.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative text-right ${
                      item.highlight
                        ? "bg-gradient-to-b from-[#141824] to-[#0E1118] border-2 border-af-yellow shadow-yellow-glow-sm"
                        : "bg-[#0E1118]/80 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold text-af-yellow bg-af-yellow/10 px-3 py-1 rounded-full border border-af-yellow/30 font-mono">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-white mb-1">{item.name}</h3>
                      <p className="text-xs text-af-yellow font-mono mb-3">{item.tools}</p>
                      <p className="text-xs text-gray-400 leading-relaxed mb-6">{item.description}</p>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 mb-6 text-right">
                        <div className="flex items-baseline gap-2 justify-start">
                          <span className="text-2xl sm:text-3xl font-black text-af-yellow font-mono">
                            {item.price}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-1">
                          شامل الاستضافة والتصميم وربط بيكسل التتبع
                        </span>
                      </div>

                      <div className="space-y-2.5 mb-8 text-right">
                        <span className="text-xs font-bold text-gray-300 block mb-2">
                          ما تشمله هذه الباقة:
                        </span>
                        {item.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-white/10">
                      <button
                        onClick={() =>
                          handleBook("web", "تطوير المواقع", item.name, item.id, item.price)
                        }
                        className="w-full py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-yellow-glow transition-all active:scale-98"
                      >
                        <span>طلب هذه الباقة</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <a
                        href={getDirectWhatsAppUrl(item.name, item.price)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors block text-center"
                      >
                        <MessageCircle className="w-4 h-4 inline-block ml-1" />
                        <span>استفسار فوري عبر واتساب</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {b2bTab === "branding" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {brandingSubscriptions.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative text-right ${
                      item.highlight
                        ? "bg-gradient-to-b from-[#141824] to-[#0E1118] border-2 border-af-yellow shadow-yellow-glow-sm"
                        : "bg-[#0E1118]/80 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold text-af-yellow bg-af-yellow/10 px-3 py-1 rounded-full border border-af-yellow/30 font-mono">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-white mb-1">{item.name}</h3>
                      <p className="text-xs text-af-yellow font-mono mb-3">{item.tools}</p>
                      <p className="text-xs text-gray-400 leading-relaxed mb-6">{item.description}</p>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 mb-6 text-right">
                        <div className="flex items-baseline gap-2 justify-start">
                          <span className="text-2xl sm:text-3xl font-black text-af-yellow font-mono">
                            {item.price}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-1">
                          شامل كافة الملفات المصدرية المفتوحة
                        </span>
                      </div>

                      <div className="space-y-2.5 mb-8 text-right">
                        <span className="text-xs font-bold text-gray-300 block mb-2">
                          ما تشمله هذه الباقة:
                        </span>
                        {item.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-white/10">
                      <button
                        onClick={() =>
                          handleBook("branding", "الهويات والتسويق", item.name, item.id, item.price)
                        }
                        className="w-full py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-yellow-glow transition-all active:scale-98"
                      >
                        <span>طلب هذه الباقة</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <a
                        href={getDirectWhatsAppUrl(item.name, item.price)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors block text-center"
                      >
                        <MessageCircle className="w-4 h-4 inline-block ml-1" />
                        <span>استفسار فوري عبر واتساب</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {b2bTab === "marketing" && (
              <div className="max-w-2xl mx-auto">
                {marketingSubscriptions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative text-right bg-gradient-to-b from-[#141824] to-[#0E1118] border-2 border-af-yellow shadow-yellow-glow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold text-af-yellow bg-af-yellow/10 px-3 py-1 rounded-full border border-af-yellow/30 font-mono">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-white mb-1">{item.name}</h3>
                      <p className="text-xs text-af-yellow font-mono mb-3">{item.tools}</p>
                      <p className="text-xs text-gray-400 leading-relaxed mb-6">{item.description}</p>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 mb-6 text-right">
                        <div className="flex items-baseline gap-2 justify-start">
                          <span className="text-2xl sm:text-3xl font-black text-af-yellow font-mono">
                            {item.price}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-1">
                          إدارة احترافية وتحسين يومي للحملات
                        </span>
                      </div>

                      <div className="space-y-2.5 mb-8 text-right">
                        <span className="text-xs font-bold text-gray-300 block mb-2">
                          ما تشمله هذه الباقة:
                        </span>
                        {item.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-af-yellow shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-white/10">
                      <button
                        onClick={() =>
                          handleBook("marketing", "الحملات الإعلانية", item.name, item.id, item.price)
                        }
                        className="w-full py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-yellow-glow transition-all active:scale-98"
                      >
                        <span>طلب هذه الباقة</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <a
                        href={getDirectWhatsAppUrl(item.name, item.price)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors block text-center"
                      >
                        <MessageCircle className="w-4 h-4 inline-block ml-1" />
                        <span>استفسار فوري عبر واتساب</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ميثاق الأمان والضمان المالي الخاص بعملاء الشركات B2B فقط */}
            <ClientAssurance />
          </div>
        )}
      </section>

      <Footer />

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderData={currentOrder}
      />

      {/* زر الواتساب المباشر للكمبيوتر */}
      <div className="hidden xl:flex fixed bottom-6 left-6 z-40 items-center gap-3">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            isAcademy
              ? "مرحباً AF ACADEMY، أود الاستفسار عن باقات واشتراكات الكورسات التدريبية."
              : "مرحباً، أود الاستفسار عن باقات وخدمات المشاريع الرقمية للشركات."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-2xl transition-all duration-300 active:scale-95"
        >
          <MessageCircle className="w-4.5 h-4.5 text-black" />
          <span className="font-bold">استفسار فوري عبر WhatsApp</span>
        </a>
      </div>
    </main>
  );
}
