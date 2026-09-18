-- ==============================================================================
-- إعداد وتجهيز قاعدة بيانات سوبابيس لمنصة AF
-- قم بنسخ هذا الملف بالكامل ولصقه في محرر الاستعلامات (SQL Editor) ثم اضغط Run
-- ==============================================================================

-- 1. إنشاء جدول الطلبات ونقرات العملاء (leads)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    brand_name TEXT DEFAULT '',
    business_field TEXT DEFAULT '',
    delivery_timeframe TEXT DEFAULT '',
    max_budget TEXT DEFAULT '',
    service_category TEXT NOT NULL,
    selected_package TEXT NOT NULL,
    selected_addons JSONB DEFAULT '[]'::jsonb,
    estimated_price TEXT,
    client_notes TEXT DEFAULT '',
    ad_source TEXT DEFAULT 'مباشر',
    lead_type TEXT DEFAULT 'order',
    country TEXT DEFAULT 'مصر',
    currency TEXT DEFAULT 'EGP',
    status TEXT DEFAULT 'new'
);

-- 2. تفعيل نظام حماية السجلات (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. صلاحية إرسال الطلبات والنقرات من الموقع العام (INSERT Policy)
DROP POLICY IF EXISTS "السماح بإضافة الطلبات والنقرات" ON public.leads;
CREATE POLICY "السماح بإضافة الطلبات والنقرات"
    ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 4. صلاحية قراءة واستعراض الطلبات (SELECT Policy)
DROP POLICY IF EXISTS "السماح بقراءة الطلبات" ON public.leads;
CREATE POLICY "السماح بقراءة الطلبات"
    ON public.leads
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 5. صلاحية تحديث حالة الطلبات (UPDATE Policy)
DROP POLICY IF EXISTS "السماح بتحديث الطلبات" ON public.leads;
CREATE POLICY "السماح بتحديث الطلبات"
    ON public.leads
    FOR UPDATE
    TO anon, authenticated
    USING (true);

-- 6. صلاحية حذف الطلبات من لوحة التحكم (DELETE Policy)
DROP POLICY IF EXISTS "السماح بحذف الطلبات" ON public.leads;
CREATE POLICY "السماح بحذف الطلبات"
    ON public.leads
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- 7. إنشاء فهارس سريعة للبحث الفوري
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_phone_idx ON public.leads (phone);
CREATE INDEX IF NOT EXISTS leads_type_idx ON public.leads (lead_type);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
