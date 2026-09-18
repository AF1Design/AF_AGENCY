import fs from "fs";
import path from "path";

export interface LeadItem {
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

export function categorizeLead(lead: LeadItem): "order" | "intent" | "registration" {
  if (lead.lead_type) return lead.lead_type;
  if (lead.brand_name || lead.business_field || lead.delivery_timeframe || lead.max_budget) {
    return "order";
  }
  if (
    lead.client_name?.includes("تسجيل دخول") ||
    lead.selected_package?.includes("تحديد النطاق") ||
    lead.ad_source?.includes("Welcome Gate")
  ) {
    return "registration";
  }
  return "intent";
}

const STORE_PATH = path.join(process.cwd(), "data", "leads_store.json");

function ensureStoreExists() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify([], null, 2), "utf8");
  }
}

export function getAllLeads(): LeadItem[] {
  try {
    ensureStoreExists();
    const content = fs.readFileSync(STORE_PATH, "utf8");
    const leads: LeadItem[] = JSON.parse(content);
    return leads.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error("Error reading leads store:", error);
    return [];
  }
}

export function saveLead(leadData: Omit<LeadItem, "id" | "status" | "created_at">): LeadItem {
  ensureStoreExists();
  const leads = getAllLeads();

  const newLead: LeadItem = {
    ...leadData,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: "new",
    created_at: new Date().toISOString(),
  };

  leads.unshift(newLead);

  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(leads, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing to leads store:", error);
  }

  return newLead;
}

export function updateLeadStatus(id: string, status: LeadItem["status"]): boolean {
  try {
    ensureStoreExists();
    const leads = getAllLeads();
    const leadIndex = leads.findIndex((l) => l.id === id);
    if (leadIndex === -1) return false;

    leads[leadIndex].status = status;
    fs.writeFileSync(STORE_PATH, JSON.stringify(leads, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error updating lead status:", error);
    return false;
  }
}

export function deleteLead(id: string): boolean {
  try {
    ensureStoreExists();
    let leads = getAllLeads();
    const initialLen = leads.length;
    leads = leads.filter((l) => l.id !== id);
    if (leads.length === initialLen) return false;

    fs.writeFileSync(STORE_PATH, JSON.stringify(leads, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error deleting lead:", error);
    return false;
  }
}
