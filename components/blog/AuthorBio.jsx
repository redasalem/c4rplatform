"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Verified, ArrowBackIosNew } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const AuthorBio = () => {
  const { i18n } = useTranslation("common");
  const isRtl = i18n.dir() === "rtl";

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 mt-16 relative overflow-hidden group">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
        <div className="relative shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-slate-800 border-2 border-white/10 relative">
            <Image 
              src="/images/logo.jpeg" 
              alt="C4R Automotive Experts" 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-white w-8 h-8 rounded-xl flex items-center justify-center border-4 border-midnight shadow-lg">
            <Verified sx={{ fontSize: 16 }} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-right">
          <h4 className="text-xl md:text-2xl font-black text-white mb-3">
             {i18n.language === "ar" ? "خبراء C4R للسيارات" : "C4R Automotive Experts"}
          </h4>
          <p className="text-slate-400 font-bold leading-relaxed mb-6 max-w-2xl">
            {i18n.language === "ar" 
              ? "فريق متخصص في تحليل سوق السيارات السعودي، نسعى لتقديم أدق المعلومات والنصائح حول استئجار وامتلاك السيارات لمساعدتك في اتخاذ القرار الأفضل."
              : "A specialized team in analyzing the Saudi car market, we strive to provide the most accurate information and advice on renting and owning cars to help you make the best decision."
            }
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Link 
              href="/about" 
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm font-black border border-white/5 transition-all flex items-center gap-2"
            >
              {i18n.language === "ar" ? "تعرف علينا أكثر" : "Learn more about us"}
              <ArrowBackIosNew sx={{ fontSize: 12, transform: isRtl ? "rotate(0deg)" : "rotate(180deg)" }} />
            </Link>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                {i18n.language === "ar" ? "جهة موثوقة" : "Trusted Source"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
