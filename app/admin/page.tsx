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
} from "lucide-react";
import { LeadItem } from "@/lib/leadsStore";
import { useRegion } from "@/context/RegionContext";
import { categorizeLead, groupLeadsByClient, ClientProfile, SimpleLead } from "@/lib/leadUtils";

export default function AdminPage() {
  const { phone, isAdmin, logout, openGate } = useRegion();

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "clients" | "intent">("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
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
  const ordersLeads = useMemo(
    () => leads.filter((l) => categorizeLead(l as SimpleLead) === "order"),
    [leads]
  );

  const intentLeads = useMemo(
    () => leads.filter((l) => categorizeLead(l as SimpleLead) !== "order"),
    [leads]
  );

  const clientsList = useMemo(
    () => groupLeadsByClient(leads as SimpleLead[]),
    [leads]
  );

  // إحصائيات الطلبات
  const ordersStats = useMemo(() => {
    return {
      total: ordersLeads.length,
      newOrders: ordersLeads.filter((l) => l.status === "new").length,
      inProgress: ordersLeads.filter((l) => l.status === "contacted" || l.status === "in_progress").length,
      completed: ordersLeads.filter((l) => l.status === "completed").length,
    };
  }, [ordersLeads]);

  // إحصائيات العملاء
  const clientsStats = useMemo(() => {
    return {
      total: clientsList.length,
      active: clientsList.filter((c) => c.totalOrders > 0).length,
      potential: clientsList.filter((c) => c.totalOrders === 0).length,
      egypt: clientsList.filter((c) => c.country.includes("مصر") || c.phone.startsWith("01")).length,
      gulf: clientsList.filter((c) => !c.country.includes("مصر") && !c.phone.startsWith("01")).length,
    };
  }, [clientsList]);

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
      "النوع",
      "تاريخ السجل",
      "الاسم",
      "رقم الهاتف",
      "اسم البراند",
      "مجال العمل",
      "وقت التسليم",
      "الميزانية",
      "الخدمة",
      "الباقة",
      "الحالة",
      "الملاحظات",
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${categorizeLead(l as SimpleLead) === "order" ? "طلب مؤكد" : "اهتمام / سلة متروكة"}"`,
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
    ]);

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

  // فلترة الطلبات
  const filteredOrders = useMemo(() => {
    return ordersLeads.filter((lead) => {
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
  }, [ordersLeads, searchQuery, statusFilter, serviceFilter]);

  // فلترة العملاء
  const filteredClients = useMemo(() => {
    return clientsList.filter((client) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        client.name.toLowerCase().includes(q) ||
        client.phone.toLowerCase().includes(q) ||
        client.brandName?.toLowerCase().includes(q) ||
        client.businessField?.toLowerCase().includes(q)
      );
    });
  }, [clientsList, searchQuery]);

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

          {/* الصف الثاني: شريط أقسام الهيدر الرئيسية الثلاثة بحجم وسط متناسق */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/10">
            {/* القسم 1: إدارة الطلبات المؤكدة */}
            <button
              onClick={() => {
                setActiveTab("orders");
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "orders"
                  ? "bg-af-yellow text-black shadow-yellow-glow-sm"
                  : "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>قسم إدارة الطلبات</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "orders" ? "bg-black text-white" : "bg-white/15 text-af-yellow"
                }`}
              >
                {ordersLeads.length}
              </span>
            </button>

            {/* القسم 2: بيانات العملاء والعدد المسجل */}
            <button
              onClick={() => {
                setActiveTab("clients");
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "clients"
                  ? "bg-af-yellow text-black shadow-yellow-glow-sm"
                  : "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>بيانات العملاء المسجلين</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  activeTab === "clients" ? "bg-black text-white" : "bg-white/15 text-af-yellow"
                }`}
              >
                {clientsList.length} عميل
              </span>
            </button>

            {/* القسم 3: العملاء الذين ضغطوا على الخدمات بدون تأكيد (سلة متروكة) */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ========================================================= */}
        {/* التبويب الأول: قسم إدارة الطلبات المؤكدة                     */}
        {/* ========================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* بطاقات إحصائيات الطلبات بحجم وسط متناسق */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">إجمالي الطلبات المؤكدة</span>
                  <Layers className="w-4 h-4 text-af-yellow" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none my-1">
                  {ordersStats.total}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  طلبات استكمل أصحابها النموذج
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-af-yellow/40 rounded-2xl p-4 sm:p-5 shadow-yellow-glow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-af-yellow">بانتظار التواصل</span>
                  <Sparkles className="w-4 h-4 text-af-yellow" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-af-yellow font-mono leading-none my-1">
                  {ordersStats.newOrders}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-300 font-medium mt-1">
                  طلبات جديدة غير متواصل معها
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">قيد المتابعة والتنفيذ</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono leading-none my-1">
                  {ordersStats.inProgress}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  مشاريع جاري إنجازها
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">المشاريع المكتملة</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono leading-none my-1">
                  {ordersStats.completed}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  تم تسليمها واعتمادها بنجاح
                </div>
              </div>
            </div>

            {/* شريط البحث والتصفية للطلبات */}
            <div className="bg-[#0A0D14] border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-af-yellow absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم، برقم الهاتف، باسم البراند، أو اسم الباقة..."
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
                  <option value="all">كافة الخدمات</option>
                  <option value="web">تطوير الويب</option>
                  <option value="branding">الهوية والتصميم</option>
                  <option value="marketing">التسويق والإعلانات</option>
                  <option value="courses">الأكاديمية والذكاء الاصطناعي</option>
                </select>
              </div>
            </div>

            {/* عدد النتائج */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300 px-1 font-bold">
              <span>
                عرض <strong className="text-af-yellow">{filteredOrders.length}</strong> من إجمالي{" "}
                <strong className="text-white">{ordersLeads.length}</strong> طلب مؤكد
              </span>
            </div>

            {/* قائمة كروت الطلبات */}
            {filteredOrders.length === 0 ? (
              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-10 text-center text-gray-300 space-y-3">
                <Layers className="w-10 h-10 mx-auto text-af-yellow/40" />
                <h3 className="text-base sm:text-lg font-bold text-white">لا توجد طلبات مطابقة للبحث</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  لم يتم العثور على طلبات تطابق معايير البحث أو الفرز المحددة.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((lead) => {
                  const formattedDate = new Date(lead.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const whatsappMsg = encodeURIComponent(
                    `مرحباً بك أستاذ ${lead.client_name}، معك إدارة AF AGENCY بخصوص طلبك لباقة [${lead.selected_package}]. يسعدنا بدء الترتيبات الفنية لتنفيذ مشروعك.`
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
        {/* التبويب الثاني: قسم بيانات العملاء والعدد المسجل            */}
        {/* ========================================================= */}
        {activeTab === "clients" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* بطاقات إحصائيات قاعدة بيانات العملاء */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#0A0D14] border border-af-yellow/40 rounded-2xl p-4 sm:p-5 shadow-yellow-glow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-af-yellow">إجمالي العملاء المسجلين</span>
                  <Users className="w-4 h-4 text-af-yellow" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-af-yellow font-mono leading-none my-1">
                  {clientsStats.total}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-300 font-medium mt-1">
                  عميل مسجل برقم هاتف في النظام
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">عملاء بطلبات مؤكدة</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono leading-none my-1">
                  {clientsStats.active}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  عملاء أكملوا طلبات فعلية
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">مسجلون بالبوابة (فرص)</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono leading-none my-1">
                  {clientsStats.potential}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  سجلوا أرقامهم دون طلب بعد
                </div>
              </div>

              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-300">توزيع النطاق الجغرافي</span>
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-lg sm:text-xl font-black text-white leading-tight my-1">
                  <span className="text-af-yellow">{clientsStats.egypt}</span> مصر /{" "}
                  <span className="text-emerald-400">{clientsStats.gulf}</span> الخليج
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                  حسب خوادم وبوابة النطاق
                </div>
              </div>
            </div>

            {/* شريط البحث في العملاء */}
            <div className="bg-[#0A0D14] border border-white/10 p-3 sm:p-4 rounded-2xl shadow-sm">
              <div className="relative">
                <Search className="w-4 h-4 text-af-yellow absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث برقم هاتف العميل، بالاسم، أو باسم البراند..."
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-[#06080E] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-af-yellow transition-colors placeholder:text-gray-500 font-medium"
                />
              </div>
            </div>

            {/* عدد العملاء */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300 px-1 font-bold">
              <span>
                عرض <strong className="text-af-yellow">{filteredClients.length}</strong> من إجمالي{" "}
                <strong className="text-white">{clientsList.length}</strong> عميل مسجل
              </span>
            </div>

            {/* قائمة كروت العملاء المسجلين */}
            {filteredClients.length === 0 ? (
              <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-10 text-center text-gray-300 space-y-3">
                <Users className="w-10 h-10 mx-auto text-af-yellow/40" />
                <h3 className="text-base sm:text-lg font-bold text-white">لا يوجد عملاء مطابقون للبحث</h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  لم يتم العثور على أرقام هواتف أو أسماء تطابق معايير البحث.
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
                    `مرحباً بك أستاذ ${client.name}، معك إدارة AF AGENCY بخصوص حسابك واهتماماتك عبر المنصة. يسعدنا تقديم استشارة ومساعدتك في تطوير مشروعك.`
                  );

                  return (
                    <div
                      key={client.phone}
                      className="bg-[#0A0D14] border border-white/10 rounded-2xl p-5 sm:p-6 transition-all hover:border-white/25"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-lg sm:text-xl font-black text-white">
                              {client.name}
                            </h2>
                            {client.totalOrders > 0 ? (
                              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                                عميل مؤكد ({client.totalOrders} طلب)
                              </span>
                            ) : (
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
                            الطلبات المؤكدة:
                          </span>
                          <span className="font-black text-white text-sm sm:text-base">
                            {client.totalOrders} طلب
                          </span>
                        </div>

                        <div className="bg-[#06080E] p-3 rounded-xl border border-white/10">
                          <span className="text-gray-400 block text-[11px] sm:text-xs font-bold mb-0.5">
                            نقرات الخدمات والاهتمامات:
                          </span>
                          <span className="font-black text-af-yellow text-sm sm:text-base">
                            {client.totalIntents} تفاعل
                          </span>
                        </div>

                        <div className="bg-[#06080E] p-3 rounded-xl border border-white/10">
                          <span className="text-gray-400 block text-[11px] sm:text-xs font-bold mb-0.5">
                            تاريخ أول تسجيل:
                          </span>
                          <span className="font-bold text-gray-200 text-xs sm:text-sm">
                            {firstDateFormatted}
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

                      {/* السجل الموسع لنشاط هذا العميل */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-in fade-in">
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-af-yellow" />
                            <span>سجل كافة طلبات ونقرات هذا العميل:</span>
                          </h4>

                          <div className="space-y-2">
                            {client.orders.map((ord) => (
                              <div
                                key={ord.id}
                                className="p-3 rounded-xl bg-[#06080E] border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                                      طلب مؤكد
                                    </span>
                                    <span className="font-bold text-white text-xs sm:text-sm">
                                      {ord.selected_package}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-300 mt-1">
                                    {ord.client_notes || "طلب مشروع متكامل"}
                                  </p>
                                </div>
                                <div className="text-[11px] font-mono text-gray-400">
                                  {new Date(ord.created_at).toLocaleString("ar-EG")}
                                </div>
                              </div>
                            ))}

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

            {/* شريط البحث والفلترة للمهتمين */}
            <div className="bg-[#0A0D14] border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
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

