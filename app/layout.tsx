import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#060709",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://af-agency.vercel.app"),
  title: "AF AGENCY | Turning Your Dreams Into Reality - Digital Experience Studio",
  description: "مؤسسة رقمية متخصصة في تطوير حلول الويب، تصميم الهويات المؤسسية، إدارة الحملات الإعلانية الموجهة بالأداء، وأكاديمية تدريب الجرافيك ديزاين والذكاء الاصطناعي.",
  keywords: [
    "AF AGENCY",
    "تصميم مواقع",
    "Web Development",
    "Branding",
    "هوية بصرية",
    "Digital Marketing",
    "تسويق الكتروني",
    "AI Course",
    "Graphic Design Course",
  ],
  authors: [{ name: "AF AGENCY" }],
  openGraph: {
    title: "AF AGENCY | Turning Your Dreams Into Reality",
    description: "Build high-converting digital experiences with AF AGENCY.",
    siteName: "AF AGENCY",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/images/logo-dark.png",
        width: 800,
        height: 600,
        alt: "AF AGENCY Logo",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://af-agency.vercel.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://af-agency.vercel.app/#organization",
      name: "AF AGENCY & ACADEMY",
      url: "https://af-agency.vercel.app",
      logo: "https://af-agency.vercel.app/images/logo-dark.png",
      description: "مؤسسة رقمية متخصصة في تطوير حلول الويب، تصميم الهويات المؤسسية، إدارة الحملات الإعلانية، وأكاديمية تدريب الجرافيك ديزاين والذكاء الاصطناعي.",
      telephone: "+201114687759",
      sameAs: [
        "https://www.facebook.com/AF.design.2",
        "https://www.instagram.com/af_design.1",
        "https://www.tiktok.com/@af_design1"
      ]
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://af-agency.vercel.app/#academy",
      name: "AF ACADEMY",
      url: "https://af-agency.vercel.app/?mode=academy",
      description: "أكاديمية تدريبية متخصصة في تأهيل الكوادر في الجرافيك ديزاين وصناعة المحتوى الإعلاني بالذكاء الاصطناعي.",
      parentOrganization: {
        "@id": "https://af-agency.vercel.app/#organization"
      }
    }
  ]
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/png" href="/icon.png?v=2" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/icon.png?v=2" />
        {/* استيراد خط كايرو الرئيسي المعتمد وخطوط بلس جاكرتا سانس وساين المساندة عبر جوجل فوتتس */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
        {/* بيانات المخطط الهيكلي لمحركات البحث وجوجل */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#060709] text-[#F3F4F6] antialiased min-h-screen selection:bg-af-yellow selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
