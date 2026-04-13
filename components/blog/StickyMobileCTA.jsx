"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DirectionsCar } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const StickyMobileCTA = () => {
  const { i18n } = useTranslation("common");
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercent = (scrollY / (documentHeight - windowHeight)) * 100;

    // Show after 40% scroll, hide near footer
    const nearFooter = scrollY + windowHeight > documentHeight - 600;
    setIsVisible(scrollPercent > 40 && !nearFooter);
  }, []);

  useEffect(() => {
    let rafId = null;
    const throttledScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  return (
    <div
      className={`fixed bottom-6 left-6 right-6 z-50 transition-all duration-500 transform lg:hidden ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <Link
        href="/cars"
        className="w-full flex items-center justify-between bg-primary hover:bg-orange-600 text-white p-5 rounded-3xl shadow-[0_20px_40px_-10px_rgba(249,115,22,0.6)] font-black transition-all active:scale-95 border border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <DirectionsCar sx={{ fontSize: 20 }} />
          </div>
          <span className="text-sm">
            {i18n.language === "ar" ? "تصفّح السيارات المتاحة الآن" : "Browse available cars now"}
          </span>
        </div>
        <div className="bg-black/20 px-3 py-1 rounded-xl text-[10px] uppercase">
            {i18n.language === "ar" ? "حجز سريع" : "Fast Booking"}
        </div>
      </Link>
    </div>
  );
};

export default StickyMobileCTA;
