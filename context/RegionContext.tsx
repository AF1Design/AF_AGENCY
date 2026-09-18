"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CountryCode, RegionCurrency } from "@/types";

interface RegionContextType {
  country: CountryCode;
  currency: RegionCurrency;
  phone: string;
  isAdmin: boolean;
  isGateOpen: boolean;
  setRegion: (country: CountryCode, userPhone?: string) => void;
  toggleCurrency: () => void;
  openGate: () => void;
  closeGate: () => void;
  logout: () => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState<CountryCode>("EG");
  const [currency, setCurrency] = useState<RegionCurrency>("EGP");
  const [phone, setPhone] = useState<string>("");
  const [isGateOpen, setIsGateOpen] = useState(false);

  useEffect(() => {
    const savedCountry = localStorage.getItem("af_country") as CountryCode | null;
    const savedCurrency = localStorage.getItem("af_currency") as RegionCurrency | null;
    const savedPhone = localStorage.getItem("af_phone") || "";
    const gatePassed = localStorage.getItem("af_gate_passed");

    if (savedCountry && (savedCountry === "EG" || savedCountry === "GULF")) {
      setCountry(savedCountry);
      setCurrency(savedCurrency || (savedCountry === "EG" ? "EGP" : "SAR"));
    }

    if (savedPhone && savedPhone.trim().length >= 8) {
      setPhone(savedPhone);
      setIsGateOpen(false);
    } else {
      // إذا لم يكن هناك رقم هاتف مسجل أو سليم، تفتح نافذة الاختيار الإلزامية فوراً
      setIsGateOpen(true);
    }
  }, []);

  const setRegion = (newCountry: CountryCode, userPhone?: string) => {
    const newCurrency: RegionCurrency = newCountry === "EG" ? "EGP" : "SAR";
    setCountry(newCountry);
    setCurrency(newCurrency);
    if (userPhone) {
      setPhone(userPhone);
      localStorage.setItem("af_phone", userPhone);
    }
    localStorage.setItem("af_country", newCountry);
    localStorage.setItem("af_currency", newCurrency);
    localStorage.setItem("af_gate_passed", "true");
    setIsGateOpen(false);

    // تسجيل فوري لبيانات العميل في قاعدة البيانات لضمان عدم ضياع أي ليد من الإعلانات
    if (userPhone && userPhone.trim()) {
      try {
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: "زائر استكشاف أسعار",
            phone: userPhone.trim(),
            country: newCountry === "EG" ? "مصر" : "الخليج العربي",
            currency: newCurrency,
            serviceCategory: "web",
            selectedPackage: "استعراض باقات الويب",
            selectedAddons: [],
            adSource: "بوابة تحديد الدولة والأسعار (Welcome Gate)",
          }),
        }).catch(() => {});
      } catch (err) {
        // Ignore error
      }
    }
  };

  const toggleCurrency = () => {
    const nextCountry: CountryCode = country === "EG" ? "GULF" : "EG";
    const nextCurrency: RegionCurrency = nextCountry === "EG" ? "EGP" : "SAR";
    setCountry(nextCountry);
    setCurrency(nextCurrency);
    localStorage.setItem("af_country", nextCountry);
    localStorage.setItem("af_currency", nextCurrency);
  };

  const ADMIN_PHONE = "011111111112";
  const isAdmin = phone.replace(/[^0-9]/g, "") === ADMIN_PHONE;

  const logout = () => {
    setPhone("");
    localStorage.removeItem("af_phone");
    localStorage.removeItem("af_gate_passed");
    setIsGateOpen(true);
  };

  const openGate = () => setIsGateOpen(true);
  const closeGate = () => {
    localStorage.setItem("af_gate_passed", "true");
    setIsGateOpen(false);
  };

  return (
    <RegionContext.Provider
      value={{
        country,
        currency,
        phone,
        isAdmin,
        isGateOpen,
        setRegion,
        toggleCurrency,
        openGate,
        closeGate,
        logout,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}
