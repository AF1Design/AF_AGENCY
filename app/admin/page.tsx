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
  CheckCircle2,
  LogOut,
  Trash2,
  ArrowLeft,
  UserCheck,
  ShoppingBag,
  Users,
  MousePointerClick,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Calendar,
  AlertCircle,
  X,
  Check,
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
  const [activeTab, setActiveTab] = useState<"clients" | "b2b_orders" | "academy_orders" | "intent">("clients");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const ADMIN_PHONE = "011111111112";

  // إشعار سريع للمستخدم
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // جلب البيانات من الخادم وسوبابيس
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

  // تحديث حالة السجل
  const handleStatusChange = async (id: string, newStatus: LeadItem["status"]) => {
    // تحديث فوري بالواجهة
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );

    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-phone": ADMIN_PHONE,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      showNotification("تم تحديث حالة السجل بنجاح");
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // حذف سجل فردي فوري دون تعليق
  const handleDeleteLead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // حذف فوري من الواجهة
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    showNotification("تم حذف السجل بنجاح");

    try {
      await fetch(`/api/admin/leads?id=${id}&phone=${ADMIN_PHONE}`, {
        method: "DELETE",
        headers: {
          "x-admin-phone": ADMIN_PHONE,
        },
      });
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  // مسح سلات التصفح غير المؤكدة لتنظيف الزحمة
  const handleClearIntents = async () => {
    if (!window.confirm("هل تريد حذف كافة سلات التصفح والاهتمامات لتنظيف لوحة التحكم والإبقاء على الطلبات المؤكدة فقط؟")) {
      return;
    }

    // حذف فوري من الواجهة
    setLeads((prev) => prev.filter((l) => categorizeLead(l as SimpleLead) === "order"));
    showNotification("تم تنظيف سلات التصفح بنجاح");

    try {
      await fetch(`/api/admin/leads?clear_intents=true&phone=${ADMIN_PHONE}`, {
        method: "DELETE",
        headers: {
          "x-admin-phone": ADMIN_PHONE,
        },
      });
    } catch (err) {
      console.error("Failed to clear intents:", err);
    }
  };

  // تصنيف السجلات
  const allOrdersLeads = useMemo(
    () => leads.filter((l) => categorizeLead(l as SimpleLead) === "order"),
    [leads]
  );

  const b2bOrdersLeads = useMemo(
    () => allOrdersLeads.filter((l) => isB2BLead(l as SimpleLead)),
    [allOrdersLeads]
  );

  const academyOrdersLeads = useMemo(
    () => allOrdersLeads.filter((l) => isCourseLead(l as SimpleLead)),
    [allOrdersLeads]
  );

  const intentLeads = useMemo(
    () => leads.filter((l) => categorizeLead(l as SimpleLead) !== "order"),
    [leads]
  );

  const clientsList = useMemo(
    () => groupLeadsByClient(leads as SimpleLead[]),
    [leads]
  );

  // تنسيق التاريخ والوقت العربي المريح
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ar-EG", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // تصدير إكسل CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      "المعرف",
      "النوع",
      "الاسم",
      "رقم الهاتف",
      "الدولة",
      "الخدمة / الباقة",
      "الحالة",
      "التاريخ",
      "ملاحظات",
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${categorizeLead(l as SimpleLead)}"`,
      `"${(l.client_name || "").replace(/"/g, '""')}"`,
      `"${l.phone || ""}"`,
      `"${l.country || ""}"`,
      `"${(l.selected_package || "").replace(/"/g, '""')}"`,
      `"${l.status || ""}"`,
      `"${l.created_at || ""}"`,
      `"${(l.client_notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `سجلات_العملاء_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // شاشات تسجيل الدخول برقم الأدمن
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#060709] flex items-center justify-center p-4 sm:p-6 text-right font-sans">
        <div className="w-full max-w-md bg-[#0D111A] border border-white/10 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-af-yellow/10 border border-af-yellow/30 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-af-yellow" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white mb-2">لوحة التحكم المركزية</h1>
            <p className="text-sm text-gray-400">
              يرجى تسجيل الدخول برقم هاتف الإدارة المعتمد للوصول لبيانات العملاء والطلبات.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={openGate}
              className="w-full py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-extrabold text-base flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <UserCheck className="w-5 h-5" />
              <span>تسجيل الدخول برقم الأدمن</span>
            </button>

            <a
              href="/"
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors block"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة للمنصة الرئيسية</span>
            </a>
          </div>
        </div>
      </main>
    );
  }

  // فلترة السجلات المعروضة حسب التبويب والبحث
  const filterList = <T extends { client_name?: string; name?: string; phone?: string; selected_package?: string; status?: string }>(
    list: T[]
  ) => {
    const q = searchQuery.toLowerCase().trim();
    return list.filter((item) => {
      const name = (item.client_name || item.name || "").toLowerCase();
      const phoneNum = (item.phone || "").toLowerCase();
      const pkg = (item.selected_package || "").toLowerCase();

      const matchesSearch = !q || name.includes(q) || phoneNum.includes(q) || pkg.includes(q);
      const matchesStatus = statusFilter === "all" || !item.status || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredClients = filterList(clientsList);
  const filteredB2B = filterList(b2bOrdersLeads);
  const filteredAcademy = filterList(academyOrdersLeads);
  const filteredIntents = filterList(intentLeads);

  return (
    <main className="min-h-screen bg-[#060709] text-gray-100 font-sans text-right pb-20 selection:bg-af-yellow selection:text-black">
      {/* التنبيه الفوري الصغير */}
      {notification && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0E1420] border border-af-yellow/40 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-af-yellow" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* الهيدر الرئيسي المريح والعصري */}
      <header className="sticky top-0 z-40 bg-[#070A10]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" title="الرئيسية" className="shrink-0">
              <img
                src="/icon.png"
                alt="AF Logo"
                className="w-10 h-10 rounded-xl bg-black border border-af-yellow/30 p-1"
              />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white">لوحة تحكم المنصة</h1>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-xs text-gray-400">
                حساب الأدمن: <span className="text-af-yellow font-bold">{phone}</span>
              </p>
            </div>
          </div>

          {/* أزرار العمليات السريعة */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="/"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-af-yellow" />
              <span>الموقع الرئيسي</span>
            </a>

            <button
              onClick={fetchLeads}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-af-yellow" : ""}`} />
              <span>تحديث</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير إكسل</span>
            </button>

            <button
              onClick={handleClearIntents}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold text-red-400 flex items-center gap-1.5 transition-colors"
              title="مسح سلات التصفح والاهتمامات لتنظيف الزحمة"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تنظيف سلات التصفح</span>
            </button>

            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 text-xs font-bold text-gray-400 hover:text-red-400 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* البطاقات الإحصائية الرئيسية المريحة */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            onClick={() => setActiveTab("clients")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === "clients"
                ? "bg-[#0E1422] border-af-yellow shadow-sm ring-1 ring-af-yellow/40"
                : "bg-[#090C12] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold">دليل العملاء والمسجلين</span>
              <Users className="w-4 h-4 text-af-yellow" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{clientsList.length}</div>
            <div className="text-[11px] text-gray-400 mt-1">إجمالي العملاء بالقاعدة</div>
          </div>

          <div
            onClick={() => setActiveTab("b2b_orders")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === "b2b_orders"
                ? "bg-[#0E1422] border-af-yellow shadow-sm ring-1 ring-af-yellow/40"
                : "bg-[#090C12] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold">طلبات مشاريع الشركات</span>
              <Briefcase className="w-4 h-4 text-af-yellow" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{b2bOrdersLeads.length}</div>
            <div className="text-[11px] text-gray-400 mt-1">طلبات B2B مؤكدة</div>
          </div>

          <div
            onClick={() => setActiveTab("academy_orders")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === "academy_orders"
                ? "bg-[#0E1422] border-af-yellow shadow-sm ring-1 ring-af-yellow/40"
                : "bg-[#090C12] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold">حجوزات الكورسات</span>
              <GraduationCap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">{academyOrdersLeads.length}</div>
            <div className="text-[11px] text-gray-400 mt-1">حجوزات تدريب الأكاديمية</div>
          </div>

          <div
            onClick={() => setActiveTab("intent")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === "intent"
                ? "bg-[#0E1422] border-af-yellow shadow-sm ring-1 ring-af-yellow/40"
                : "bg-[#090C12] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold">سلات التصفح والاهتمامات</span>
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{intentLeads.length}</div>
            <div className="text-[11px] text-gray-400 mt-1">نقرات لم تؤكد طلبها بعد</div>
          </div>
        </div>

        {/* شريط الأقسام والبحث الموحد */}
        <div className="bg-[#090C12] border border-white/10 p-3 sm:p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
          {/* التبويبات الأربعة النظيفة */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => {
                setActiveTab("clients");
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "clients"
                  ? "bg-af-yellow text-black shadow-sm font-extrabold"
                  : "bg-white/5 hover:bg-white/10 text-gray-300"
              }`}
            >
              👥 العملاء والمسجلون ({clientsList.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("b2b_orders");
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "b2b_orders"
                  ? "bg-af-yellow text-black shadow-sm font-extrabold"
                  : "bg-white/5 hover:bg-white/10 text-gray-300"
              }`}
            >
              💼 طلبات المشاريع ({b2bOrdersLeads.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("academy_orders");
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "academy_orders"
                  ? "bg-af-yellow text-black shadow-sm font-extrabold"
                  : "bg-white/5 hover:bg-white/10 text-gray-300"
              }`}
            >
              🎓 حجوزات الكورسات ({academyOrdersLeads.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("intent");
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === "intent"
                  ? "bg-af-yellow text-black shadow-sm font-extrabold"
                  : "bg-white/5 hover:bg-white/10 text-gray-300"
              }`}
            >
              🛒 سلات التصفح ({intentLeads.length})
            </button>
          </div>

          {/* خانة البحث والفلتر */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو الرقم أو الخدمة..."
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-[#06080E] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-af-yellow transition-colors placeholder:text-gray-500"
              />
            </div>

            {activeTab !== "clients" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#06080E] border border-white/10 text-xs sm:text-sm text-gray-200 font-bold focus:outline-none focus:border-af-yellow cursor-pointer"
              >
                <option value="all">كافة الحالات</option>
                <option value="new">جديد</option>
                <option value="contacted">تم التواصل</option>
                <option value="in_progress">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* التبويب 1: دليل العملاء والمسجلين                          */}
        {/* ========================================================= */}
        {activeTab === "clients" && (
          <div className="space-y-3">
            {filteredClients.length === 0 ? (
              <div className="bg-[#090C12] border border-white/10 rounded-2xl p-10 text-center text-gray-400">
                لا يوجد عملاء مسجلون حالياً.
              </div>
            ) : (
              <div className="bg-[#090C12] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-white/5">
                  {filteredClients.map((client) => {
                    const isExpanded = expandedId === client.phone;
                    const waMsg = encodeURIComponent(
                      `مرحباً بك أستاذ ${client.name}، يسعدنا التواصل معك من إدارة منصة AF AGENCY بخصوص اهتماماتك ومشاريعك.`
                    );

                    return (
                      <div key={client.phone} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* بيانات العميل الأساسية */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-base sm:text-lg font-black text-white">{client.name}</span>
                              <span className="text-xs font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                                {client.country}
                              </span>
                              {client.b2bCount > 0 && (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                  {client.b2bCount} مشروع شركات
                                </span>
                              )}
                              {client.academyCount > 0 && (
                                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                                  {client.academyCount} كورس تدريب
                                </span>
                              )}
                              {client.totalIntents > 0 && (
                                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                  {client.totalIntents} اهتمامات بالسلة
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 flex-wrap">
                              <span className="font-bold text-af-yellow text-sm sm:text-base" dir="ltr">
                                {client.phone}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400 text-xs">
                                آخر نشاط: {formatDate(client.lastSeen)}
                              </span>
                            </div>
                          </div>

                          {/* أزرار الاتصال والتفاصيل */}
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}?text=${waMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>واتساب</span>
                            </a>

                            <a
                              href={`tel:${client.phone}`}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-colors"
                              title="اتصال هاتفي"
                            >
                              <Phone className="w-4 h-4 text-af-yellow" />
                            </a>

                            <button
                              onClick={() => setExpandedId(isExpanded ? null : client.phone)}
                              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 flex items-center gap-1 transition-colors"
                            >
                              <span>السجل والسلة</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* السجل الموسع للعميل */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                            <h4 className="text-xs font-bold text-af-yellow">تفاصيل السلة والطلبات الخاصة بهذا العميل:</h4>
                            <div className="space-y-2">
                              {client.orders.map((ord) => (
                                <div
                                  key={ord.id}
                                  className="p-3 rounded-xl bg-[#06080E] border border-white/10 flex items-center justify-between text-xs"
                                >
                                  <div>
                                    <span className="font-bold text-white ml-2">{ord.selected_package}</span>
                                    <span className="text-gray-400">({ord.service_category || "طلب مؤكد"})</span>
                                    {ord.client_notes && <p className="text-gray-400 mt-1">{ord.client_notes}</p>}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-400">{formatDate(ord.created_at)}</span>
                                    <button
                                      onClick={(e) => handleDeleteLead(ord.id, e)}
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                      title="حذف هذا الطلب"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}

                              {client.intents.map((it) => (
                                <div
                                  key={it.id}
                                  className="p-3 rounded-xl bg-[#06080E] border border-amber-500/20 flex items-center justify-between text-xs"
                                >
                                  <div>
                                    <span className="text-amber-400 font-bold ml-2">سلة / تصفح: {it.selected_package}</span>
                                    {it.client_notes && <p className="text-gray-400 mt-1">{it.client_notes}</p>}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-400">{formatDate(it.created_at)}</span>
                                    <button
                                      onClick={(e) => handleDeleteLead(it.id, e)}
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                      title="حذف من السلة"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
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
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* التبويب 2: طلبات مشاريع الشركات B2B                         */}
        {/* ========================================================= */}
        {activeTab === "b2b_orders" && (
          <div className="space-y-3">
            {filteredB2B.length === 0 ? (
              <div className="bg-[#090C12] border border-white/10 rounded-2xl p-10 text-center text-gray-400">
                لا توجد طلبات مشاريع شركات حالياً.
              </div>
            ) : (
              <div className="bg-[#090C12] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-white/5">
                  {filteredB2B.map((lead) => {
                    const isExpanded = expandedId === lead.id;
                    const waMsg = encodeURIComponent(
                      `مرحباً بك أستاذ ${lead.client_name}، نتواصل معك من إدارة AF AGENCY بخصوص طلب مشروع [${lead.selected_package}]. يسعدنا تحديد المتطلبات والبدء.`
                    );

                    return (
                      <div key={lead.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-base sm:text-lg font-black text-white">{lead.client_name}</span>
                              {lead.brand_name && (
                                <span className="text-xs font-bold text-af-yellow bg-af-yellow/10 border border-af-yellow/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  <span>{lead.brand_name}</span>
                                </span>
                              )}
                              <span className="text-xs font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">
                                {lead.country || "مصر"}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 flex-wrap">
                              <span className="font-bold text-af-yellow text-sm sm:text-base" dir="ltr">
                                {lead.phone}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="font-bold text-white">{lead.selected_package}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400 text-xs">{formatDate(lead.created_at)}</span>
                            </div>
                          </div>

                          {/* إجراءات الطلب السريعة */}
                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${waMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>واتساب</span>
                            </a>

                            <a
                              href={`tel:${lead.phone}`}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-colors"
                              title="اتصال هاتفي"
                            >
                              <Phone className="w-4 h-4 text-af-yellow" />
                            </a>

                            {/* اختيار الحالة السريع */}
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadItem["status"])}
                              className={`px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none transition-colors cursor-pointer ${
                                lead.status === "new"
                                  ? "bg-af-yellow text-black border-af-yellow"
                                  : lead.status === "contacted"
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                  : lead.status === "in_progress"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  : lead.status === "completed"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : "bg-red-500/20 text-red-300 border-red-500/40"
                              }`}
                            >
                              <option value="new" className="bg-[#0A0D14] text-white">جديد</option>
                              <option value="contacted" className="bg-[#0A0D14] text-white">تم التواصل</option>
                              <option value="in_progress" className="bg-[#0A0D14] text-white">قيد التنفيذ</option>
                              <option value="completed" className="bg-[#0A0D14] text-white">مكتمل</option>
                              <option value="cancelled" className="bg-[#0A0D14] text-white">ملغي</option>
                            </select>

                            {/* زر الحذف الفوري الصريح (الباسكت) */}
                            <button
                              onClick={(e) => handleDeleteLead(lead.id, e)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
                              title="حذف هذا الطلب"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-400 transition-colors"
                              title="عرض التفاصيل"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* التفاصيل الموسعة للطلب */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-[#06080E] border border-white/5">
                              <span className="text-gray-400 block mb-1">الميزانية ووقت التسليم:</span>
                              <span className="font-bold text-white">
                                الميزانية: {lead.max_budget || "غير محددة"} | التسليم: {lead.delivery_timeframe || "حسب الاتفاق"}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#06080E] border border-white/5 sm:col-span-2">
                              <span className="text-gray-400 block mb-1">الملاحظات والمتطلبات:</span>
                              <p className="text-gray-200 leading-relaxed">{lead.client_notes || "لا توجد ملاحظات إضافية"}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* التبويب 3: حجوزات الكورسات بالأكاديمية                     */}
        {/* ========================================================= */}
        {activeTab === "academy_orders" && (
          <div className="space-y-3">
            {filteredAcademy.length === 0 ? (
              <div className="bg-[#090C12] border border-white/10 rounded-2xl p-10 text-center text-gray-400">
                لا توجد حجوزات تدريب مسجلة حالياً.
              </div>
            ) : (
              <div className="bg-[#090C12] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-white/5">
                  {filteredAcademy.map((lead) => {
                    const waMsg = encodeURIComponent(
                      `أهلاً بك أستاذ ${lead.client_name}، نتواصل معك من إدارة AF ACADEMY بخصوص حجزك في كورس [${lead.selected_package}]. يسعدنا إتمام تسجيل مقعدك.`
                    );

                    return (
                      <div key={lead.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-base sm:text-lg font-black text-white">{lead.client_name}</span>
                              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                                {lead.selected_package}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 flex-wrap">
                              <span className="font-bold text-af-yellow text-sm sm:text-base" dir="ltr">
                                {lead.phone}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400 text-xs">{formatDate(lead.created_at)}</span>
                              {lead.client_notes && (
                                <>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-400 text-xs">{lead.client_notes}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${waMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>واتساب</span>
                            </a>

                            <a
                              href={`tel:${lead.phone}`}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-colors"
                              title="اتصال هاتفي"
                            >
                              <Phone className="w-4 h-4 text-af-yellow" />
                            </a>

                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadItem["status"])}
                              className="px-3 py-2 rounded-xl text-xs font-bold border border-white/10 bg-[#06080E] text-white focus:outline-none cursor-pointer"
                            >
                              <option value="new">جديد</option>
                              <option value="contacted">تم التواصل</option>
                              <option value="completed">تم التأكيد</option>
                              <option value="cancelled">ملغي</option>
                            </select>

                            <button
                              onClick={(e) => handleDeleteLead(lead.id, e)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
                              title="حذف هذا الحجز"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* التبويب 4: سلات التصفح والاهتمامات (سلة متروكة)             */}
        {/* ========================================================= */}
        {activeTab === "intent" && (
          <div className="space-y-4">
            {/* شريط الإجراءات لسلات التصفح */}
            <div className="bg-[#090C12] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <AlertCircle className="w-4 h-4 text-af-yellow shrink-0" />
                <span>
                  هذه السجلات تخص زواراً سجلوا بياناتهم وتصفحوا باقات وخدمات محددة. يمكنك التواصل معهم لاستردادهم أو تنظيف السلات بضغطة زر.
                </span>
              </div>
              <button
                onClick={handleClearIntents}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح كافة سلات التصفح</span>
              </button>
            </div>

            {filteredIntents.length === 0 ? (
              <div className="bg-[#090C12] border border-white/10 rounded-2xl p-10 text-center text-gray-400">
                لا توجد سلات تصفح مسجلة حالياً.
              </div>
            ) : (
              <div className="bg-[#090C12] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-white/5">
                  {filteredIntents.map((lead) => {
                    const waMsg = encodeURIComponent(
                      `أهلاً بك أستاذ ${lead.client_name}، لاحظنا تصفحك لباقة [${lead.selected_package}] على منصة AF AGENCY. يسعدنا تقديم استشارة ومساعدتك في اختيار الأنسب لك!`
                    );

                    return (
                      <div key={lead.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm sm:text-base font-black text-white">{lead.client_name}</span>
                              <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                {lead.selected_package}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                              <span className="text-af-yellow font-bold" dir="ltr">{lead.phone}</span>
                              <span>•</span>
                              <span>{formatDate(lead.created_at)}</span>
                              {lead.client_notes && (
                                <>
                                  <span>•</span>
                                  <span className="text-gray-300">{lead.client_notes}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${waMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>مراسلة واتساب</span>
                            </a>

                            <button
                              onClick={(e) => handleDeleteLead(lead.id, e)}
                              className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
                              title="حذف هذا السجل"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
