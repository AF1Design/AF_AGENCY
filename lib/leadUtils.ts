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
}

export function groupLeadsByClient(leads: SimpleLead[]): ClientProfile[] {
  const clientMap = new Map<string, ClientProfile>();

  for (const lead of leads) {
    const rawPhone = lead.phone?.trim();
    if (!rawPhone) continue;

    const leadType = categorizeLead(lead);

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
        orders: [],
        intents: [],
        firstSeen: lead.created_at,
        lastSeen: lead.created_at,
        status: "potential_lead",
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
    } else {
      profile.totalIntents += 1;
      profile.intents.push(lead);
    }
  }

  return Array.from(clientMap.values()).sort(
    (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
  );
}
