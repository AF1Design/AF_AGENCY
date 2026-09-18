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
    const storedCountry = localStorage.getItem("af_country") || "EG";

    // نحدد الهاتف المسجل أو نحدد أنه زائر متصفح
    const phoneToRecord = storedPhone.trim() || "زائر استكشاف عام";

    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: storedPhone ? "عميل مهتم (نقر على الخدمة)" : "زائر استكشاف خدمات",
        phone: phoneToRecord,
        country: storedCountry === "EG" ? "مصر" : "الخليج العربي",
        currency: storedCountry === "EG" ? "EGP" : "SAR",
        serviceCategory: category,
        selectedPackage: serviceName,
        leadType: "intent",
        adSource: "نقرة مباشرة على الخدمة بالمنصة",
        clientNotes: notes || `ضغط على خدمة: [${serviceName}] واستعرض تفاصيلها`,
      }),
    });
  } catch (err) {
    console.error("Error logging service click:", err);
  }
}
