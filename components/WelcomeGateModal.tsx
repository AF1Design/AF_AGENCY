"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegion } from "@/context/RegionContext";
import { CountryCode } from "@/types";
import { Sparkles, ArrowLeft, Phone, CheckCircle2, Server, ShieldCheck, Loader2 } from "lucide-react";

export default function WelcomeGateModal() {
  const { isGateOpen, setRegion } = useRegion();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("EG");
  const [inputPhone, setInputPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isGateOpen) return null;

  const validatePhone = (phoneStr: string, country: CountryCode) => {
    const cleaned = phoneStr.replace(/\s+/g, "");
    if (!cleaned) return "يرجى إدخال رقم الهاتف للمتابعة.";

    // رقم هاتف الأدمن معتمد ومقبول دائماً
    if (cleaned === "011111111112") {
      return "";
    }
    
    if (country === "EG") {
      // الأرقام المصرية تبدأ بـ 01 وتتكون من 11 رقماً
      if (!/^(01)[0-2,5]{1}[0-9]{8}$/.test(cleaned) && cleaned.length < 10) {
        return "يرجى إدخال رقم هاتف مصري صحيح مكون من 11 رقماً يبدأ بـ 01";
      }
    } else {
      // أرقام الخليج تبدأ عادة بـ 5 وتتراوح بين 8 إلى 10 أرقام
      if (cleaned.length < 8 || cleaned.length > 12) {
        return "يرجى إدخال رقم هاتف خليجي صحيح.";
      }
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validatePhone(inputPhone, selectedCountry);
    if (errorMsg) {
      setPhoneError(errorMsg);
      return;
    }

    setPhoneError("");
    setIsSubmitting(true);

    try {
      // إرسال الليد فوراً للوحة التحكم وقاعدة البيانات
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "تسجيل دخول جديد (بوابة البنية التحتية)",
          phone: inputPhone.trim(),
          country: selectedCountry === "EG" ? "مصر" : "الخليج العربي",
          currency: selectedCountry === "EG" ? "EGP" : "SAR",
          serviceCategory: "web",
          selectedPackage: "بوابة تحديد النطاق والسيرفرات",
          selectedAddons: [],
          clientNotes: `عميل سجل من بوابة النطاق الجغرافي: [${selectedCountry === "EG" ? "خوادم مصر" : "خوادم الخليج الدولي"}]`,
          leadType: "registration",
          adSource: "بوابة الدخول الرئيسية (Welcome Gate)",
        }),
      });
    } catch (err) {
      // Continue even if network error so user isn't stuck
    }

    setRegion(selectedCountry, inputPhone.trim());
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-[#0E1118] border border-af-yellow/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* هالة خلفية ناعمة */}
          <div className="ambient-orb w-[300px] h-[300px] bg-af-yellow/10 top-0 left-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 text-center">
            {/* بادج الترحيب الأمني */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-af-yellow bg-af-yellow/10 px-3.5 py-1.5 rounded-full border border-af-yellow/30 mb-4 shadow-yellow-glow-sm">
              <Server className="w-3.5 h-3.5" />
              <span>AF AGENCY // تهيئة الخوادم السحابية للمشروع</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2.5 leading-snug">
              حدد دولتك لربط سيرفرات موقعك
              <span className="block text-af-yellow text-lg sm:text-2xl mt-1">واستعراض باقات المشروع المخصصة</span>
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-md mx-auto">
              يجب تحديد دولة نشاطك الفعلي لربط موقعك بالسيرفرات السحابية وبوابات الدفع الخاصة ببلدك، لضمان أقصى سرعة تشغيل واستقرار لمشروعك وتفادي أي تعارض تقني.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 text-right">
              {/* اختيار نطاق السيرفرات والخدمة */}
              <div>
                <label className="block text-xs font-mono font-bold text-af-yellow uppercase mb-2">
                  دولة النشاط وسيرفرات الموقع:
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {/* نطاق مصر */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCountry("EG");
                      setPhoneError("");
                    }}
                    className={`p-4 rounded-2xl border text-right transition-all flex items-start justify-between gap-3 ${
                      selectedCountry === "EG"
                        ? "bg-af-yellow/15 border-af-yellow text-white shadow-yellow-glow-sm ring-1 ring-af-yellow"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2 mb-1">
                        <span>🇪🇬</span>
                        <span>جمهورية مصر العربية</span>
                        <span className="text-[10px] font-mono text-af-yellow bg-af-yellow/20 px-2 py-0.5 rounded-full border border-af-yellow/30">
                          خوادم مصر
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed">
                        ربط سيرفرات القاهرة السحابية وتفعيل بوابات الدفع الإلكتروني المعتمدة داخل السوق المصري.
                      </p>
                    </div>
                    {selectedCountry === "EG" && (
                      <CheckCircle2 className="w-5 h-5 text-af-yellow shrink-0 mt-0.5" />
                    )}
                  </button>

                  {/* نطاق الخليج */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCountry("GULF");
                      setPhoneError("");
                    }}
                    className={`p-4 rounded-2xl border text-right transition-all flex items-start justify-between gap-3 ${
                      selectedCountry === "GULF"
                        ? "bg-af-yellow/15 border-af-yellow text-white shadow-yellow-glow-sm ring-1 ring-af-yellow"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2 mb-1">
                        <span>🇸🇦</span>
                        <span>المملكة العربية السعودية ودول الخليج</span>
                        <span className="text-[10px] font-mono text-af-yellow bg-af-yellow/20 px-2 py-0.5 rounded-full border border-af-yellow/30">
                          خوادم الخليج
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed">
                        ربط سيرفرات الخليج السحابية وتفعيل بوابات الدفع الإلكتروني المعتمدة في دول الخليج.
                      </p>
                    </div>
                    {selectedCountry === "GULF" && (
                      <CheckCircle2 className="w-5 h-5 text-af-yellow shrink-0 mt-0.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* إدخال رقم الهاتف الإلزامي */}
              <div>
                <label className="block text-xs font-mono font-bold text-af-yellow uppercase mb-2">
                  رقم الهاتف أو الواتساب للتواصل والتحقق:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-af-muted text-xs font-mono font-bold">
                    {selectedCountry === "EG" ? "+20" : "+966"}
                  </div>
                  <input
                    type="tel"
                    dir="ltr"
                    value={inputPhone}
                    onChange={(e) => {
                      setInputPhone(e.target.value);
                      if (phoneError) setPhoneError("");
                    }}
                    placeholder={selectedCountry === "EG" ? "010XXXXXXXX" : "5XXXXXXXX"}
                    className={`w-full bg-[#060709] border rounded-2xl px-4 py-3.5 pl-14 text-white text-sm font-mono text-right focus:outline-none focus:ring-1 focus:ring-af-yellow transition-all ${
                      phoneError
                        ? "border-red-500/80 ring-1 ring-red-500"
                        : "border-white/10 focus:border-af-yellow"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-af-gray">
                    <Phone className="w-4 h-4 text-af-muted" />
                  </div>
                </div>
                {phoneError && (
                  <p className="text-red-400 text-xs mt-1.5 mr-1 font-semibold">
                    {phoneError}
                  </p>
                )}
              </div>

              {/* زر التأكيد والدخول - إلزامي */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-af-yellow hover:bg-af-yellow-hover disabled:opacity-70 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-yellow-glow-lg transition-all active:scale-98 group"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>تأكيد البيانات واستعراض باقات المشروع</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-center text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-af-yellow shrink-0" />
                <span>بياناتك مشفرة ومحمية بأعلى معايير الأمان والخصوصية.</span>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
