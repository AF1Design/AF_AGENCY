"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CountryCode, RegionCurrency, PortalMode } from "@/types";

interface RegionContextType {
  country: CountryCode;
  currency: RegionCurrency;
  phone: string;
  clientName: string;
  isAdmin: boolean;
  isGateOpen: boolean;
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  togglePortalMode: () => void;
  setRegion: (country: CountryCode, userPhone?: string, userName?: string) => void;
  setClientName: (name: string) => void;
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
  const [clientName, setClientName] = useState<string>("");
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [portalMode, setPortalModeState] = useState<PortalMode>("agency");

  useEffect(() => {
    const savedCountry = localStorage.getItem("af_country") as CountryCode | null;
    const savedCurrency = localStorage.getItem("af_currency") as RegionCurrency | null;
    const savedPhone = localStorage.getItem("af_phone") || "";
    const savedName = localStorage.getItem("af_client_name") || "";
    const gatePassed = localStorage.getItem("af_gate_passed");

    if (savedCountry && (savedCountry === "EG" || savedCountry === "GULF")) {
      setCountry(savedCountry);
      setCurrency(savedCurrency || (savedCountry === "EG" ? "EGP" : "SAR"));
    }

    if (savedName) {
      setClientName(savedName);
    }

    // إلزامي صارم: لا يمكن فتح الموقع والتصفح إلا إذا كان العميل مسجلاً اسمه ورقم هاتفه مع اجتياز البوابة
    if (
      savedPhone &&
      savedPhone.trim().length >= 8 &&
      savedName &&
      savedName.trim().length >= 2 &&
      gatePassed === "true"
    ) {
      setPhone(savedPhone);
      setClientName(savedName);
      setIsGateOpen(false);
    } else {
      setIsGateOpen(true);
    }

    // فحص وضع التصفح المطلوب عبر معلمات الرابط أو التخزين المحلي
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const modeParam = urlParams.get("mode") || urlParams.get("tab") || urlParams.get("portal");
      if (modeParam === "academy" || modeParam === "agency") {
        setPortalModeState(modeParam as PortalMode);
        localStorage.setItem("af_portal_mode", modeParam);
      } else {
        const savedMode = localStorage.getItem("af_portal_mode") as PortalMode | null;
        if (savedMode === "agency" || savedMode === "academy") {
          setPortalModeState(savedMode);
        }
      }
    }
  }, []);

  const setPortalMode = (mode: PortalMode) => {
    setPortalModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("af_portal_mode", mode);
      const url = new URL(window.location.href);
      if (mode === "academy") {
        url.searchParams.set("mode", "academy");
      } else {
        url.searchParams.delete("mode");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  const togglePortalMode = () => {
    const nextMode: PortalMode = portalMode === "agency" ? "academy" : "agency";
    setPortalMode(nextMode);
  };

  const setRegion = (newCountry: CountryCode, userPhone?: string, userName?: string) => {
    const newCurrency: RegionCurrency = newCountry === "EG" ? "EGP" : "SAR";
    setCountry(newCountry);
    setCurrency(newCurrency);
    if (userName && userName.trim()) {
      setClientName(userName.trim());
      localStorage.setItem("af_client_name", userName.trim());
    }
    if (userPhone && userPhone.trim()) {
      setPhone(userPhone.trim());
      localStorage.setItem("af_phone", userPhone.trim());
    }
    localStorage.setItem("af_country", newCountry);
    localStorage.setItem("af_currency", newCurrency);
    localStorage.setItem("af_gate_passed", "true");
    setIsGateOpen(false);
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
    setClientName("");
    localStorage.removeItem("af_phone");
    localStorage.removeItem("af_client_name");
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
        clientName,
        isAdmin,
        isGateOpen,
        portalMode,
        setPortalMode,
        togglePortalMode,
        setRegion,
        setClientName,
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
