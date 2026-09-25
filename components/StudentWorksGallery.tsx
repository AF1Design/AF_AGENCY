"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Maximize2,
  X,
  Play,
  Layers,
  Bot,
  Video,
  Film,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { useRegion } from "@/context/RegionContext";

interface StudentWorksGalleryProps {
  onBookCourse: (courseTitle: string, priceDisplay?: string) => void;
}

type WorkType = "image" | "video";
type WorkTrack = "graphic" | "ai";

interface StudentWorkItem {
  id: string;
  type: WorkType;
  track: WorkTrack;
  title: string;
  categoryLabel: string;
  filterCategory: "all" | "ai-videos" | "graphic-designs" | "social" | "manipulation" | "campaigns";
  software: string;
  description: string;
  mediaSrc: string;
  posterImage?: string;
  tags: string[];
}

export default function StudentWorksGallery({ onBookCourse }: StudentWorksGalleryProps) {
  const { currency } = useRegion();
  const isSAR = currency === "SAR";
  const graphicPrice = isSAR ? "300 ر.س" : "3,000 ج.م";
  const aiPrice = isSAR ? "300 ر.س" : "3,000 ج.م";
  const proPrice = isSAR ? "450 ر.س" : "4,500 ج.م";

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<StudentWorkItem | null>(null);

  const studentItems: StudentWorkItem[] = [
    // قسم فيديوهات وإعلانات الذكاء الاصطناعي مع صور بوستر حقيقية مستخرجة من داخل كل فيديو
    {
      id: "vid-01",
      type: "video",
      track: "ai",
      title: "إعلان تجاري - منتجات العناية BARE",
      categoryLabel: "فيديو إعلاني بالذكاء الاصطناعي",
      filterCategory: "ai-videos",
      software: "AI Video & Ads",
      description: "صناعة إعلان تجاري بأسلوب محتوى المستخدم الواقعي مع محاكاة حركة الكاميرا وتوزيع الإضاءة الرقمية لزيادة مبيعات المتاجر.",
      mediaSrc: "/videos/bare-ugc.mp4",
      posterImage: "/images/students/poster-bare-ugc.jpg",
      tags: ["ذكاء اصطناعي", "إعلانات تجارية", "تسويق رقمي"],
    },
    {
      id: "vid-02",
      type: "video",
      track: "ai",
      title: "إعلان تسويقي سينمائي - علامة MORA",
      categoryLabel: "إعلان تجاري سينمائي",
      filterCategory: "ai-videos",
      software: "AI Generation & Editing",
      description: "إخراج إعلاني بأسلوب سينمائي يجمع بين لقطات تفصيلية للمنتجات ومؤثرات صوتية متناسقة لرفع معدل التحويل.",
      mediaSrc: "/videos/mora-ad.mp4",
      posterImage: "/images/students/poster-mora-ad.jpg",
      tags: ["إعلان سينمائي", "مونتاج إعلاني", "ذكاء اصطناعي"],
    },
    {
      id: "vid-03",
      type: "video",
      track: "ai",
      title: "إعلان رياضي ديناميكي - Nike Best",
      categoryLabel: "إعلان رياضي حركي",
      filterCategory: "ai-videos",
      software: "AI Motion & Video",
      description: "تصميم وتوليد لقطات حركية فائقة الحيوية تتناسب مع وتيرة الإعلانات الرياضية العالمية ومقاسات منصات التواصل الاجتماعي.",
      mediaSrc: "/videos/nike-ad.mp4",
      posterImage: "/images/students/poster-nike-ad.jpg",
      tags: ["حملات رياضية", "إعلان حركي", "سوشيال ميديا"],
    },
    {
      id: "vid-04",
      type: "video",
      track: "ai",
      title: "موشن جرافيك إعلاني تفاعلي - استوديو التصميم",
      categoryLabel: "موشن جرافيك وإعلانات تفاعلية",
      filterCategory: "ai-videos",
      software: "AI & Motion Tools",
      description: "تطبيق متقدم على استعراض النماذج ثلاثية الأبعاد والمشاريع الرقمية بتنقلات بصرية جذابة وسريعة لجذب انتباه العملاء.",
      mediaSrc: "/videos/creative-canvas.mp4",
      posterImage: "/images/students/poster-creative-canvas.jpg",
      tags: ["موشن جرافيك", "عرض مشاريع", "تأثيرات بصرية"],
    },
    {
      id: "vid-05",
      type: "video",
      track: "ai",
      title: "إعلان تفاعلي ترويجي - UGC Promo",
      categoryLabel: "فيديو إعلاني تفاعلي",
      filterCategory: "ai-videos",
      software: "AI Video Creation",
      description: "إنتاج مقطع فيديو إعلاني تفاعلي يخاطب اهتمامات الجمهور مباشرة ويحقق أعلى نسب مشاهدة على تيك توك وإنستغرام ريلز.",
      mediaSrc: "/videos/ugc-promo.mp4",
      posterImage: "/images/students/poster-ugc-promo.jpg",
      tags: ["فيديو تيك توك", "ريلز إنستغرام", "إعلانات تفاعلية"],
    },
    {
      id: "vid-06",
      type: "video",
      track: "ai",
      title: "إعلان منتجات فاخرة - برفيوم ملكي",
      categoryLabel: "إعلان عطور ومنتجات فاخرة",
      filterCategory: "ai-videos",
      software: "AI Cinematic Render",
      description: "صياغة مشهد بصري فخم ومثير يبرز عبوة العطر مع تأثيرات الدخان والضوء السينمائي وموسيقى إعلانية راقية.",
      mediaSrc: "/videos/royal-perfume.mp4",
      posterImage: "/images/students/poster-royal-perfume.jpg",
      tags: ["منتجات فاخرة", "إضاءة سينمائية", "ذكاء اصطناعي"],
    },

    // قسم تصاميم الجرافيك ديزاين
    {
      id: "des-01",
      type: "image",
      track: "graphic",
      title: "إعلان تجاري - Coffee Time",
      categoryLabel: "دمج ومعالجة رقمية",
      filterCategory: "manipulation",
      software: "Photoshop",
      description: "تطبيق متقدم على الدمج البصري، توزيع الإضاءات والظلال، وصناعة حركة حبوب القهوة باحترافية.",
      mediaSrc: "/images/students/student-work-01.jpg",
      tags: ["دمج رقمي", "تعديل إضاءة", "إعلانات تجارية"],
    },
    {
      id: "des-02",
      type: "image",
      track: "graphic",
      title: "بوستر رياضي - Nike Built for the Best",
      categoryLabel: "حملات وبوسترات رياضية",
      filterCategory: "campaigns",
      software: "Photoshop & Illustrator",
      description: "إخراج بوستر إعلاني احترافي لكوتش نايك باللون الأزرق مع مؤثرات الورق والشبكة الهندسية وتوزيع متقن للنصوص.",
      mediaSrc: "/images/students/student-work-02.png",
      tags: ["بوستر رياضي", "كوتش نايك", "تصميم إعلاني"],
    },
    {
      id: "des-furniture",
      type: "image",
      track: "graphic",
      title: "بوستر أثاث عصري - StyleHub Furnitures",
      categoryLabel: "تصاميم سوشيال ميديا وديكور",
      filterCategory: "social",
      software: "Photoshop & Illustrator",
      description: "تصميم إعلاني راقٍ لكرسي أثاث عصري يدمج درجات التركواز والأصفر مع توزيع متناسق للنصوص وبيانات التواصل.",
      mediaSrc: "/images/students/student-work-furniture.jpg",
      tags: ["أثاث وديكور", "سوشيال ميديا", "تنسيق ألوان"],
    },
    {
      id: "des-03",
      type: "image",
      track: "graphic",
      title: "معالجة بصرية إنشائية - Solid Construction",
      categoryLabel: "دمج ومعالجة رقمية",
      filterCategory: "manipulation",
      software: "Photoshop",
      description: "دمج هندسي متقن للنصوص ثلاثية الأبعاد مع خامات البيتون ومصادر الضوء الواقعية.",
      mediaSrc: "/images/students/student-work-03.jpg",
      tags: ["تصميم هندسي", "معالجة خامات", "إضاءة واقعية"],
    },
    {
      id: "des-04",
      type: "image",
      track: "graphic",
      title: "بوستر إعلاني حركي - Nike Athlete",
      categoryLabel: "حملات وبوسترات رياضية",
      filterCategory: "campaigns",
      software: "Photoshop & Illustrator",
      description: "تصميم حركي مليء بالطاقة والحيوية لكوتش رياضي مع توظيف شبكات التصميم والمؤثرات البرتقالية الجريئة.",
      mediaSrc: "/images/students/student-work-04.png",
      tags: ["بوستر رياضي", "مؤثرات حركية", "حملات إعلانية"],
    },
    {
      id: "des-05",
      type: "image",
      track: "graphic",
      title: "إعلان أزياء ومتاجر - Hoodie Collection",
      categoryLabel: "تصاميم سوشيال ميديا",
      filterCategory: "social",
      software: "Photoshop & Illustrator",
      description: "إخراج بوستر ترويجي عصري لمتاجر الملابس الشبابية بتيبوغرافي جريء وتنسيق جذاب للمنتجات.",
      mediaSrc: "/images/students/student-work-05.jpg",
      tags: ["متاجر إلكترونية", "تيبوغرافي", "سوشيال ميديا"],
    },
    {
      id: "des-06",
      type: "image",
      track: "graphic",
      title: "بوستر فني سينمائي - Class Works",
      categoryLabel: "دمج ومعالجة رقمية",
      filterCategory: "manipulation",
      software: "Photoshop",
      description: "دمج تفاعلي متقدم مع أضواء النيون والمؤثرات المستقبلية وصناعة تباين لوني عالي الدقة.",
      mediaSrc: "/images/students/student-work-06.png",
      tags: ["أضواء نيون", "دمج سينمائي", "تراكيب متقدمة"],
    },
    {
      id: "des-07",
      type: "image",
      track: "graphic",
      title: "حملة موسمية رمضانية - المراعي",
      categoryLabel: "حملات وبوسترات",
      filterCategory: "campaigns",
      software: "Photoshop & Illustrator",
      description: "تطبيق عملي كامل على عزل المنتجات وتوزيع العناصر الاحتفالية التراثية وإخراج حملة كاملة للعلامة التجارية.",
      mediaSrc: "/images/students/student-work-07.jpg",
      tags: ["حملات موسمية", "عزل وتلوين", "إعلانات الخليج"],
    },
    {
      id: "des-08",
      type: "image",
      track: "graphic",
      title: "إعلان تفاعلي تطبيقي - إندومي مصر",
      categoryLabel: "تصاميم سوشيال ميديا",
      filterCategory: "social",
      software: "Photoshop & Illustrator",
      description: "صياغة تصميم إعلاني تفاعلي يدمج واجهة الهاتف المحمول مع المنتج وتأثيرات تصاعد النكهات لجذب المشاهدين.",
      mediaSrc: "/images/students/student-work-08.jpg",
      tags: ["تصاميم تفاعلية", "سوشيال ميديا", "مشاريع تجارية"],
    },
  ];

  const filteredItems = studentItems.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "ai-videos") return item.track === "ai";
    if (activeFilter === "graphic-designs") return item.track === "graphic";
    return item.filterCategory === activeFilter;
  });

  const videosCount = studentItems.filter((i) => i.type === "video").length;
  const designsCount = studentItems.filter((i) => i.type === "image").length;

  return (
    <section id="student-works" className="py-20 md:py-28 relative scroll-mt-20 overflow-hidden">
      {/* خلفية جمالية خفيفة */}
      <div className="ambient-orb w-96 h-96 bg-af-yellow/5 top-1/4 -right-32 pointer-events-none" />
      <div className="ambient-orb w-96 h-96 bg-blue-500/5 bottom-10 -left-32 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* رأس القسم التوضيحي */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-af-card border border-white/10 text-af-yellow text-xs font-mono font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>معرض مخرجات وتطبيقات الطلاب المتدربين</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              أعمال وتطبيقات حقيقية في الجرافيك ديزاين والذكاء الاصطناعي
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              نماذج واقعية نفذها طلابنا خلال التدريب التطبيقي: تصاميم احترافية على فوتوشوب وإليستريتور، وفيديوهات إعلانية وتجارية مولدة ومعدلة بأحدث أدوات الذكاء الاصطناعي.
            </p>
          </div>

          {/* فلاتر التصنيفات سهلة وسلسة الاستخدام على الهواتف والكمبيوتر */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-sans text-xs">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeFilter === "all"
                  ? "bg-af-yellow text-black shadow-sm"
                  : "bg-af-card text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              كافة الأعمال ({studentItems.length})
            </button>
            <button
              onClick={() => setActiveFilter("ai-videos")}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeFilter === "ai-videos"
                  ? "bg-af-yellow text-black shadow-sm"
                  : "bg-af-card text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>فيديوهات الذكاء الاصطناعي ({videosCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter("graphic-designs")}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeFilter === "graphic-designs"
                  ? "bg-af-yellow text-black shadow-sm"
                  : "bg-af-card text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>تصاميم الجرافيك ديزاين ({designsCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter("social")}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeFilter === "social"
                  ? "bg-af-yellow text-black shadow-sm"
                  : "bg-af-card text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              سوشيال ميديا
            </button>
            <button
              onClick={() => setActiveFilter("manipulation")}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeFilter === "manipulation"
                  ? "bg-af-yellow text-black shadow-sm"
                  : "bg-af-card text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              دمج ومعالجة رقمية
            </button>
            <button
              onClick={() => setActiveFilter("campaigns")}
              className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeFilter === "campaigns"
                  ? "bg-af-yellow text-black shadow-sm"
                  : "bg-af-card text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              حملات وبوسترات
            </button>
          </div>
        </div>

        {/* شبكة الأعمال المتجاوبة بالكامل مع صور بوستر حقيقية وفائقة الخفة */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer rounded-2xl bg-[#0F131C] border border-white/10 hover:border-af-yellow/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-af-yellow/10"
              >
                {/* حاوية العرض المرئي: صورة بوستر حقيقية عالية الدقة لكافة الفيديوهات والتصاميم */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/80">
                  {item.type === "video" ? (
                    <div className="relative w-full h-full">
                      {item.posterImage && (
                        <Image
                          src={item.posterImage}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

                      {/* شارة نوع الفيديو */}
                      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-af-yellow text-black text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                        <Play className="w-3 h-3 fill-black" />
                        <span>فيديو إعلاني</span>
                      </div>

                      {/* شارة البرنامج المستخدم */}
                      <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-af-yellow font-bold">
                        {item.software}
                      </div>

                      {/* زر تشغيل بارز في منتصف الكارت مع هوفر حركي وتوهج */}
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-af-yellow group-hover:bg-af-yellow-hover text-black flex items-center justify-center shadow-yellow-glow transition-all duration-300 group-hover:scale-110">
                          <Play className="w-7 h-7 fill-black ml-1" />
                        </div>
                        <span className="text-[11px] font-mono text-white mt-2.5 bg-black/70 backdrop-blur-sm px-3 py-0.5 rounded-full border border-white/15 shadow-md">
                          تشغيل الفيديو HD
                        </span>
                      </div>

                      {/* شارة أسفل الكارت */}
                      <div className="absolute bottom-2 left-3 right-3 z-10 flex items-center justify-between text-xs text-gray-300 pt-1.5 border-t border-white/10">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Film className="w-3 h-3 text-af-yellow" />
                          <span>AI Video // 1080p</span>
                        </span>
                        <span className="text-[10px] text-af-yellow font-mono font-bold">WATCH</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={item.mediaSrc}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                      {/* شارة البرنامج المستخدم للتصميم */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-af-yellow font-bold">
                        {item.software}
                      </div>

                      {/* زر تكبير الصورة عند التحويم */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-af-yellow/50 text-af-yellow text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>عرض التصميم بدقة كاملة</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* بطاقة التفاصيل السفلية */}
                <div className="p-4 text-right flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {item.categoryLabel}
                      </span>
                      <span className="text-[10px] text-af-yellow/80 font-mono">
                        {item.track === "ai" ? "AI Track" : "Design Track"}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-af-yellow transition-colors line-clamp-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  </div>

                  {/* شارات المهارات المكتسبة */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* لافتة دعوة للانضمام والتحويل المباشر لحجز المسارات التدريبية */}
        <div className="mt-14 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#121622] via-[#1A2030] to-[#121622] border border-af-yellow/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-af-yellow/10 text-af-yellow text-xs font-mono font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>تدريب تطبيقي مكثف يركز على مخرجات سوق العمل</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white">
              تريد صناعة إعلانات وتصاميم بنفس هذا المستوى والبدء في العمل الحر؟
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              اختر المسار التدريبي المناسب لك: مسار الجرافيك ديزاين ({graphicPrice})، أو مسار صناعة الفيديوهات والإعلانات بالذكاء الاصطناعي ({aiPrice})، أو الباقة الشاملة الكورس البرو ({proPrice}) المخصصة للطلاب وحديثي التخرج.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() =>
                onBookCourse("كورس أساسيات الجرافيك ديزاين", graphicPrice)
              }
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/15 transition-all"
            >
              <span>حجز كورس الجرافيك ({graphicPrice})</span>
            </button>
            <button
              onClick={() =>
                onBookCourse("كورس أدوات الذكاء الاصطناعي (AI)", aiPrice)
              }
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-yellow-glow shrink-0 transition-transform active:scale-95"
            >
              <span>حجز كورس الذكاء الاصطناعي ({aiPrice})</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* نافذة المعاينة المكبرة عالية الدقة - يتم تشغيل الفيديو المطلوب فقط بشكل منفرد بانسيابية تامة */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/92 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#0F131C] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]"
            >
              {/* زر الإغلاق */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 left-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white hover:text-af-yellow transition-colors border border-white/20"
                aria-label="إغلاق المعاينة"
              >
                <X className="w-5 h-5" />
              </button>

              {/* حاوية عرض الميديا: تشغيل فيديو مفرد بانسيابية أو صورة مفردة */}
              <div className="relative md:w-3/5 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
                {selectedItem.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center p-2 bg-black">
                    <video
                      key={selectedItem.id}
                      src={selectedItem.mediaSrc}
                      controls
                      autoPlay
                      playsInline
                      className="max-h-[60vh] md:max-h-[500px] w-auto max-w-full rounded-xl shadow-2xl"
                    />
                  </div>
                ) : (
                  <Image
                    src={selectedItem.mediaSrc}
                    alt={selectedItem.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-contain p-2"
                  />
                )}
              </div>

              {/* لوحة المعلومات الجانبية للعمل وزر الحجز المباشر */}
              <div className="p-6 md:w-2/5 flex flex-col justify-between text-right overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-af-yellow/10 text-af-yellow text-xs font-mono font-bold">
                      {selectedItem.software}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono">
                      {selectedItem.type === "video" ? "Video Output" : "Graphic Output"}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {selectedItem.title}
                  </h3>

                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-semibold block">تصنيف التطبيق:</span>
                    <p className="text-sm text-gray-200">{selectedItem.categoryLabel}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-semibold block">المهارات والتقنيات المطبقة:</span>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 font-semibold block mb-2">الوسوم:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
                  <div className="text-xs text-gray-400">
                    تم تنفيذ هذا العمل بالكامل بواسطة طالب متدرب في مسارات الأكاديمية
                  </div>
                  {selectedItem.track === "ai" ? (
                    <button
                      onClick={() => {
                        setSelectedItem(null);
                        onBookCourse("كورس أدوات الذكاء الاصطناعي (AI)", aiPrice);
                      }}
                      className="w-full py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-yellow-glow transition-transform active:scale-95"
                    >
                      <span>احجز كورس الذكاء الاصطناعي ({aiPrice})</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedItem(null);
                        onBookCourse("كورس أساسيات الجرافيك ديزاين", graphicPrice);
                      }}
                      className="w-full py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-yellow-glow transition-transform active:scale-95"
                    >
                      <span>احجز كورس الجرافيك ديزاين ({graphicPrice})</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
