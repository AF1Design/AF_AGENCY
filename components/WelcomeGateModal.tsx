"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegion } from "@/context/RegionContext";
import { X, Phone, User, CheckCircle2, ShieldCheck, Loader2, Sparkles, Send } from "lucide-react";
import { validateRealPhone, validateRealName } from "@/lib/leadUtils";

export default function WelcomeGateModal() {
  const { isGateOpen, closeGate, setRegion } = useRegion();
  const [isVisible, setIsVisible] = useState(false);
  const [inputName, setInputName] = useState("");
  const [nameError, setNameError] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // إظهار البطاقة الجانبية بعد 10 ثوانٍ من التصفح إذا لم يسجل العميل أو يلغِ البطاقة مسبقاً
  useEffect(() => {
    // إذا فُتحت البوابة يدوياً (مثلاً من زر تسجيل دخول الأدمن)
    if (isGateOpen) {
      setIsVisible(true);
      return;
    }

    if (typeof window === "undefined") return;

    const alreadyDismissed = sessionStorage.getItem("af_lead_card_dismissed");
    const savedPhone = localStorage.getItem("af_phone");

    // إذا سجل العميل رقمه مسبقاً أو ألغى البطاقة في هذه الجلسة، لا تظهر تلقائياً
    if (alreadyDismissed === "true" || (savedPhone && savedPhone.trim().length >= 8)) {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000); // 10 ثوانٍ

    return () => clearTimeout(timer);
  }, [isGateOpen]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("af_lead_card_dismissed", "true");
    }
    closeGate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nErr = validateRealName(inputName);
    const pErr = validateRealPhone(inputPhone, "EG");

    if (nErr) setNameError(nErr);
    if (pErr) setPhoneError(pErr);

    if (nErr || pErr) {
      return;
    }

    setNameError("");
    setPhoneError("");
    setIsSubmitting(true);

    const cleanName = inputName.trim();
    const cleanPhone = inputPhone.trim();

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: cleanName,
          phone: cleanPhone,
          country: "مصر",
          currency: "EGP",
          serviceCategory: "web",
          selectedPackage: "نموذج التواصل السريع والخصومات",
          selectedAddons: [],
          clientNotes: `تسجيل عميل جديد من البطاقة الجانبية السريعة: [الاسم: ${cleanName}] - [الهاتف: ${cleanPhone}]`,
          leadType: "registration",
          adSource: "البطاقة الجانبية للتواصل (Slide Card)",
        }),
      });
    } catch (err) {
      // الاستمرار في الحفظ المحلي حتى مع ضعف الاتصال
    }

    setRegion("EG", cleanPhone, cleanName);
    setIsSubmitting(false);
    setIsSuccess(true);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("af_lead_card_dismissed", "true");
    }

    // إغلاق البطاقة بعد ثانية ونصف من نجاح الحفظ
    setTimeout(() => {
      setIsVisible(false);
      closeGate();
    }, 1600);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 sm:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:max-w-sm w-auto bg-[#0E1118]/95 border border-af-yellow/40 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-right"
        >
          {/* هالة خلفية ناعمة */}
          <div className="ambient-orb w-48 h-48 bg-af-yellow/10 top-0 right-0 pointer-events-none" />

          {/* الرأس: شارة وزر الإلغاء */}
          <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-af-yellow/10 border border-af-yellow/30 text-af-yellow text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>تواصل مباشر واستشارة مجانية</span>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="إلغاء وإغلاق"
              aria-label="إلغاء وإغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* محتوى النجاح عند الحفظ */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-2 relative z-10"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">تم حفظ بياناتك بنجاح</h4>
              <p className="text-xs text-gray-400">
                أهلاً بك، يمكنك الآن تصفح كافة باقات المشاريع والكورسات بحرية كاملة.
              </p>
            </motion.div>
          ) : (
            <div className="relative z-10">
              <h3 className="text-base font-black text-white mb-1">
                سجل بياناتك لاستلام تفاصيل العروض
              </h3>
              <p className="text-[12px] text-gray-300 leading-relaxed mb-4">
                اكتب اسمك ورقم هاتفك لنرسل لك عروض الأسعار والتفاصيل المناسبة مباشرة عبر الواتساب.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* حقل الاسم */}
                <div>
                  <label className="block text-[11px] font-bold text-af-yellow mb-1">
                    الاسم بالكامل:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => {
                        setInputName(e.target.value);
                        if (nameError) setNameError("");
                      }}
                      placeholder="مثال: محمد أحمد"
                      className={`w-full bg-[#060709] border rounded-xl px-3 py-2.5 pr-9 text-white text-xs text-right focus:outline-none focus:ring-1 focus:ring-af-yellow transition-all ${
                        nameError
                          ? "border-red-500/80 ring-1 ring-red-500"
                          : "border-white/10 focus:border-af-yellow"
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-af-yellow">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  {nameError && (
                    <p className="text-red-400 text-[10px] mt-1 mr-1 font-semibold">{nameError}</p>
                  )}
                </div>

                {/* حقل رقم الهاتف */}
                <div>
                  <label className="block text-[11px] font-bold text-af-yellow mb-1">
                    رقم الهاتف أو الواتساب:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs font-mono font-bold">
                      +20
                    </div>
                    <input
                      type="tel"
                      dir="ltr"
                      value={inputPhone}
                      onChange={(e) => {
                        setInputPhone(e.target.value);
                        if (phoneError) setPhoneError("");
                      }}
                      placeholder="010XXXXXXXX"
                      className={`w-full bg-[#060709] border rounded-xl px-3 py-2.5 pl-12 text-white text-xs font-mono text-right focus:outline-none focus:ring-1 focus:ring-af-yellow transition-all ${
                        phoneError
                          ? "border-red-500/80 ring-1 ring-red-500"
                          : "border-white/10 focus:border-af-yellow"
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-af-yellow">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  {phoneError && (
                    <p className="text-red-400 text-[10px] mt-1 mr-1 font-semibold">{phoneError}</p>
                  )}
                </div>

                {/* أزرار الإجراء: حفظ وإلغاء */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover disabled:opacity-70 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-yellow-glow transition-all active:scale-98"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 rotate-180" />
                        <span>حفظ البيانات</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    إلغاء
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-center text-[10px] text-gray-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-af-yellow shrink-0" />
                  <span>بياناتك محمية ولن نرسل لك أي رسائل مزعجة.</span>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
