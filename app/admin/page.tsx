"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Shield,
  Search,
  RefreshCw,
  Download,
  Phone,
  MessageCircle,
  Building2,
  Briefcase,
  Clock,
  Coins,
  CheckCircle2,
  LogOut,
  Layers,
  Sparkles,
  Trash2,
  ArrowLeft,
  UserCheck,
  ShoppingBag,
  Users,
  MousePointerClick,
  ChevronDown,
  ChevronUp,
  Globe,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Award,
} from "lucide-react";
import { LeadItem } from "@/lib/leadsStore";
import { useRegion } from "@/context/RegionContext";
import {
  categorizeLead,
  groupLeadsByClient,
  ClientProfile,
  SimpleLead,
  isCourseLead,
  isB2BLead,
} from "@/lib/leadUtils";

export default function AdminPage() {
  const { phone, isAdmin, logout, openGate } = useRegion();

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"b2b_orders" | "academy_orders" | "clients" | "intent">("b2b_orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [expandedClientPhone, setExpandedClientPhone] = useState<string | null>(null);

  const ADMIN_PHONE = "011111111112";

  // دالة جلب البيانات المحمية برقم الأدمن
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?phone=${ADMIN_PHONE}`, {
        headers: {
          "x-admin-phone": ADMIN_PHONE,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Failed to load admin leads:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchLeads();
    }
  }, [isAdmin, fetchLeads]);

  // تحديث حالة الطلب أو الاهتمام
  const handleStatusChange = async (id: string, newStatus: LeadItem["status"]) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-phone": ADMIN_PHONE,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
        );
        fetchLeads();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // حذف سجل
  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا السجل نهائياً؟")) return;

    try {
      const res = await fetch(`/api/admin/leads?id=${id}&phone=${ADMIN_PHONE}`, {
        method: "DELETE",
        headers: {
          "x-admin-phone": ADMIN_PHONE,
        },
      });

      if (res.ok) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        fetchLeads();
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  // تصنيف السجلات حسب الأقسام
  const allOrdersLeads = useMemo(
    () => leads.filter((l) => categorizeLead(l as SimpleLead) === "order"),
    [leads]
  );

  // 1. طلبات مشاريع الشركات B2B
  const b2bOrdersLeads = useMemo(
    () => allOrdersLeads.filter((l) => isB2BLead(l as SimpleLead)),
    [allOrdersLeads]
  );

  // 2. طلبات وحجوزات تدريب الأكاديمية (الكورسات)
  const academyOrdersLeads = useMemo(
    () => allOrdersLeads.filter((l) => isCourseLead(l as SimpleLead)),
    [allOrdersLeads]
  );

  // 3. السجلات المتروكة والنقرات (سلة متروكة)
  const intentLeads = useMemo(
    () => leads.filter((l) => categorizeLead(l as SimpleLead) !== "order"),
    [leads]
  );

  // 4. قاعدة بيانات العملاء والطلاب المسجلين
  const clientsList = useMemo(
    () => groupLeadsByClient(leads as SimpleLead[]),
    [leads]
  );

  // إحصائيات طلبات مشاريع الشركات B2B
  const b2bStats = useMemo(() => {
    return {
      total: b2bOrdersLeads.length,
      newOrders: b2bOrdersLeads.filter((l) => l.status === "new").length,
      inProgress: b2bOrdersLeads.filter((l) => l.status === "contacted" || l.status === "in_progress").length,
      completed: b2bOrdersLeads.filter((l) => l.status === "completed").length,
    };
  }, [b2bOrdersLeads]);

  // إحصائيات حجوزات تدريب الأكاديمية (الكورسات)
  const academyStats = useMemo(() => {
    return {
      total: academyOrdersLeads.length,
      newOrders: academyOrdersLeads.filter((l) => l.status === "new").length,
      inProgress: academyOrdersLeads.filter((l) => l.status === "contacted" || l.status === "in_progress").length,
      completed: academyOrdersLeads.filter((l) => l.status === "completed").length,
    };
  }, [academyOrdersLeads]);

  // إحصائيات العملاء والطلاب
  const clientsStats = useMemo(() => {
    return {
      total: clientsList.length,
      b2bClients: clientsList.filter((c) => c.b2bCount > 0).length,
      academyStudents: clientsList.filter((c) => c.academyCount > 0).length,
      potential: clientsList.filter((c) => c.totalOrders === 0).length,
      egypt: clientsList.filter((c) => c.country.includes("مصر") || c.phone.startsWith("01")).length,
      gulf: clientsList.filter((c) => !c.country.includes("مصر") && !c.phone.startsWith("01")).length,
    };
  }, [clientsList]);

  // أحدث عميل مسجل لحظياً وقائمة أحدث المسجلين
  const latestClient = useMemo(() => clientsList[0] || null, [clientsList]);
  const recentClients = useMemo(() => clientsList.slice(0, 5), [clientsList]);

  // دالة تحويل التاريخ إلى صيغة زمنية نسبية ومريحة
  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "الآن (منذ ثوانٍ)";
    if (diffInMinutes === 1) return "منذ دقيقة واحدة";
    if (diffInMinutes === 2) return "منذ دقيقتين";
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "منذ ساعة";
    if (diffInHours === 2) return "منذ ساعتين";
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "منذ يوم";
    if (diffInDays === 2) return "منذ يومين";
    return date.toLocaleDateString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // دالة الانتقال المباشر إلى سلة عميل معين
  const handleViewClientCart = (clientPhone: string) => {
    setActiveTab("intent");
    setSearchQuery(clientPhone);
    setStatusFilter("all");
    setTimeout(() => {
      const el = document.getElementById("intent-search-bar");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  // إحصائيات النقرات والاهتمامات (سلة متروكة)
  const intentStats = useMemo(() => {
    return {
      total: intentLeads.length,
      newIntents: intentLeads.filter((l) => l.status === "new").length,
      contacted: intentLeads.filter((l) => l.status === "contacted").length,
    };
  }, [intentLeads]);

  // تصدير البيانات إلى ملف CSV إكسل
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      "المعرف",
      "تصنيف السجل",
      "تاريخ السجل",
      "الاسم",
      "رقم الهاتف",
      "اسم البراند / صفة الطالب",
      "مجال العمل / النشاط",
      "وقت التسليم",
      "الميزانية / الرسوم",
      "الخدمة",
      "الباقة / الكورس",
      "الحالة",
      "الملاحظات",
    ];

    const rows = leads.map((l) => {
      const isOrd = categorizeLead(l as SimpleLead) === "order";
      const isCrs = isCourseLead(l as SimpleLead);
      const typeLabel = isCrs
        ? "حجز تدريب (أكاديمية)"
        : isOrd
        ? "مشروع شركات (B2B)"
        : "اهتمام / سلة متروكة";

      return [
        `"${l.id}"`,
        `"${typeLabel}"`,
        `"${new Date(l.created_at).toLocaleString("ar-EG")}"`,
        `"${l.client_name || ""}"`,
        `"${l.phone || ""}"`,
        `"${l.brand_name || ""}"`,
        `"${l.business_field || ""}"`,
        `"${l.delivery_timeframe || ""}"`,
        `"${l.max_budget || ""}"`,
        `"${l.service_category || ""}"`,
        `"${l.selected_package || ""}"`,
        `"${l.status || ""}"`,
        `"${(l.client_notes || "").replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `سجلات_الإدارة_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // فلترة طلبات مشاريع الشركات B2B
  const filteredB2BOrders = useMemo(() => {
    return b2bOrdersLeads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.client_name?.toLowerCase().includes(q) ||
        lead.phone?.toLowerCase().includes(q) ||
        lead.brand_name?.toLowerCase().includes(q) ||
        lead.business_field?.toLowerCase().includes(q) ||
        lead.selected_package?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesService = serviceFilter === "all" || lead.service_category === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [b2bOrdersLeads, searchQuery, statusFilter, serviceFilter]);

  // فلترة حجوزات تدريب الأكاديمية (الكورسات)
  const filteredAcademyOrders = useMemo(() => {
    return academyOrdersLeads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.client_name?.toLowerCase().includes(q) ||
        lead.phone?.toLowerCase().includes(q) ||
        lead.selected_package?.toLowerCase().includes(q) ||
        lead.brand_name?.toLowerCase().includes(q) ||
        lead.client_notes?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

      let matchesCourse = true;
      const pkg = (lead.selected_package || "").toLowerCase();
      if (courseFilter === "graphic") {
        matchesCourse = pkg.includes("جرافيك") || pkg.includes("فوتوشوب") || pkg.includes("graphic");
      } else if (courseFilter === "ai") {
        matchesCourse = pkg.includes("ذكاء") || pkg.includes("ai") || pkg.includes("فيديو");
      } else if (courseFilter === "pro") {
        matchesCourse = pkg.includes("البرو") || pkg.includes("pro");
      }

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [academyOrdersLeads, searchQuery, statusFilter, courseFilter]);

  // فلترة العملاء والطلاب
  const filteredClients = useMemo(() => {
    return clientsList.filter((client) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        client.name.toLowerCase().includes(q) ||
        client.phone.toLowerCase().includes(q) ||
        client.brandName?.toLowerCase().includes(q) ||
        client.businessField?.toLowerCase().includes(q);

      let matchesType = true;
      if (clientFilter === "b2b") {
        matchesType = client.b2bCount > 0;
      } else if (clientFilter === "academy") {
        matchesType = client.academyCount > 0;
      } else if (clientFilter === "visitor") {
        matchesType = client.totalOrders === 0;
      }

      return matchesSearch && matchesType;
    });
  }, [clientsList, searchQuery, clientFilter]);

  // فلترة المهتمين بالخدمات (سلة متروكة)
  const filteredIntents = useMemo(() => {
    return intentLeads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.client_name?.toLowerCase().includes(q) ||
        lead.phone?.toLowerCase().includes(q) ||
        lead.selected_package?.toLowerCase().includes(q) ||
        lead.service_category?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [intentLeads, searchQuery, statusFilter]);

  // في حال لم يكن المستخدم مسجلاً برقم الأدمن المعتمد 011111111112:
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#060709] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden text-right selection:bg-af-yellow selection:text-black">
        <div className="relative w-full max-w-lg bg-[#0A0D14] border border-white/15 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-7">
          <div className="w-22 h-22 rounded-3xl bg-[#121622] border-2 border-af-yellow/40 flex items-center justify-center mx-auto shadow-yellow-glow">
            <Shield className="w-12 h-12 text-af-yellow" />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              لوحة الإدارة المركزية
            </h1>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-md mx-auto font-bold">
              هذه الصفحة مخصصة لمدير النظام فقط. لتسجيل الدخول كأدمن، يرجى استخدام رقم هاتف الإدارة المعتمد.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <button
              onClick={openGate}
              className="w-full py-4.5 rounded-2xl bg-af-yellow hover:bg-af-yellow-hover text-black font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-yellow-glow transition-all active:scale-98"
            >
              <UserCheck className="w-6 h-6" />
              <span>تسجيل الدخول برقم الأدمن</span>
            </button>

            <a
              href="/"
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-100 hover:text-white text-base sm:text-lg font-black flex items-center justify-center gap-2.5 transition-colors block"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة للمنصة الرئيسية</span>
            </a>
          </div>
        </div>
      </main>
    );
  }

  // واجهة لوحة التحكم الكاملة - مقسمة إلى 3 أقسام رئيسية بحجم متناسق ومريح
  return (
    <main className="min-h-screen bg-[#060709] text-af-light selection:bg-af-yellow selection:text-black pb-16 text-right">
      {/* الشريط العلوي للوحة الإدارة مع أقسام التبديل */}
      <header className="sticky top-0 z-40 bg-[#080B12]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* الصف الأول: اللوجو ورقم الأدمن وأزرار العودة والتحديث والخروج */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <a
              href="/"
              title="العودة للمنصة الرئيسية"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <img
                src="/icon.png"
                alt="AF Logo"
                className="w-10 h-10 rounded-xl object-contain bg-black border border-af-yellow/40 shadow-yellow-glow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-white">لوحة تحكم الطلبات والعملاء</h1>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs font-mono text-gray-300 font-bold">
                  حساب الأدمن: <span className="text-af-yellow font-bold">{phone}</span>
                </p>
              </div>
            </a>

            <div className="flex items-center gap-2 flex-wrap">
              {/* زر العودة للمنصة الرئيسية الصريح */}
              <a
                href="/"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all hover:border-af-yellow"
                title="العودة للموقع الرئيسي"
              >
                <ArrowLeft className="w-4 h-4 text-af-yellow" />
                <span>العودة للمنصة الرئيسية</span>
              </a>

              <button
                onClick={fetchLeads}
                disabled={isLoading}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
                title="تحديث البيانات"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden md:inline">تحديث</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-af-yellow hover:text-black border border-white/15 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all"
                title="تصدير السجلات إكسل"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">تصدير إكسل</span>
              </button>

              <button
                onClick={logout}
                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
                title="تسجيل الخروج من حساب الأدمن"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            </div>
          </div>

          {/* الصف الثاني: شريط أقسام الهيدر الرئيسية الأربعة بحجم متناسق */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/10">
            {/* القسم 1: مشاريع الشركات B2B */}
            <button
              onClick={() => {
                setActiveTab("b2b_orders");
                setSearchQuery("");
                setStatusFilter("all");
                setServiceFilter("all");
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "b2b_orders"
                  ? "bg-af-yellow text-black shadow-yellow-glow-sm"
                  : "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>مشاريع الشركات (B2B)</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "b2b_orders" ? "bg-black text-white" : "bg-white/15 text-af-yellow"
                }`}
              >
                {b2bOrdersLeads.length}
              </span>
            </button>

            {/* القسم 2: حجوزات تدريب الأكاديمية (الكورسات) */}
            <button
              onClick={() => {
                setActiveTab("academy_orders");
                setSearchQuery("");
                setStatusFilter("all");
                setCourseFilter("all");
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "academy_orders"
                  ? "bg-af-yellow text-black shadow-yellow-glow-sm"
                  : "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>حجوزات الأكاديمية (الكورسات)</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "academy_orders" ? "bg-black text-white" : "bg-white/15 text-af-yellow"
                }`}
              >
                {academyOrdersLeads.length}
              </span>
            </button>

            {/* القسم 3: بيانات العملاء والطلاب المسجلين */}
            <button
              onClick={() => {
                setActiveTab("clients");
                setSearchQuery("");
                setStatusFilter("all");
                setClientFilter("all");
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "clients"
                  ? "bg-af-yellow text-black shadow-yellow-glow-sm"
                  : "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>بيانات العملاء والطلاب</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "clients" ? "bg-black text-white" : "bg-white/15 text-af-yellow"
                }`}
              >
                {clientsList.length} مسجل
              </span>
            </button>

            {/* القسم 4: العملاء الذين ضغطوا على الخدمات بدون تأكيد (سلة متروكة) */}
            <button
              onClick={() => {
                setActiveTab("intent");
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "intent"
                  ? "bg-af-yellow text-black shadow-yellow-glow-sm"
                  : "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15"
              }`}
            >
              <MousePointerClick className="w-4 h-4" />
              <span>نقرات الخدمات (سلة متروكة)</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "intent" ? "bg-black text-white" : "bg-white/15 text-af-yellow"
                }`}
              >
                {intentLeads.length} مهتم
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ========================================================= */}
        {/* قسم المتابعة اللحظية: أحدث العملاء المسجلين وسلة اهتماماتهم */}
        {/* ========================================================= */}
        <section className="bg-[#0A0D14] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          {/* خلفية ضوئية جمالية */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-af-yellow/5 rounded-full blur-3xl pointer-events-none" />

          {/* رأس القسم: العنوان والإحصائية العامة */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-xs font-mono font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE ACTIVITY // تتبع العملاء المسجلين لحظياً</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                <Users className="w-6 h-6 text-af-yellow" />
                <span>مركز العملاء المسجلين ومتابعة السلة اللحظية</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                تعرف على آخر عميل قام بتسجيل بياناته ورقمه وتوقيته، وتابع ما يوجد داخل سلته واهتماماته للتواصل معه فوراً.
              </p>
            </div>

            {/* عدادات العملاء السريعة */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-[#06080E] border border-white/10 px-4 py-2.5 rounded-2xl text-center min-w-[100px]">
                <span className="text-[10px] text-gray-400 font-bold block mb-0.5">إجمالي المسجلين</span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{clientsStats.total}</span>
              </div>
              <div className="bg-[#06080E] border border-cyan-500/20 px-3.5 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] text-cyan-400 font-bold block mb-0.5">طلاب الأكاديمية</span>
                <span className="text-lg sm:text-xl font-black text-cyan-300 font-mono">{clientsStats.academyStudents}</span>
              </div>
              <div className="bg-[#06080E] border border-emerald-500/20 px-3.5 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">عملاء المشاريع</span>
                <span className="text-lg sm:text-xl font-black text-emerald-300 font-mono">{clientsStats.b2bClients}</span>
              </div>
              <div className="bg-[#06080E] border border-af-yellow/20 px-3.5 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] text-af-yellow font-bold block mb-0.5">عملاء السلة (مهتمين)</span>
                <span className="text-lg sm:text-xl font-black text-af-yellow font-mono">{clientsStats.potential}</span>
              </div>
            </div>
          </div>

          {/* محتوى القسم: بطاقة أحدث عميل مسجل */}
          {latestClient ? (
            <div className="mt-5 space-y-4 relative z-10">
              <div className="bg-[#0D111A] border-2 border-af-yellow/50 rounded-2xl p-4 sm:p-6 shadow-yellow-glow-sm relative">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* بيانات العميل الأخير */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-af-yellow text-black flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>آخر عميل مسجل الآن</span>
                      </span>
                      <span className="text-xs font-bold font-mono text-af-yellow bg-af-yellow/10 px-2.5 py-1 rounded-lg border border-af-yellow/20">
                        {formatRelativeTime(latestClient.lastSeen)}
                      </span>
                      <span className="text-xs text-gray-300 font-mono">
                        ({new Date(latestClient.lastSeen).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} - {new Date(latestClient.lastSeen).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" })})
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 pt-1">
                      <div className="w-14 h-14 rounded-2xl bg-af-yellow/15 border-2 border-af-yellow/40 flex items-center justify-center text-af-yellow font-black text-2xl shrink-0 shadow-sm">
                        {latestClient.name ? latestClient.name.slice(0, 1) : "ع"}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                          <span>{latestClient.name}</span>
                          <span className="text-xs font-bold text-gray-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                            {latestClient.country}
                          </span>
                        </h3>
                        <div className="flex items-center gap-2.5 mt-1">
                          <span className="text-base sm:text-lg font-mono font-black text-af-yellow direction-ltr inline-block">
                            {latestClient.phone}
                          </span>
                          {/* أزرار الاتصال والواتساب السريعة */}
                          <a
                            href={`https://wa.me/${latestClient.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                            title="مراسلة فورية عبر واتساب"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>واتساب فوري</span>
                          </a>
                          <a
                            href={`tel:${latestClient.phone}`}
                            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold flex items-center gap-1 transition-all"
                            title="اتصال هاتفي"
                          >
                            <Phone className="w-3.5 h-3.5 text-af-yellow" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* ما يوجد داخل سلة هذا العميل / اهتماماته */}
                    <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-gray-200 flex-wrap">
                      <span className="text-af-yellow font-bold flex items-center gap-1.5 bg-af-yellow/10 px-2.5 py-1 rounded-xl border border-af-yellow/20">
                        <ShoppingBag className="w-4 h-4 text-af-yellow" />
                        <span>محتوى سلة العميل واهتماماته:</span>
                      </span>
                      {latestClient.intents.length > 0 ? (
                        <span className="bg-af-yellow/20 text-af-yellow font-bold px-3 py-1 rounded-xl border border-af-yellow/40">
                          {latestClient.intents[0].selected_package}
                          {latestClient.totalIntents > 1 && ` (إجمالي ${latestClient.totalIntents} عناصر بالسلة)`}
                        </span>
                      ) : latestClient.orders.length > 0 ? (
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-xl border border-emerald-500/40">
                          أكد طلب: {latestClient.orders[0].selected_package}
                        </span>
                      ) : (
                        <span className="text-gray-400 bg-white/5 px-2.5 py-1 rounded-xl">سجل بياناته ولم يتصفح باقات بعد</span>
                      )}
                    </div>
                  </div>

                  {/* الزر الإجرائي الرئيسي لفتح السلة */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                    <button
                      onClick={() => handleViewClientCart(latestClient.phone)}
                      className="px-6 py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-yellow-glow transition-all active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>افتح سلة واهتمامات هذا العميل</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("clients");
                        setSearchQuery(latestClient.phone);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-af-yellow" />
                      <span>عرض ملفه الكامل وسجل نشاطه</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* جدول / قائمة سريعة بآخر المسجلين */}
              {recentClients.length > 1 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="text-xs sm:text-sm font-bold text-gray-200 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-af-yellow" />
                      <span>أحدث العملاء المسجلين مؤخراً بالترتيب الزمني:</span>
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab("clients");
                        setSearchQuery("");
                      }}
                      className="text-xs text-af-yellow hover:underline font-bold cursor-pointer"
                    >
                      عرض قاعدة المسجلين بالكامل ({clientsStats.total})
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {recentClients.slice(1, 5).map((cl) => (
                      <div
                        key={cl.phone}
                        className="p-3.5 rounded-2xl bg-[#06080E] border border-white/10 hover:border-af-yellow/40 transition-all flex flex-col justify-between gap-2.5"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs sm:text-sm font-bold text-white truncate">{cl.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded">{formatRelativeTime(cl.lastSeen)}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-af-yellow direction-ltr block truncate">{cl.phone}</span>
                          <span className="text-[11px] text-gray-300 line-clamp-1 mt-1 font-medium">
                            {cl.intents[0]?.selected_package || cl.orders[0]?.selected_package || "زائر مسجل"}
                          </span>
                        </div>
                        <button
                          onClick={() => handleViewClientCart(cl.phone)}
                          className="w-full py-2 px-2.5 rounded-xl bg-white/5 hover:bg-af-yellow hover:text-black border border-white/10 text-xs font-bold text-gray-200 transition-all flex items-center justify-center gap-1.5 mt-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>عرض سلته</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 p-6 rounded-2xl bg-[#06080E] border border-white/10 text-center text-xs sm:text-sm text-gray-400">
              لا يوجد عملاء مسجلون حتى الآن. بمجرد تسجيل أي عميل أو زيارته للمنصة، ستظهر بياناته وسلته هنا لحظياً.
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* التبويب الأول: قسم إدارة مشاريع الشركات (B2B)               */}
        {/* ========================================================= */}
        {activeTab === "b2b_orders" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* بطاقات إحصائيات مشاريع الشركات */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">إجمالي مشاريع الشركات</span>
                  <Briefcase className="w-4 h-4 text-af-yellow" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none my-1">
                  {b2bStats.total}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  مشاريع شركات وعلامات تجارية
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-af-yellow/40 rounded-2xl p-4 sm:p-5 shadow-yellow-glow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-af-yellow">بانتظار التواصل والبدء</span>
                  <Sparkles className="w-4 h-4 text-af-yellow" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-af-yellow font-mono leading-none my-1">
                  {b2bStats.newOrders}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-300 font-medium mt-1">
                  مشاريع جديدة غير متواصل معها
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">قيد التنفيذ والمتابعة</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono leading-none my-1">
                  {b2bStats.inProgress}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  مشاريع جاري إنجازها
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">مشاريع مكتملة ومسلمة</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono leading-none my-1">
                  {b2bStats.completed}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  تم تسليمها واعتمادها بنجاح
                </div>
              </div>
            </div>

            {/* شريط البحث والتصفية لمشاريع الشركات */}
            <div className="bg-[#0A0D14] border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-af-yellow absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم العميل، الهاتف، اسم الشركة أو البراند، أو الباقة..."
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-af-yellow transition-colors placeholder:text-gray-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-af-yellow cursor-pointer"
                >
                  <option value="all">كافة الحالات</option>
                  <option value="new">جديد (لم يتم التواصل)</option>
                  <option value="contacted">تم التواصل</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>

                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-af-yellow cursor-pointer"
                >
                  <option value="all">كافة مجالات B2B</option>
                  <option value="web">تطوير المواقع والأنظمة</option>
                  <option value="branding">الهوية البصرية والتصميم</option>
                  <option value="marketing">التسويق وحملات النمو</option>
                </select>
              </div>
            </div>

            {/* عدد النتائج */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300 px-1 font-bold">
              <span>
                عرض <strong className="text-af-yellow">{filteredB2BOrders.length}</strong> من إجمالي{" "}
                <strong className="text-white">{b2bOrdersLeads.length}</strong> مشروع شركات (B2B)
              </span>
            </div>

            {/* قائمة كروت مشاريع الشركات */}
            {filteredB2BOrders.length === 0 ? (
              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-10 text-center text-gray-300 space-y-3">
                <Briefcase className="w-10 h-10 mx-auto text-af-yellow/40" />
                <h3 className="text-base sm:text-lg font-bold text-white">لا توجد مشاريع شركات مطابقة للبحث</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  لم يتم العثور على طلبات شركات تطابق معايير البحث أو الفرز المحددة.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredB2BOrders.map((lead) => {
                  const formattedDate = new Date(lead.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const whatsappMsg = encodeURIComponent(
                    `مرحباً بك أستاذ ${lead.client_name}، معك إدارة AF AGENCY بخصوص طلب مشروع [${lead.selected_package}]. يسعدنا بدء الترتيبات الفنية لتنفيذ مشروعك.`
                  );

                  return (
                    <div
                      key={lead.id}
                      className={`bg-[#0A0D14] border rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-white/30 ${
                        lead.status === "new"
                          ? "border-af-yellow/50 bg-[#0C101A]"
                          : "border-white/10"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-lg sm:text-2xl font-black text-white">
                              {lead.client_name}
                            </h2>
                            {lead.status === "new" && (
                              <span className="text-xs font-black bg-af-yellow text-black px-2.5 py-0.5 rounded-full shadow-sm">
                                طلب جديد
                              </span>
                            )}
                            <span className="text-xs font-bold font-mono text-gray-400">
                              {formattedDate}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-200 flex-wrap font-bold">
                            <span className="font-mono text-af-yellow text-base sm:text-lg font-black" dir="ltr">
                              {lead.phone}
                            </span>
                            {lead.brand_name && (
                              <span className="flex items-center gap-1.5 text-white font-bold">
                                <Building2 className="w-4 h-4 text-af-yellow shrink-0" />
                                <span>{lead.brand_name}</span>
                              </span>
                            )}
                            {lead.business_field && (
                              <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                                <Briefcase className="w-4 h-4 text-af-yellow shrink-0" />
                                <span>{lead.business_field}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>محادثة WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${lead.phone}`}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span>اتصال</span>
                          </a>

                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as LeadItem["status"])
                            }
                            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border focus:outline-none transition-colors cursor-pointer ${
                              lead.status === "new"
                                ? "bg-af-yellow text-black border-af-yellow"
                                : lead.status === "contacted"
                                ? "bg-purple-500/30 text-purple-200 border-purple-400"
                                : lead.status === "in_progress"
                                ? "bg-amber-500/30 text-amber-200 border-amber-400"
                                : lead.status === "completed"
                                ? "bg-emerald-500/30 text-emerald-200 border-emerald-400"
                                : "bg-red-500/30 text-red-200 border-red-400"
                            }`}
                          >
                            <option value="new" className="bg-[#0A0D14] text-white">جديد</option>
                            <option value="contacted" className="bg-[#0A0D14] text-white">تم التواصل</option>
                            <option value="in_progress" className="bg-[#0A0D14] text-white">قيد التنفيذ</option>
                            <option value="completed" className="bg-[#0A0D14] text-white">مكتمل</option>
                            <option value="cancelled" className="bg-[#0A0D14] text-white">ملغي</option>
                          </select>

                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        <div className="bg-[#06080E] p-3 sm:p-3.5 rounded-xl border border-white/10">
                          <span className="text-gray-400 block text-[11px] sm:text-xs font-bold mb-1">
                            الباقة المطلوبة:
                          </span>
                          <span className="font-black text-af-yellow text-xs sm:text-sm block">
                            {lead.selected_package}
                          </span>
                        </div>

                        <div className="bg-[#06080E] p-3 sm:p-3.5 rounded-xl border border-white/10">
                          <span className="text-gray-400 block text-[11px] sm:text-xs font-bold mb-1">
                            وقت التسليم المطلوب:
                          </span>
                          <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-af-yellow shrink-0" />
                            <span>{lead.delivery_timeframe || "غير محدد"}</span>
                          </span>
                        </div>

                        <div className="bg-[#06080E] p-3 sm:p-3.5 rounded-xl border border-white/10">
                          <span className="text-gray-400 block text-[11px] sm:text-xs font-bold mb-1">
                            الميزانية المحددة:
                          </span>
                          <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-af-yellow shrink-0" />
                            <span>{lead.max_budget || "حسب التسعيرة"}</span>
                          </span>
                        </div>

                        <div className="bg-[#06080E] p-3 sm:p-3.5 rounded-xl border border-white/10">
                          <span className="text-gray-400 block text-[11px] sm:text-xs font-bold mb-1">
                            مصدر الطلب:
                          </span>
                          <span className="font-bold text-gray-200 text-xs sm:text-sm block">
                            {lead.ad_source || "مباشر"}
                          </span>
                        </div>
                      </div>

                      {lead.client_notes && (
                        <div className="mt-3 p-3.5 rounded-xl bg-[#06080E] border border-white/10 text-xs sm:text-sm text-gray-100">
                          <span className="text-af-yellow block text-xs font-bold mb-1">
                            الملاحظات والمتطلبات الخاصة:
                          </span>
                          <p className="leading-relaxed font-medium text-gray-200">{lead.client_notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* التبويب الثاني: قسم حجوزات تدريب الأكاديمية (الكورسات)        */}
        {/* ========================================================= */}
        {activeTab === "academy_orders" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* بطاقات إحصائيات حجوزات الكورسات */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">إجمالي حجوزات التدريب</span>
                  <GraduationCap className="w-4 h-4 text-af-yellow" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none my-1">
                  {academyStats.total}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  طلبات التحاق بكورسات الأكاديمية
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-af-yellow/40 rounded-2xl p-4 sm:p-5 shadow-yellow-glow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-af-yellow">حجوزات جديدة بانتظار التأكيد</span>
                  <Sparkles className="w-4 h-4 text-af-yellow" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-af-yellow font-mono leading-none my-1">
                  {academyStats.newOrders}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-300 font-medium mt-1">
                  طلاب بانتظار التواصل لتثبيت المقعد
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">مقاعد تم تأكيدها وتواصلها</span>
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono leading-none my-1">
                  {academyStats.inProgress}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  قيد إعداد مواعيد التدريب
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">اشتراكات مؤكدة ومكتملة</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono leading-none my-1">
                  {academyStats.completed}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  ملتحقون بالبرامج التدريبية
                </div>
              </div>
            </div>

            {/* شريط البحث والتصفية لحجوزات الكورسات */}
            <div className="bg-[#0A0D14] border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-af-yellow absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم الطالب، الهاتف، الكورس، أو الحالة (طالب جامعي / حديث تخرج)..."
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-af-yellow transition-colors placeholder:text-gray-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-af-yellow cursor-pointer"
                >
                  <option value="all">كافة الحالات</option>
                  <option value="new">حجز جديد (بانتظار التواصل)</option>
                  <option value="contacted">تم التواصل والتأكيد</option>
                  <option value="in_progress">قيد التدريب</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>

                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-af-yellow cursor-pointer"
                >
                  <option value="all">كافة مسارات التدريب</option>
                  <option value="graphic">أساسيات الجرافيك ديزاين (فوتوشوب + إليستريتور)</option>
                  <option value="ai">الذكاء الاصطناعي (الفيديوهات والإعلانات)</option>
                  <option value="pro">الكورس البرو (جرافيك + ذكاء اصطناعي)</option>
                </select>
              </div>
            </div>

            {/* عدد النتائج */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300 px-1 font-bold">
              <span>
                عرض <strong className="text-af-yellow">{filteredAcademyOrders.length}</strong> من إجمالي{" "}
                <strong className="text-white">{academyOrdersLeads.length}</strong> حجز تدريبي للأكاديمية
              </span>
            </div>

            {/* قائمة كروت حجوزات الكورسات */}
            {filteredAcademyOrders.length === 0 ? (
              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-10 text-center text-gray-300 space-y-3">
                <GraduationCap className="w-10 h-10 mx-auto text-af-yellow/40" />
                <h3 className="text-base sm:text-lg font-bold text-white">لا توجد حجوزات تدريب مطابقة للبحث</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  لم يتم العثور على حجوزات تطابق معايير البحث أو المسار التدريبي المحدد.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAcademyOrders.map((lead) => {
                  const formattedDate = new Date(lead.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const studentStatus = lead.brand_name || "طالب / خريج";

                  const whatsappMsg = encodeURIComponent(
                    `مرحباً بك يا ${lead.client_name}، معك إدارة AF ACADEMY بخصوص حجزك في [${lead.selected_package}]. يسعدنا تأكيد مقعدك وتزويدك بكافة تفاصيل مواعيد التدريب والبدء.`
                  );

                  return (
                    <div
                      key={lead.id}
                      className={`bg-[#0A0D14] border rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-white/30 ${
                        lead.status === "new"
                          ? "border-cyan-500/50 bg-[#07131D]"
                          : "border-white/10"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                              <GraduationCap className="w-5 h-5 text-cyan-400" />
                              <span>{lead.client_name}</span>
                            </h2>
                            {lead.status === "new" && (
                              <span className="text-xs font-black bg-cyan-400 text-black px-2.5 py-0.5 rounded-full shadow-sm">
                                حجز جديد
                              </span>
                            )}
                            <span className="text-xs font-bold bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 px-2.5 py-0.5 rounded-full">
                              {studentStatus}
                            </span>
                            <span className="text-xs font-bold font-mono text-gray-400">
                              {formattedDate}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-200 flex-wrap font-bold">
                            <span className="font-mono text-af-yellow text-base sm:text-lg font-black" dir="ltr">
                              {lead.phone}
                            </span>
                            <span className="text-gray-300 font-medium">
                              المصدر: {lead.ad_source || "بوابة الأكاديمية"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>تأكيد الحجز WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${lead.phone}`}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span>اتصال</span>
                          </a>

                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as LeadItem["status"])
                            }
                            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border focus:outline-none transition-colors cursor-pointer ${
                              lead.status === "new"
                                ? "bg-cyan-500 text-black border-cyan-400"
                                : lead.status === "contacted"
                                ? "bg-purple-500/30 text-purple-200 border-purple-400"
                                : lead.status === "in_progress"
                                ? "bg-amber-500/30 text-amber-200 border-amber-400"
                                : lead.status === "completed"
                                ? "bg-emerald-500/30 text-emerald-200 border-emerald-400"
                                : "bg-red-500/30 text-red-200 border-red-400"
                            }`}
                          >
                            <option value="new" className="bg-[#0A0D14] text-white">حجز جديد</option>
                            <option value="contacted" className="bg-[#0A0D14] text-white">تم تأكيد المقعد</option>
                            <option value="in_progress" className="bg-[#0A0D14] text-white">قيد التدريب</option>
                            <option value="completed" className="bg-[#0A0D14] text-white">مكتمل</option>
                            <option value="cancelled" className="bg-[#0A0D14] text-white">ملغي</option>
                          </select>

                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
                            title="حذف الحجز"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* بطاقة تفاصيل الكورس المحجوز */}
                      <div className="mt-4 p-4 rounded-xl bg-[#06080E] border border-cyan-500/25 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <span className="text-cyan-400 block text-xs font-bold">
                              المسار التدريبي المحجوز:
                            </span>
                            <span className="text-base sm:text-lg font-black text-white block">
                              {lead.selected_package}
                            </span>
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-gray-400 block text-xs font-bold">
                              رسوم الكورس بالعرض:
                            </span>
                            <span className="text-lg sm:text-xl font-mono font-black text-af-yellow flex items-center gap-1 sm:justify-end">
                              <Coins className="w-4 h-4 text-af-yellow" />
                              <span>
                                {lead.max_budget
                                  ? lead.max_budget.includes("ج.م")
                                    ? lead.max_budget
                                    : `${lead.max_budget} ج.م`
                                  : "حسب العرض"}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-300">
                          <span className="text-emerald-400 font-bold">
                            عرض خاص للطلاب وحديثي التخرج وحتى اكتمال المقاعد
                          </span>
                          <span className="text-gray-400">
                            الصفة المسجلة: <strong className="text-white">{studentStatus}</strong>
                          </span>
                        </div>
                      </div>

                      {lead.client_notes && (
                        <div className="mt-3 p-3.5 rounded-xl bg-[#06080E] border border-white/10 text-xs sm:text-sm text-gray-100">
                          <span className="text-cyan-400 block text-xs font-bold mb-1">
                            ملاحظات المتدرب:
                          </span>
                          <p className="leading-relaxed font-medium text-gray-200">{lead.client_notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* التبويب الثاني: قسم بيانات العملاء والعدد المسجل            */}
        {/* ========================================================= */}
        {activeTab === "clients" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* بطاقات إحصائيات قاعدة بيانات العملاء والطلاب */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#0A0D14] border border-af-yellow/40 rounded-2xl p-4 sm:p-5 shadow-yellow-glow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-af-yellow">إجمالي المسجلين</span>
                  <Users className="w-4 h-4 text-af-yellow" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-af-yellow font-mono leading-none my-1">
                  {clientsStats.total}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-300 font-medium mt-1">
                  شامل أرقام الشركات والطلاب والزوار
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">عملاء مشاريع B2B</span>
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono leading-none my-1">
                  {clientsStats.b2bClients}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  أصحاب شركات طلبوا مشاريع
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">طلاب الأكاديمية</span>
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono leading-none my-1">
                  {clientsStats.academyStudents}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  حجزوا مسارات تدريبية
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">زوار البوابة (فرص)</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono leading-none my-1">
                  {clientsStats.potential}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  سجلوا أرقامهم دون طلب بعد
                </div>
              </div>
            </div>

            {/* شريط البحث والفلترة في العملاء والطلاب */}
            <div className="bg-[#0A0D14] border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-af-yellow absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث برقم الهاتف، بالاسم، أو باسم الشركة أو البراند..."
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-af-yellow transition-colors placeholder:text-gray-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-af-yellow cursor-pointer"
                >
                  <option value="all">كافة المسجلين</option>
                  <option value="b2b">عملاء مشاريع شركات B2B</option>
                  <option value="academy">طلاب الأكاديمية (الكورسات)</option>
                  <option value="visitor">زوار البوابة (بدون طلبات بعد)</option>
                </select>
              </div>
            </div>

            {/* عدد العملاء والطلاب */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300 px-1 font-bold">
              <span>
                عرض <strong className="text-af-yellow">{filteredClients.length}</strong> من إجمالي{" "}
                <strong className="text-white">{clientsList.length}</strong> مسجل في النظام
              </span>
            </div>

            {/* قائمة كروت العملاء والطلاب */}
            {filteredClients.length === 0 ? (
              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-10 text-center text-gray-300 space-y-3">
                <Users className="w-10 h-10 mx-auto text-af-yellow/40" />
                <h3 className="text-base sm:text-lg font-bold text-white">لا يوجد مسجلون مطابقون للبحث</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  لم يتم العثور على أرقام هواتف أو أسماء تطابق معايير البحث والفلترة.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClients.map((client) => {
                  const isExpanded = expandedClientPhone === client.phone;
                  const firstDateFormatted = new Date(client.firstSeen).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  const lastDateFormatted = new Date(client.lastSeen).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const whatsappClientMsg = encodeURIComponent(
                    client.academyCount > 0 && client.b2bCount === 0
                      ? `مرحباً بك يا ${client.name}، معك إدارة AF ACADEMY بخصوص حسابك وتدريبك معنا. يسعدنا متابعتك والرد على أي استفسارات لديك.`
                      : `مرحباً بك أستاذ ${client.name}، معك إدارة AF AGENCY بخصوص حسابك واهتماماتك عبر المنصة. يسعدنا تقديم استشارة ومساعدتك في تطوير وتوسيع مشروعك.`
                  );

                  return (
                    <div
                      key={client.phone}
                      className="bg-[#0A0D14] border border-white/10 rounded-2xl p-5 sm:p-6 transition-all hover:border-white/25"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h2 className="text-lg sm:text-xl font-black text-white">
                              {client.name}
                            </h2>

                            {client.b2bCount > 0 && (
                              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                <span>عميل شركات B2B ({client.b2bCount})</span>
                              </span>
                            )}

                            {client.academyCount > 0 && (
                              <span className="text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                <span>طالب بالأكاديمية ({client.academyCount})</span>
                              </span>
                            )}

                            {client.totalOrders === 0 && (
                              <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                                مسجل بالبوابة
                              </span>
                            )}

                            <span className="text-xs font-bold text-gray-300 px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10">
                              {client.country}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-200 flex-wrap font-bold">
                            <span className="font-mono text-af-yellow text-base sm:text-lg font-black" dir="ltr">
                              {client.phone}
                            </span>
                            {client.brandName && (
                              <span className="flex items-center gap-1.5 text-white font-bold">
                                <Building2 className="w-4 h-4 text-af-yellow shrink-0" />
                                <span>{client.brandName}</span>
                              </span>
                            )}
                            {client.businessField && (
                              <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                                <Briefcase className="w-4 h-4 text-af-yellow shrink-0" />
                                <span>{client.businessField}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                          <a
                            href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}?text=${whatsappClientMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>محادثة WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${client.phone}`}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span>اتصال</span>
                          </a>

                          <button
                            onClick={() =>
                              setExpandedClientPhone(isExpanded ? null : client.phone)
                            }
                            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>سجل النشاط ({client.orders.length + client.intents.length})</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* إحصائيات سريعة للعميل */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        <div className="bg-[#06080E] p-3 rounded-xl border border-white/10">
                          <span className="text-gray-400 block text-[11px] sm:text-xs font-bold mb-0.5">
                            مشاريع B2B:
                          </span>
                          <span className="font-black text-white text-sm sm:text-base">
                            {client.b2bCount} مشروع
                          </span>
                        </div>

                        <div className="bg-[#06080E] p-3 rounded-xl border border-white/10">
                          <span className="text-gray-400 block text-[11px] sm:text-xs font-bold mb-0.5">
                            حجوزات الكورسات:
                          </span>
                          <span className="font-black text-cyan-400 text-sm sm:text-base">
                            {client.academyCount} كورس
                          </span>
                        </div>

                        <div className="bg-[#06080E] p-3 rounded-xl border border-white/10">
                          <span className="text-gray-400 block text-[11px] sm:text-xs font-bold mb-0.5">
                            نقرات واهتمامات:
                          </span>
                          <span className="font-black text-af-yellow text-sm sm:text-base">
                            {client.totalIntents} تفاعل
                          </span>
                        </div>

                        <div className="bg-[#06080E] p-3 rounded-xl border border-white/10">
                          <span className="text-gray-400 block text-[11px] sm:text-xs font-bold mb-0.5">
                            آخر نشاط بالمنصة:
                          </span>
                          <span className="font-bold text-gray-200 text-xs sm:text-sm">
                            {lastDateFormatted}
                          </span>
                        </div>
                      </div>

                      {/* السجل الموسع لنشاط هذا المسجل */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-in fade-in">
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-af-yellow" />
                            <span>سجل كافة طلبات ونشاطات هذا المستخدم:</span>
                          </h4>

                          <div className="space-y-2">
                            {client.orders.map((ord) => {
                              const isCourse = isCourseLead(ord as SimpleLead);
                              return (
                                <div
                                  key={ord.id}
                                  className={`p-3 rounded-xl bg-[#06080E] border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                    isCourse ? "border-cyan-500/30" : "border-emerald-500/30"
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      {isCourse ? (
                                        <span className="text-[11px] font-black bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                          <GraduationCap className="w-3 h-3" />
                                          <span>حجز كورس بالأكاديمية</span>
                                        </span>
                                      ) : (
                                        <span className="text-[11px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                          <Briefcase className="w-3 h-3" />
                                          <span>مشروع شركات B2B</span>
                                        </span>
                                      )}
                                      <span className="font-bold text-white text-xs sm:text-sm">
                                        {ord.selected_package}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-300 mt-1">
                                      {ord.client_notes || (isCourse ? "حجز مقعد تدريبي" : "طلب مشروع متكامل")}
                                      {ord.max_budget && (
                                        <span className="text-af-yellow font-mono mr-2">
                                          ({ord.max_budget})
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                  <div className="text-[11px] font-mono text-gray-400">
                                    {new Date(ord.created_at).toLocaleString("ar-EG")}
                                  </div>
                                </div>
                              );
                            })}

                            {client.intents.map((intn) => (
                              <div
                                key={intn.id}
                                className="p-3 rounded-xl bg-[#06080E] border border-af-yellow/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black bg-af-yellow/20 text-af-yellow px-2 py-0.5 rounded-full">
                                      اهتمام / سلة متروكة
                                    </span>
                                    <span className="font-bold text-gray-200 text-xs sm:text-sm">
                                      {intn.selected_package}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {intn.client_notes || "تصفح الباقة ولم يؤكد الطلب"}
                                  </p>
                                </div>
                                <div className="text-[11px] font-mono text-gray-400">
                                  {new Date(intn.created_at).toLocaleString("ar-EG")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* التبويب الثالث: العملاء الذين ضغطوا على الخدمات بدون تأكيد   */}
        {/* ========================================================= */}
        {activeTab === "intent" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* رسالة توضيحية لقسم السلة المتروكة بحجم مريح */}
            <div className="bg-[#0A0D14] border border-af-yellow/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-af-yellow shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  متابعة واسترداد العملاء المترددين (نقرات الخدمات دون تأكيد)
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  هؤلاء الزوار سجلوا أرقام هواتفهم، وتصفحوا وضغطوا على تفاصيل باقات معينة بالمنصة، ولكنهم لم يؤكدوا الطلب النهائي. يمكنك التواصل معهم مباشرة عبر زر الواتساب المجهز لتقديم عرض خاص لتحويلهم لعملاء مؤكدين.
                </p>
              </div>
            </div>

            {/* بطاقات إحصائيات النقرات والاهتمامات */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">إجمالي النقرات والاهتمامات</span>
                  <MousePointerClick className="w-4 h-4 text-af-yellow" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none my-1">
                  {intentStats.total}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  عملاء أبدوا اهتماماً بخدمات محددة
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-af-yellow/40 rounded-2xl p-4 sm:p-5 shadow-yellow-glow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-af-yellow">بانتظار المتابعة والاسترداد</span>
                  <Sparkles className="w-4 h-4 text-af-yellow" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-af-yellow font-mono leading-none my-1">
                  {intentStats.newIntents}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-300 font-medium mt-1">
                  فرص جاهزة للتواصل والمتابعة
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">تم التواصل معهم</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono leading-none my-1">
                  {intentStats.contacted}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  تمت متابعتهم وتقديم عروض لهم
                </div>
              </div>
            </div>

            {/* شريط تنبيه التصفية الخاصة بسلة عميل محدد */}
            {searchQuery && (
              <div className="bg-af-yellow/10 border border-af-yellow/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-yellow-glow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-af-yellow/20 flex items-center justify-center text-af-yellow shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-af-yellow font-bold block">أنت تستعرض الآن سلة واهتمامات العميل:</span>
                    <span className="text-sm sm:text-base font-black text-white font-mono direction-ltr inline-block">{searchQuery}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-gray-200 hover:text-white transition-all self-start sm:self-auto cursor-pointer"
                >
                  إلغاء التصفية وعرض سلات كل العملاء
                </button>
              </div>
            )}

            {/* شريط البحث والفلترة للمهتمين */}
            <div id="intent-search-bar" className="bg-[#0A0D14] border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-af-yellow absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم، برقم الهاتف، أو باسم الباقة والخدمة..."
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-af-yellow transition-colors placeholder:text-gray-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-af-yellow cursor-pointer"
                >
                  <option value="all">كافة الحالات</option>
                  <option value="new">جديد (لم يتم التواصل)</option>
                  <option value="contacted">تم التواصل</option>
                </select>
              </div>
            </div>

            {/* عدد النتائج */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300 px-1 font-bold">
              <span>
                عرض <strong className="text-af-yellow">{filteredIntents.length}</strong> من إجمالي{" "}
                <strong className="text-white">{intentLeads.length}</strong> عميل مهتم
              </span>
            </div>

            {/* قائمة كروت العملاء المهتمين */}
            {filteredIntents.length === 0 ? (
              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-10 text-center text-gray-300 space-y-3">
                <MousePointerClick className="w-10 h-10 mx-auto text-af-yellow/40" />
                <h3 className="text-base sm:text-lg font-bold text-white">لا توجد نقرات خدمات مطابقة للبحث</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  لم يتم العثور على نقرات خدمات أو سلات متروكة تطابق معايير البحث.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIntents.map((lead) => {
                  const formattedDate = new Date(lead.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const recoveryWhatsappMsg = encodeURIComponent(
                    `مرحباً بك أستاذ ${lead.client_name}، لاحظنا اهتمامك بخدمة [${lead.selected_package}] عبر منصة AF AGENCY. يسعدنا تقديم استشارة فنية مجانية وعرض سعر خاص لمساعدتك في إطلاق وتطوير مشروعك بأعلى قيمة!`
                  );

                  return (
                    <div
                      key={lead.id}
                      className={`bg-[#0A0D14] border rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-white/30 ${
                        lead.status === "new"
                          ? "border-af-yellow/50 bg-[#0C101A]"
                          : "border-white/10"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-lg sm:text-xl font-black text-white">
                              {lead.client_name}
                            </h2>
                            <span className="text-xs font-bold bg-af-yellow/20 text-af-yellow border border-af-yellow/30 px-2.5 py-0.5 rounded-full">
                              سلة متروكة / اهتمام بخدمة
                            </span>
                            <span className="text-xs font-bold font-mono text-gray-400">
                              {formattedDate}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-200 flex-wrap font-bold">
                            <span className="font-mono text-af-yellow text-base sm:text-lg font-black" dir="ltr">
                              {lead.phone}
                            </span>
                            <span className="text-gray-400 text-xs">
                              المصدر: {lead.ad_source || "تصفح الموقع"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${recoveryWhatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>استرداد ومحادثة WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${lead.phone}`}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span>اتصال</span>
                          </a>

                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as LeadItem["status"])
                            }
                            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border focus:outline-none transition-colors cursor-pointer ${
                              lead.status === "new"
                                ? "bg-af-yellow text-black border-af-yellow"
                                : "bg-purple-500/30 text-purple-200 border-purple-400"
                            }`}
                          >
                            <option value="new" className="bg-[#0A0D14] text-white">جديد (لم يتم التواصل)</option>
                            <option value="contacted" className="bg-[#0A0D14] text-white">تم التواصل والمتابعة</option>
                          </select>

                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
                            title="حذف السجل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* بطاقة الخدمة التي نقر عليها وأبدى اهتماماً بها */}
                      <div className="mt-4 p-4 rounded-xl bg-[#06080E] border border-af-yellow/30">
                        <span className="text-af-yellow block text-xs font-bold mb-1">
                          الخدمة أو الباقة التي ضغط عليها العميل ولم يستكمل طلبها:
                        </span>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-base sm:text-xl font-black text-white">
                            {lead.selected_package}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-gray-300">
                            قسم: {lead.service_category || "عام"}
                          </span>
                        </div>
                        {lead.client_notes && (
                          <p className="mt-2 text-xs sm:text-sm text-gray-300 font-medium">
                            {lead.client_notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

