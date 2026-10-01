"use client";

import React from "react";
import { RegionProvider } from "@/context/RegionContext";
import WelcomeGateModal from "@/components/WelcomeGateModal";
import MetaPixel from "@/components/MetaPixel";
import MobileBottomDock from "@/components/MobileBottomDock";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RegionProvider>
      <MetaPixel />
      <WelcomeGateModal />
      <MobileBottomDock />
      {children}
    </RegionProvider>
  );
}
