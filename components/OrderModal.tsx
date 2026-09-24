"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  MessageCircle,
  Send,
  Loader2,
  Sparkles,
  Edit3,
  Clock,
  Coins,
  Briefcase,
  Building2,
  User,
  Phone,
  Layers,
  GraduationCap,
} from "lucide-react";
import { ServiceCategory, RegionCurrency } from "@/types";
import { useRegion } from "@/context/RegionContext";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    serviceCategory: ServiceCategory;
    serviceTitle: string;
    packageName: string;
    packageId: string;
    addons: string[];
    currency?: RegionCurrency;
    estimatedPrice?: string;
  } | null;
}

export default function OrderModal({ isOpen, onClose, orderData }: OrderModalProps) {
  const { country, currency, phone: regionPhone } = useRegion();

  const isCourse = orderData?.serviceCategory === "courses";

  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [studentStatus, setStudentStatus] = useState("طالب جامعي");
  const [brandName, setBrandName] = useState("");
  const [businessField, setBusinessField] = useState("");
  const [deliveryTimeframe, setDeliveryTimeframe] = useState("من أسبوع إلى أسبوعين");
  const [maxBudget, setMaxBudget] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (regionPhone && !phone) {
      setPhone(regionPhone);
    }
  }, [regionPhone, phone]);

  if (!isOpen || !orderData) return null;

  const whatsappNumber = "201114687759";

  const generateWhatsAppMessage = () => {
    if (isCourse) {
      let msg = `COURSE ENROLLMENT INQUIRY // AF ACADEMY\n\n`;
      msg += `الاسم: ${clientName.trim() || "غير محدد"}\n`;
      msg += `رقم الهاتف: ${phone.trim()}\n`;
      msg += `الحالة الدراسية: ${studentStatus}\n`;
      msg += `الكورس المطلوب: ${orderData.packageName}\n`;
      if (orderData.estimatedPrice) {
        msg += `سعر الكورس بالعرض: ${orderData.estimatedPrice}\n`;
      }
      msg += `شروط العرض: للطلاب وحديثي التخرج وحتى اكتمال المقاعد\n`;
      msg += `النطاق الجغرافي: ${country === "EG" ? "مصر (EGP)" : "الخليج الدولي (SAR)"}\n`;
      if (notes.trim()) {
        msg += `ملاحظات إضافية:\n${notes.trim()}\n`;
      }
      msg += `\nأرجو تأكيد حجز المقعد وتفاصيل بدء التدريب.`;
      return encodeURIComponent(msg);
    }

    let msg = `PROJECT ORDER INQUIRY // AF AGENCY\n\n`;
    msg += `الاسم: ${clientName.trim() || "غير محدد"}\n`;
    msg += `رقم الهاتف: ${phone.trim()}\n`;
    if (brandName.trim()) msg += `اسم البراند أو الشركة: ${brandName.trim()}\n`;
    if (businessField.trim()) msg += `مجال العمل والنشاط: ${businessField.trim()}\n`;
    if (deliveryTimeframe.trim()) msg += `وقت التسليم المطلوب: ${deliveryTimeframe.trim()}\n`;
    if (maxBudget.trim()) msg += `الميزانية المحددة: ${maxBudget.trim()}\n`;
    msg += `النطاق الجغرافي: ${country === "EG" ? "مصر (EGP)" : "الخليج الدولي (SAR)"}\n`;
    msg += `الخدمة: ${orderData.serviceTitle}\n`;
    msg += `الباقة المختارة: ${orderData.packageName}\n`;
    if (orderData.estimatedPrice) {
      msg += `التكلفة التقديرية للباقة: ${orderData.estimatedPrice}\n`;
    }
    if (notes.trim()) {
      msg += `ملاحظات إضافية:\n${notes.trim()}\n`;
    }
    msg += `\nننتظر التواصل لتجهيز العرض الفني ونطاق العمل.`;
    return encodeURIComponent(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCourse) {
      if (!clientName.trim() || !phone.trim()) {
        return;
      }
    } else {
      if (
        !clientName.trim() ||
        !phone.trim() ||
        !brandName.trim() ||
        !businessField.trim() ||
        !deliveryTimeframe.trim() ||
        !maxBudget.trim()
      ) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          phone: phone.trim(),
          brandName: isCourse ? studentStatus : brandName.trim(),
          businessField: isCourse ? "حجز كورس تدريبي" : businessField.trim(),
          deliveryTimeframe: isCourse ? "فوري" : deliveryTimeframe.trim(),
          maxBudget: isCourse ? (orderData.estimatedPrice || "3000") : maxBudget.trim(),
          country: country === "EG" ? "مصر" : "الخليج العربي",
          currency: orderData.currency || currency,
          serviceCategory: orderData.serviceCategory,
          selectedPackage: orderData.packageName,
          selectedAddons: orderData.addons,
          clientNotes: notes.trim(),
          leadType: "order",
          adSource: isCourse ? "AF Academy - Course Booking" : "AF Agency Portal - Order Modal",
        }),
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting lead:", error);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeframeOptions = [
    "مستعجل (أقل من أسبوع)",
    "من أسبوع إلى أسبوعين",
    "من أسبوعين إلى شهر",
    "مرن / حسب خطة العمل",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0E1118] border border-af-yellow/40 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 p-2 rounded-xl bg-white/5 border border-white/10 text-af-gray hover:text-white transition-colors z-20"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* عنوان وتجهيز الطلب */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-af-yellow bg-af-yellow/10 px-3 py-1 rounded-full border border-af-yellow/30 w-fit mb-3">
              {isCourse ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>COURSE ENROLLMENT // AF ACADEMY</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PROJECT KICKOFF // CONFIRM SCOPE</span>
                </>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
              {isCourse ? "تأكيد حجز مقعدك في: " : "تأكيد بيانات المشروع: "}
              <span className="text-af-yellow">{orderData.packageName}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-5 leading-relaxed">
              {isCourse
                ? "سجل بياناتك وسيتم التواصل معك مباشرة لتأكيد المقعد وتفاصيل بدء التدريب."
                : "يرجى ملء كافة البيانات المطلوبة ليقوم الخبير المختص بتجهيز العرض الفني ونطاق العمل المخصص لك."}
            </p>

            {/* ملخص الباقة أو الكورس المحدد مسبقاً */}
            <div className="bg-[#06080E] p-4 rounded-2xl border border-white/10 mb-6 text-xs space-y-2">
              <div className="flex justify-between items-center text-gray-200">
                <span className="text-af-muted">{isCourse ? "الكورس المختار:" : "الخدمة المختارة:"}</span>
                <span className="font-bold text-white">{orderData.packageName}</span>
              </div>
              {orderData.estimatedPrice && (
                <div className="flex justify-between items-center text-gray-200 pt-1 border-t border-white/5">
                  <span className="text-af-muted">{isCourse ? "سعر الكورس بالعرض:" : "التكلفة التقديرية:"}</span>
                  <span className="font-bold text-af-yellow font-mono">
                    {orderData.estimatedPrice}
                  </span>
                </div>
              )}
              {isCourse && (
                <div className="flex justify-between items-center text-gray-200 pt-1 border-t border-white/5">
                  <span className="text-af-muted">شروط العرض:</span>
                  <span className="font-bold text-emerald-400">
                    للطلاب وحديثي التخرج وحتى اكتمال المقاعد
                  </span>
                </div>
              )}
            </div>

            {/* نموذج الإدخال */}
            <form onSubmit={handleSubmit} className="space-y-4 text-right">
              {/* الصف الأول: الاسم ورقم الهاتف */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-af-yellow" />
                    <span>الاسم بالكامل</span>
                    <span className="text-af-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="مثال: أحمد محمد"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-white text-sm focus:outline-none focus:border-af-yellow transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-af-yellow" />
                    <span>رقم الهاتف أو WhatsApp</span>
                    <span className="text-af-yellow">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-white text-sm focus:outline-none focus:border-af-yellow transition-colors font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              {isCourse ? (
                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-af-yellow" />
                    <span>الحالة الدراسية (للاستفادة من خصم العرض)</span>
                    <span className="text-af-yellow">*</span>
                  </label>
                  <select
                    value={studentStatus}
                    onChange={(e) => setStudentStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-white text-sm focus:outline-none focus:border-af-yellow transition-colors"
                  >
                    <option value="طالب جامعي" className="bg-[#0E1118]">طالب جامعي</option>
                    <option value="حديث تخرج" className="bg-[#0E1118]">حديث تخرج</option>
                    <option value="باحث عن تطوير مهاراته المهنية" className="bg-[#0E1118]">باحث عن تطوير مهاراته المهنية</option>
                  </select>
                </div>
              ) : (
                <>
                  {/* الصف الثاني للشركات: اسم البراند أو الشركة ومجال العمل */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-200 mb-1.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-af-yellow" />
                        <span>اسم البراند أو الشركة</span>
                        <span className="text-af-yellow">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-white text-sm focus:outline-none focus:border-af-yellow transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-200 mb-1.5 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-af-yellow" />
                        <span>المجال</span>
                        <span className="text-af-yellow">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={businessField}
                        onChange={(e) => setBusinessField(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-white text-sm focus:outline-none focus:border-af-yellow transition-colors"
                      />
                    </div>
                  </div>

                  {/* الصف الثالث للشركات: وقت تسليم المشروع والميزانية */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-200 mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-af-yellow" />
                        <span>وقت تسليم المشروع</span>
                        <span className="text-af-yellow">*</span>
                      </label>
                      <select
                        required
                        value={deliveryTimeframe}
                        onChange={(e) => setDeliveryTimeframe(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-white text-sm focus:outline-none focus:border-af-yellow transition-colors"
                      >
                        {timeframeOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#0E1118] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-200 mb-1.5 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-af-yellow" />
                        <span>الميزانية التي لا ترغب بتخطيها</span>
                        <span className="text-af-yellow">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-white text-sm focus:outline-none focus:border-af-yellow transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ملاحظات أو متطلبات خاصة إضافية - اختيارية */}
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1.5 flex items-center gap-1.5">
                  <span>ملاحظات أو تفاصيل إضافية (اختياري)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-white text-sm focus:outline-none focus:border-af-yellow transition-colors resize-none"
                />
              </div>

              {/* زر الإرسال */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-yellow-glow transition-all active:scale-98 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جارٍ إرسال الطلب...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال الطلب</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* واجهة استلام الطلب ومراجعة وتعديل البيانات */
          <div className="py-2 text-right space-y-5 animate-in zoom-in-95 duration-200">
            {/* الشارة الترحيبية ورسالة التأكيد الأساسية المطلوبة */}
            <div className="text-center space-y-3 pb-2 border-b border-white/10">
              <div className="w-14 h-14 rounded-full bg-af-yellow/15 text-af-yellow border border-af-yellow/30 flex items-center justify-center mx-auto shadow-yellow-glow">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-af-yellow bg-af-yellow/10 px-3 py-0.5 rounded-full border border-af-yellow/30">
                <Sparkles className="w-3 h-3" />
                <span>ORDER RECEIVED // تم استلام الطلب بنجاح</span>
              </div>

              {/* النص المخصص المطلوب حرفياً */}
              <div className="bg-[#121622] border border-af-yellow/30 p-4 rounded-2xl shadow-md">
                <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  سوف يتم التواصل معك في أقرب وقت من خلال خبير في مجال عملك لتقديم أفضل قيمة وتحقيق أعلى عائد لك.
                </p>
              </div>
            </div>

            {/* بطاقة تفاصيل الخدمات والبيانات المدخلة بالكامل */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-af-muted font-mono">
                <span className="flex items-center gap-1.5 font-bold text-af-yellow">
                  <Layers className="w-3.5 h-3.5" />
                  <span>تفاصيل طلبك ومخرجات المشروع:</span>
                </span>
                <span>بيانات مسجلة</span>
              </div>

              <div className="bg-[#06080E] p-4 rounded-2xl border border-white/10 space-y-2.5 text-xs text-gray-200">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-af-muted">الخدمة والباقة:</span>
                  <span className="font-bold text-white">
                    {orderData.serviceTitle} - <span className="text-af-yellow">{orderData.packageName}</span>
                  </span>
                </div>

                {orderData.estimatedPrice && (
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-af-muted">التكلفة التقديرية:</span>
                    <span className="font-bold text-af-yellow font-mono">
                      {orderData.estimatedPrice}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-white/5">
                  <div>
                    <span className="text-af-muted block">الاسم:</span>
                    <span className="font-medium text-white">{clientName}</span>
                  </div>
                  <div>
                    <span className="text-af-muted block">رقم الهاتف:</span>
                    <span className="font-mono text-white" dir="ltr">{phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-white/5">
                  <div>
                    <span className="text-af-muted block">اسم البراند أو الشركة:</span>
                    <span className="font-medium text-white">{brandName}</span>
                  </div>
                  <div>
                    <span className="text-af-muted block">مجال العمل والنشاط:</span>
                    <span className="font-medium text-white">{businessField}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-af-muted block">وقت التسليم المطلوب:</span>
                    <span className="font-medium text-af-yellow">{deliveryTimeframe}</span>
                  </div>
                  <div>
                    <span className="text-af-muted block">الميزانية المحددة:</span>
                    <span className="font-medium text-af-yellow">
                      {maxBudget}
                    </span>
                  </div>
                </div>

                {notes && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-af-muted block">ملاحظاتك الإضافية:</span>
                    <p className="text-gray-300 mt-0.5">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* أزرار الإجراءات: زر التعديل وزر الواتساب المباشر */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* زر التعديل المطلوب */}
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-af-yellow/40 text-gray-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Edit3 className="w-4 h-4 text-af-yellow" />
                  <span>تعديل تفاصيل الطلب</span>
                </button>

                {/* زر المحادثة الفورية عبر واتساب */}
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>متابعة عبر WhatsApp الآن</span>
                </a>
              </div>

              {/* زر إنهاء وإغلاق */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs text-af-muted hover:text-white transition-colors block text-center"
              >
                إغلاق النافذة والعودة للموقع
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
