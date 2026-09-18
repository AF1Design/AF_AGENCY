"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, Menu, X, Sparkles, ChevronLeft, ArrowUpRight, Shield, LogOut, User } from "lucide-react";
import { useRegion } from "@/context/RegionContext";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.57-.06 2.89-1.17 3.2-2.69.11-.53.15-1.07.14-1.61V.02h-.01z" />
    </svg>
  );
}

interface NavbarProps {
  onOpenConfigurator: () => void;
}

export default function Navbar({ onOpenConfigurator }: NavbarProps) {
  const { phone, isAdmin, logout } = useRegion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const whatsappNumber = "201114687759";
  const facebookUrl = "https://www.facebook.com/AF.design.2";
  const instagramUrl = "https://www.instagram.com/af_design.1?stkn=YXB1czAyb2U5NGtr&utm_source=qr";
  const tiktokUrl = "https://www.tiktok.com/@af_design1?_r=1&_t=ZS-99phbHZatQw";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#060709]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* اللوجو مع تأثير هوفر ثلاثي الأبعاد خفيف */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-32 sm:w-44 h-10 sm:h-12 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo-transparent.png"
              alt="AF AGENCY Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </a>

        {/* الروابط لنسخة الكمبيوتر بالترقيم البرمجي المعاصر */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-af-gray">
          <button
            onClick={() => scrollToSection("assurance")}
            className="hover:text-af-yellow transition-colors flex items-center gap-1.5"
          >
            <span className="text-[10px] text-af-yellow/70 font-mono">[ 01 ]</span>
            <span>Assurance</span>
          </button>
          <button
            onClick={() => scrollToSection("configurator")}
            className="hover:text-af-yellow transition-colors flex items-center gap-1.5"
          >
            <span className="text-[10px] text-af-yellow/70 font-mono">[ 02 ]</span>
            <span>Services</span>
          </button>
          <button
            onClick={() => scrollToSection("courses")}
            className="hover:text-af-yellow transition-colors flex items-center gap-1.5"
          >
            <span className="text-[10px] text-af-yellow/70 font-mono">[ 03 ]</span>
            <span>Academy & AI</span>
            <span className="text-[9px] bg-af-yellow/20 text-af-yellow border border-af-yellow/40 px-1.5 py-0.2 rounded font-mono font-bold">
              HOT
            </span>
          </button>
          <button
            onClick={() => scrollToSection("portfolio")}
            className="hover:text-af-yellow transition-colors flex items-center gap-1.5"
          >
            <span className="text-[10px] text-af-yellow/70 font-mono">[ 04 ]</span>
            <span>Case Studies</span>
          </button>
          <button
            onClick={() => scrollToSection("why-us")}
            className="hover:text-af-yellow transition-colors flex items-center gap-1.5"
          >
            <span className="text-[10px] text-af-yellow/70 font-mono">[ 05 ]</span>
            <span>Why AF</span>
          </button>
        </div>

        {/* أزرار السوشيال ميديا وأزرار التحويل */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* أيقونات السوشيال ميديا للكمبيوتر */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-white/10">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-af-card border border-white/5 text-af-gray hover:text-white hover:bg-[#1877F2]/20 hover:border-[#1877F2]/50 transition-all"
              title="Facebook Profile"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-af-card border border-white/5 text-af-gray hover:text-white hover:bg-pink-500/20 hover:border-pink-500/50 transition-all"
              title="Instagram Account"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-af-card border border-white/5 text-af-gray hover:text-white hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all"
              title="TikTok Channel"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* زر واتساب السريع المباشر */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello AF AGENCY, I would like to inquire about your services.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all shadow-sm"
            title="Direct WhatsApp"
          >
            <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>

          {/* زر لوحة تحكم الإدارة (يظهر فقط وحصرياً لحساب الأدمن) */}
          {isAdmin && (
            <a
              href="/admin"
              className="px-3 py-2 rounded-xl bg-af-yellow text-black font-extrabold text-xs flex items-center gap-1.5 shadow-yellow-glow hover:bg-af-yellow-hover transition-all active:scale-95"
              title="لوحة تحكم الإدارة"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>لوحة التحكم</span>
            </a>
          )}

          {/* زر صمم باقتك الرئيسي البارز */}
          <button
            onClick={onOpenConfigurator}
            className="relative group overflow-hidden px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-af-yellow hover:bg-af-yellow-hover text-af-dark font-extrabold text-xs flex items-center gap-1.5 shadow-yellow-glow transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>START A PROJECT</span>
          </button>

          {/* زر تسجيل الخروج وتبديل الحساب للكمبيوتر */}
          {phone && (
            <button
              onClick={logout}
              className="hidden sm:flex p-2 sm:px-2.5 sm:py-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 text-xs font-mono items-center gap-1 transition-colors"
              title="تسجيل خروج أو تبديل الحساب"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">خروج</span>
            </button>
          )}

          {/* زر القائمة للموبايل */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-af-card border border-white/10 text-af-light hover:text-af-yellow"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل المنبثقة الغنية بحسابات التواصل */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0D12]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          {/* رابط الإدارة في الموبايل */}
          {isAdmin && (
            <a
              href="/admin"
              className="w-full py-2.5 px-4 rounded-xl bg-af-yellow text-black font-bold text-xs flex items-center justify-between shadow-yellow-glow"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>لوحة تحكم إدارة الطلبات</span>
              </div>
              <span className="text-[10px] font-mono bg-black text-af-yellow px-2 py-0.5 rounded-full font-bold">
                ADMIN
              </span>
            </a>
          )}

          {/* زر تسجيل الخروج في الموبايل */}
          {phone && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>تسجيل خروج / تبديل رقم الهاتف</span>
              </div>
              <span className="text-[10px] font-mono opacity-75">{phone}</span>
            </button>
          )}
          <button
            onClick={() => scrollToSection("assurance")}
            className="w-full text-right py-2 text-sm font-bold text-af-light hover:text-af-yellow flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-af-yellow font-mono">[ 01 ]</span>
              <span>Zero-Risk Trust // ميثاق الثقة والأمان</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-af-muted" />
          </button>
          <button
            onClick={() => scrollToSection("configurator")}
            className="w-full text-right py-2 text-sm font-bold text-af-light hover:text-af-yellow flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-af-yellow font-mono">[ 02 ]</span>
              <span>Services & Configurator // باقات الخدمات</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-af-muted" />
          </button>
          <button
            onClick={() => scrollToSection("courses")}
            className="w-full text-right py-2 text-sm font-bold text-af-light hover:text-af-yellow flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-af-yellow font-mono">[ 03 ]</span>
              <span>Academy & AI // أكاديمية الكورسات</span>
            </div>
            <span className="text-[10px] bg-af-yellow text-af-dark px-2 py-0.5 rounded font-black">
              HOT
            </span>
          </button>
          <button
            onClick={() => scrollToSection("portfolio")}
            className="w-full text-right py-2 text-sm font-bold text-af-light hover:text-af-yellow flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-af-yellow font-mono">[ 04 ]</span>
              <span>Case Studies // سابقة الأعمال</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-af-muted" />
          </button>
          <button
            onClick={() => scrollToSection("why-us")}
            className="w-full text-right py-2 text-sm font-bold text-af-light hover:text-af-yellow flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-af-yellow font-mono">[ 05 ]</span>
              <span>Why Choose Us // لماذا نحن؟</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-af-muted" />
          </button>

          {/* روابط التواصل في الموبايل */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <span className="text-xs text-af-gray font-semibold block">Official Channels:</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-af-card border border-white/5 text-xs text-af-light flex items-center justify-center gap-1.5 hover:border-[#1877F2]/50"
              >
                <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
                <span className="text-[11px]">Facebook</span>
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-af-card border border-white/5 text-xs text-af-light flex items-center justify-center gap-1.5 hover:border-pink-500/50"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span className="text-[11px]">Instagram</span>
              </a>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-af-card border border-white/5 text-xs text-af-light flex items-center justify-center gap-1.5 hover:border-cyan-400/50"
              >
                <TikTokIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px]">TikTok</span>
              </a>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello AF AGENCY, I would like to inquire about your services.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-500 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct // 01114687759</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
