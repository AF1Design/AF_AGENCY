export type LeadType = "order" | "intent" | "registration";

export interface SimpleLead {
  id: string;
  client_name: string;
  phone: string;
  brand_name?: string;
  business_field?: string;
  delivery_timeframe?: string;
  max_budget?: string;
  service_category?: string;
  selected_package?: string;
  selected_addons?: string[];
  client_notes?: string;
  ad_source?: string;
  lead_type?: "order" | "intent" | "registration";
  country?: string;
  currency?: string;
  status: "new" | "contacted" | "in_progress" | "completed" | "cancelled";
  created_at: string;
}

export function categorizeLead(lead: SimpleLead): LeadType {
  if (lead.lead_type) return lead.lead_type;
  
  if (lead.brand_name || lead.business_field || lead.delivery_timeframe || lead.max_budget) {
    return "order";
  }
  
  if (
    lead.client_name?.includes("تسجيل") ||
    lead.selected_package?.includes("تحديد النطاق") ||
    lead.ad_source?.includes("Welcome Gate")
  ) {
    return "registration";
  }
  
  return "intent";
}

export function isCourseLead(lead: SimpleLead): boolean {
  if (lead.service_category === "courses") return true;
  const pkg = (lead.selected_package || "").toLowerCase();
  const notes = (lead.client_notes || "").toLowerCase();
  const source = (lead.ad_source || "").toLowerCase();
  const field = (lead.business_field || "").toLowerCase();

  return (
    pkg.includes("كورس") ||
    pkg.includes("course") ||
    pkg.includes("جرافيك ديزاين") ||
    pkg.includes("graphic design") ||
    pkg.includes("ذكاء اصطناعي") ||
    pkg.includes("ai") ||
    pkg.includes("دبلومة") ||
    pkg.includes("diploma") ||
    pkg.includes("البرو") ||
    source.includes("academy") ||
    source.includes("كورس") ||
    field.includes("كورس") ||
    field.includes("تدريب") ||
    notes.includes("كورس") ||
    notes.includes("دورة")
  );
}

export function isB2BLead(lead: SimpleLead): boolean {
  return !isCourseLead(lead);
}

export interface ClientProfile {
  phone: string;
  name: string;
  brandName?: string;
  businessField?: string;
  country: string;
  currency: string;
  totalOrders: number;
  totalIntents: number;
  orders: SimpleLead[];
  intents: SimpleLead[];
  firstSeen: string;
  lastSeen: string;
  status: "active_client" | "potential_lead";
  clientType: "b2b" | "academy" | "both" | "visitor";
  b2bCount: number;
  academyCount: number;
}

