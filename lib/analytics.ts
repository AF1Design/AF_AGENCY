// دالة تتبع وتسجيل نقرات الخدمات في لوحة التحكم بشكل حقيقي وفوري
export async function trackServiceInterest({
  serviceName,
  category = "web",
  notes,
}: {
  serviceName: string;
  category?: string;
  notes?: string;
}) {
  try {
    if (typeof window === "undefined") return;

    const storedPhone = localStorage.getItem("af_phone") || "";
    const storedName = localStorage.getItem("af_client_name") || "";
    const storedCountry = localStorage.getItem("af_country") || "EG";

    // لا نسجل نقرات بدون رقم هاتف لتفادي السجلات المجهولة في لوحة التحكم
    if (!storedPhone || storedPhone.trim().length < 8) {
      return;
    }

    const cleanPhone = storedPhone.trim();
    const cleanName = storedName.trim() || `عميل (${cleanPhone})`;

    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: cleanName,
        phone: cleanPhone,
        country: storedCountry === "EG" ? "مصر" : "الخليج العربي",
        currency: storedCountry === "EG" ? "EGP" : "SAR",
        serviceCategory: category,
        selectedPackage: serviceName,
        leadType: "intent",
        adSource: "نقرة مباشرة على الخدمة بالمنصة",
        clientNotes: notes || `العميل [${cleanName}] استعرض تفاصيل: [${serviceName}]`,
      }),
    });
  } catch (err) {
    console.error("Error logging service click:", err);
  }
}
