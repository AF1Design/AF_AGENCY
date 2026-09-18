import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { saveLead } from "@/lib/leadsStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      phone,
      brandName,
      businessField,
      deliveryTimeframe,
      maxBudget,
      serviceCategory,
      selectedPackage,
      selectedAddons,
      clientNotes,
      adSource,
      leadType,
      country,
      currency,
    } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "رقم الهاتف أو الواتساب مطلوب لإتمام الطلب" },
        { status: 400 }
      );
    }

    // تحديد نوع السجل: طلب كامل / اهتمام بنقر خدمة / تسجيل بالبوابة
    const determinedType: "order" | "intent" | "registration" =
      leadType ||
      (brandName || deliveryTimeframe || maxBudget
        ? "order"
        : clientName?.includes("تسجيل") || selectedPackage?.includes("بوابة")
        ? "registration"
        : "intent");

    const detailedNotes = [
      brandName ? `اسم البراند/الشركة: ${brandName}` : null,
      businessField ? `مجال العمل/المنتجات: ${businessField}` : null,
      deliveryTimeframe ? `وقت التسليم المطلوب: ${deliveryTimeframe}` : null,
      maxBudget ? `سقف الميزانية: ${maxBudget}` : null,
      clientNotes ? `ملاحظات: ${clientNotes}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const newLead = {
      client_name: clientName || "عميل بدون اسم",
      phone: phone,
      brand_name: brandName || "",
      business_field: businessField || "",
      delivery_timeframe: deliveryTimeframe || "",
      max_budget: maxBudget || "",
      service_category: serviceCategory || "غير محدد",
      selected_package: selectedPackage || "غير محدد",
      selected_addons: selectedAddons || [],
      client_notes: detailedNotes || clientNotes || "",
      ad_source: adSource || "مباشر",
      lead_type: determinedType,
      country: country || (phone.startsWith("01") ? "مصر" : "الخليج العربي"),
      currency: currency || (phone.startsWith("01") ? "EGP" : "SAR"),
      created_at: new Date().toISOString(),
    };

    // حفظ الطلب في وحدة التخزين الدائمة لضمان وصوله إلى لوحة تحكم الأدمن فوراً
    const storedLead = saveLead(newLead);

    // في حال كانت مفاتيح سوبابيس مضافة في ملف البيئة يتم الحفظ في القاعدة السحابية أيضاً
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: sbError } = await supabase
          .from("leads")
          .upsert([storedLead], { onConflict: "id" });
        if (sbError) {
          console.error("Supabase sync error:", sbError);
        } else {
          console.log("Supabase sync success for lead:", storedLead.id);
        }
      } catch (err) {
        console.error("Supabase sync warning:", err);
      }
    }

    console.log("=== طلب جديد تم تسجيله بنجاح ===");
    console.log(storedLead);
    console.log("===============================");

    return NextResponse.json({
      success: true,
      message: "تم استقبال الطلب وحفظه بنجاح",
      lead: storedLead,
    });
  } catch (error) {
    console.error("Error handling lead submission:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة الطلب" },
      { status: 500 }
    );
  }
}