export function groupLeadsByClient(leads: SimpleLead[]): ClientProfile[] {
  const clientMap = new Map<string, ClientProfile>();

  for (const lead of leads) {
    const rawPhone = lead.phone?.trim();
    if (!rawPhone) continue;

    const leadType = categorizeLead(lead);
    const isCourse = isCourseLead(lead);

    // محاولة استخراج اسم العميل الحقيقي
    let extractedName = (lead.client_name || "").trim();
    const isPlaceholder =
      !extractedName ||
      extractedName.includes("تسجيل") ||
      extractedName.includes("زائر") ||
      extractedName.includes("مهتم") ||
      extractedName.startsWith("عميل (");

    if (isPlaceholder && lead.client_notes) {
      const match = lead.client_notes.match(/الاسم:\s*([^\]\-]+)/);
      if (match && match[1]?.trim()) {
        extractedName = match[1].trim();
      }
    }

    const hasRealName =
      extractedName &&
      !extractedName.includes("تسجيل") &&
      !extractedName.includes("زائر") &&
      !extractedName.includes("مهتم") &&
      !extractedName.startsWith("عميل (");

    if (!clientMap.has(rawPhone)) {
      clientMap.set(rawPhone, {
        phone: rawPhone,
        name: hasRealName ? extractedName : "عميل مسجل",
        brandName: lead.brand_name || undefined,
        businessField: lead.business_field || undefined,
        country: lead.country || (rawPhone.startsWith("01") ? "مصر" : "الخليج العربي"),
        currency: lead.currency || (rawPhone.startsWith("01") ? "EGP" : "SAR"),
        totalOrders: 0,
        totalIntents: 0,
        b2bCount: 0,
        academyCount: 0,
        orders: [],
        intents: [],
        firstSeen: lead.created_at,
        lastSeen: lead.created_at,
        status: "potential_lead",
        clientType: "visitor",
      });
    }

    const profile = clientMap.get(rawPhone)!;

    if (new Date(lead.created_at) < new Date(profile.firstSeen)) {
      profile.firstSeen = lead.created_at;
    }
    if (new Date(lead.created_at) > new Date(profile.lastSeen)) {
      profile.lastSeen = lead.created_at;
    }

    if (hasRealName && (profile.name === "عميل مسجل" || profile.name.startsWith("عميل ("))) {
      profile.name = extractedName;
    }
    if (lead.brand_name && !profile.brandName) {
      profile.brandName = lead.brand_name;
    }
    if (lead.business_field && !profile.businessField) {
      profile.businessField = lead.business_field;
    }

    if (leadType === "order") {
      profile.totalOrders += 1;
      profile.orders.push(lead);
      profile.status = "active_client";
      if (isCourse) {
        profile.academyCount += 1;
      } else {
        profile.b2bCount += 1;
      }
    } else {
      profile.totalIntents += 1;
      profile.intents.push(lead);
    }

    if (profile.b2bCount > 0 && profile.academyCount > 0) {
      profile.clientType = "both";
    } else if (profile.academyCount > 0) {
      profile.clientType = "academy";
    } else if (profile.b2bCount > 0) {
      profile.clientType = "b2b";
    } else {
      profile.clientType = isCourse ? "academy" : "visitor";
    }
  }

  return Array.from(clientMap.values()).sort(
    (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
  );
}

// دالة تحويل وضبط رقم الهاتف للصيغة الدولية الصحيحة للواتساب لفتحه فوراً دون أخطاء
export function formatWhatsAppUrl(rawPhone: string, message: string = ""): string {
  if (!rawPhone) return "#";

  let cleaned = rawPhone.replace(/[^0-9]/g, "");
  if (!cleaned) return "#";

  // إزالة أي أصفار بادئة دولية مثل 0020 أو 00966
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.substring(2);
  }

  // الأرقام المصرية: تبدأ بـ 01 (مثل 010, 011, 012, 015)
  if (cleaned.startsWith("01")) {
    cleaned = "20" + cleaned.substring(1);
  }
  // إذا أدخل المستخدم كود مصر مع الصفر المحلي مثل 2001
  else if (cleaned.startsWith("2001")) {
    cleaned = "20" + cleaned.substring(3);
  }
  // إذا كان الرقم مصرياً بدون 0 وبدون كود (10 أرقام تبدأ بـ 10, 11, 12, 15)
  else if (
    (cleaned.startsWith("10") ||
      cleaned.startsWith("11") ||
      cleaned.startsWith("12") ||
      cleaned.startsWith("15")) &&
    cleaned.length === 10
  ) {
    cleaned = "20" + cleaned;
  }
  // الأرقام السعودية والخليجية تبدأ بـ 05
  else if (cleaned.startsWith("05")) {
    cleaned = "966" + cleaned.substring(1);
  }
  // إذا كان الرقم سعودياً يبدأ بـ 5 وتتراوح أرقامه
  else if (cleaned.startsWith("5") && cleaned.length === 9) {
    cleaned = "966" + cleaned;
  }

  const encodedText = message ? `&text=${encodeURIComponent(message)}` : "";
  return `https://api.whatsapp.com/send?phone=${cleaned}${encodedText}`;
}

