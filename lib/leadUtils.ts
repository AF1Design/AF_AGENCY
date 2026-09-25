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

    if (!clientMap.has(rawPhone)) {
      clientMap.set(rawPhone, {
        phone: rawPhone,
        name: lead.client_name && !lead.client_name.includes("تسجيل") && !lead.client_name.includes("زائر")
          ? lead.client_name
          : "عميل مسجل",
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

    if (
      lead.client_name &&
      !lead.client_name.includes("تسجيل") &&
      !lead.client_name.includes("زائر") &&
      profile.name === "عميل مسجل"
    ) {
      profile.name = lead.client_name;
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
