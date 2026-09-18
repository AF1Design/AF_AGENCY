"use client";

import React from "react";
import { RegionProvider } from "@/context/RegionContext";
import WelcomeGateModal from "@/components/WelcomeGateModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RegionProvider>
      <WelcomeGateModal />
      {children}
    </RegionProvider>
  );
}
