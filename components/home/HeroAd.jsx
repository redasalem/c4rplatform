"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const HeroAd = () => {
  const { t, i18n } = useTranslation("common");

  return (
    <div className="w-full pt-18 md:pt-22 bg-transparent pb-8 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative w-full h-[420px] md:h-[520px] rounded-[3rem] overflow-hidden shadow-2xl group border border-white/5">
          <div className="absolute inset-0">
            <Image
              src="/images/car1.png"
              alt="Luxury Car Fleet"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-10000"
              priority
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-black/35"></div>

          <div
            className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-12 text-white py-8 sm:py-10 md:py-12"
            dir={i18n.dir()}
          >
            <div className="mb-6 md:mb-8 max-w-3xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight md:leading-snug tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                  {t("hero.titlePart1")}
                </span>{" "}
                <br />
                {t("hero.titlePart2")}
              </h1>
              <p className="mt-3 text-sm sm:text-base md:text-lg font-medium text-white/90 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]">
                {t("hero.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 w-full max-w-3xl">
              <Link
                href="/sharqiya"
                className="group/card relative h-12 sm:h-16 md:h-20 rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-white/20 transition-all duration-300 active:scale-95 hover:border-primary/50"
              >
                <div className="absolute inset-0 bg-midnight/70 group-hover/card:bg-midnight/80 backdrop-blur-md transition-colors"></div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover/card:scale-x-100 transition-transform"></div>
                <div className="absolute inset-0 flex items-center justify-center px-3">
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-white group-hover/card:text-primary transition-colors">
                    {t("hero.eastern")}
                  </h3>
                </div>
              </Link>

              <Link
                href="/riyadh"
                className="group/card relative h-12 sm:h-16 md:h-20 rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-white/20 transition-all duration-300 active:scale-95 hover:border-primary/50"
              >
                <div className="absolute inset-0 bg-midnight/70 group-hover/card:bg-midnight/80 backdrop-blur-md transition-colors"></div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover/card:scale-x-100 transition-transform"></div>
                <div className="absolute inset-0 flex items-center justify-center px-3">
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-white group-hover/card:text-primary transition-colors">
                    {t("hero.riyadh")}
                  </h3>
                </div>
              </Link>

              <Link
                href="/jeddah"
                className="group/card relative h-12 sm:h-16 md:h-20 rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-white/20 transition-all duration-300 active:scale-95 hover:border-primary/50"
              >
                <div className="absolute inset-0 bg-midnight/70 group-hover/card:bg-midnight/80 backdrop-blur-md transition-colors"></div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover/card:scale-x-100 transition-transform"></div>
                <div className="absolute inset-0 flex items-center justify-center px-3">
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-white group-hover/card:text-primary transition-colors">
                    {t("hero.jeddah")}
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAd;
