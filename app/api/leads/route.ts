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

    const sanitizedPhone = String(phone || "").trim().slice(0, 30);
    const sanitizedName = String(clientName || "عميل بدون اسم").trim().slice(0, 100);
    const sanitizedBrand = String(brandName || "").trim().slice(0, 100);
    const sanitizedField = String(businessField || "").trim().slice(0, 100);
    const sanitizedNotes = String(clientNotes || "").trim().slice(0, 1000);

    if (!sanitizedPhone) {
      return NextResponse.json(
        { error: "رقم الهاتف أو الواتساب مطلوب لإتمام الطلب" },
        { status: 400 }
      );
    }

    // تحديد نوع السجل: طلب كامل / اهتمام بنقر خدمة / تسجيل بالبوابة
    const determinedType: "order" | "intent" | "registration" =
      leadType ||
      (sanitizedBrand || deliveryTimeframe || maxBudget
        ? "order"
        : sanitizedName.includes("تسجيل") || String(selectedPackage || "").includes("بوابة")
        ? "registration"
        : "intent");

    const detailedNotes = [
      sanitizedBrand ? `اسم البراند/الشركة: ${sanitizedBrand}` : null,
      sanitizedField ? `مجال العمل/المنتجات: ${sanitizedField}` : null,
      deliveryTimeframe ? `وقت التسليم المطلوب: ${String(deliveryTimeframe).slice(0, 80)}` : null,
      maxBudget ? `سقف الميزانية: ${String(maxBudget).slice(0, 80)}` : null,
      sanitizedNotes ? `ملاحظات: ${sanitizedNotes}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const newLead = {
      client_name: sanitizedName,
      phone: sanitizedPhone,
      brand_name: sanitizedBrand,
      business_field: sanitizedField,
      delivery_timeframe: String(deliveryTimeframe || "").slice(0, 80),
      max_budget: String(maxBudget || "").slice(0, 80),
      service_category: String(serviceCategory || "غير محدد").slice(0, 80),
      selected_package: String(selectedPackage || "غير محدد").slice(0, 120),
      selected_addons: Array.isArray(selectedAddons) ? selectedAddons.map(a => String(a).slice(0, 80)) : [],
      client_notes: (detailedNotes || sanitizedNotes).slice(0, 1200),
      ad_source: String(adSource || "مباشر").slice(0, 80),
      lead_type: determinedType,
      country: String(country || (sanitizedPhone.startsWith("01") ? "مصر" : "الخليج العربي")).slice(0, 40),
      currency: String(currency || (sanitizedPhone.startsWith("01") ? "EGP" : "SAR")).slice(0, 10),
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
