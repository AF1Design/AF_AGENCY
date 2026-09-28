import { NextResponse } from "next/server";
import {
  getAllLeads,
  updateLeadStatus,
  deleteLead,
  LeadItem,
} from "@/lib/leadsStore";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const ADMIN_PHONE = "011111111112";

function verifyAdminAuth(request: Request): boolean {
  const headerPhone = request.headers.get("x-admin-phone");
  if (headerPhone && headerPhone.replace(/[^0-9]/g, "") === ADMIN_PHONE) {
    return true;
  }
  const url = new URL(request.url);
  const queryPhone = url.searchParams.get("phone");
  if (queryPhone && queryPhone.replace(/[^0-9]/g, "") === ADMIN_PHONE) {
    return true;
  }
  return false;
}

export async function GET(request: Request) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { error: "غير مصرح بالدخول إلى لوحة الإدارة" },
      { status: 401 }
    );
  }

  try {
    let leads = getAllLeads();

    // في حال توافر مفاتيح سوبابيس، يتم قراءة السجلات السحابية ودمجها مع السجلات المحلية
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const supabaseIds = new Set(data.map((d: any) => d.id));
          const localOnly = leads.filter((l) => !supabaseIds.has(l.id));
          leads = [...(data as LeadItem[]), ...localOnly];
        }
      } catch (err) {
        console.warn("Supabase fetch warning:", err);
      }
    }

    const stats = {
      total: leads.length,
      newLeads: leads.filter((l) => l.status === "new").length,
      contacted: leads.filter((l) => l.status === "contacted").length,
      inProgress: leads.filter((l) => l.status === "in_progress").length,
      completed: leads.filter((l) => l.status === "completed").length,
      cancelled: leads.filter((l) => l.status === "cancelled").length,
      todayLeads: leads.filter((l) => {
        const leadDate = new Date(l.created_at).toDateString();
        const todayDate = new Date().toDateString();
        return leadDate === todayDate;
      }).length,
    };

    return NextResponse.json({
      success: true,
      leads,
      stats,
    });
  } catch (error) {
    console.error("Admin leads fetch error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحميل بيانات الطلبات" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { error: "غير مصرح بالدخول إلى لوحة الإدارة" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "المعرف والحالة مطلوبان للتحديث" },
        { status: 400 }
      );
    }

    // تحديث في سوبابيس أولاً
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("leads").update({ status }).eq("id", id);
      } catch (err) {
        console.warn("Supabase update warning:", err);
      }
    }

    // تحديث في التخزين المحلي
    updateLeadStatus(id, status as LeadItem["status"]);

    return NextResponse.json({
      success: true,
      message: "تم تحديث حالة الطلب بنجاح",
    });
  } catch (error) {
    console.error("Admin lead update error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تعديل حالة الطلب" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { error: "غير مصرح بالدخول إلى لوحة الإدارة" },
      { status: 401 }
    );
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const clearIntents = url.searchParams.get("clear_intents") === "true";
    const clientPhone = url.searchParams.get("client_phone");

    // 1. خيار تنظيف سلات التصفح وسجلات النقرات بنقرة واحدة
    if (clearIntents) {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("leads").delete().neq("lead_type", "order");
        } catch (err) {
          console.warn("Supabase clear intents warning:", err);
        }
      }
      const { clearAllIntents } = await import("@/lib/leadsStore");
      clearAllIntents();
      return NextResponse.json({
        success: true,
        message: "تم تنظيف كافة سلات التصفح والاهتمامات بنجاح",
      });
    }

    // 2. خيار مسح كافة سجلات عميل معين
    if (clientPhone) {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("leads").delete().eq("phone", clientPhone);
        } catch (err) {
          console.warn("Supabase delete by phone warning:", err);
        }
      }
      const { deleteLeadsByPhone } = await import("@/lib/leadsStore");
      deleteLeadsByPhone(clientPhone);
      return NextResponse.json({
        success: true,
        message: "تم مسح كافة سجلات العميل بنجاح",
      });
    }

    // 3. حذف سجل فردي
    if (!id) {
      return NextResponse.json(
        { error: "معرف الطلب مطلوب للحذف" },
        { status: 400 }
      );
    }

    // حذف مباشر من سوبابيس
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("leads").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase delete warning:", err);
      }
    }

    // حذف من التخزين المحلي
    deleteLead(id);

    return NextResponse.json({
      success: true,
      message: "تم حذف الطلب بنجاح",
    });
  } catch (error) {
    console.error("Admin lead deletion error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الطلب" },
      { status: 500 }
    );
  }
}
