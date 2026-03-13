"use client";
import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useTranslation } from "react-i18next";

const Partners = () => {
  const { t, i18n } = useTranslation("common");
  const partners = [
    { id: 1, img: "/images/p-1.jpeg", name: "Partner 1" },
    { id: 2, img: "/images/p-2.jpeg", name: "Partner 2" },
    { id: 3, img: "/images/p-3.jpeg", name: "Partner 3" },
    { id: 4, img: "/images/p-4.jpeg", name: "Partner 4" },
    { id: 5, img: "/images/p5.JPEG", name: "Partner 5" },
  ];

  return (
    <section
      className="py-24 bg-transparent relative overflow-hidden"
      dir={i18n.dir()}
    >
      <div className="container mx-auto px-6 mb-16" dir={i18n.dir()}>
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tighter">
            {t("partners.titlePart1")}{" "}
            <span className="text-primary">{t("partners.titlePart2")}</span>
          </h2>
          <div className="w-24 h-2 bg-linear-to-r from-primary to-transparent mx-auto rounded-full"></div>
        </div>
      </div>

      <div className="relative overflow-hidden w-full">
        <Marquee
          gradient={false}
          speed={30}
          pauseOnHover
          direction={i18n.dir() === "rtl" ? "right" : "left"}
          autoFill
        >
          {partners.map((partner) => (
            <div key={partner.id} className="px-3 sm:px-4 group/item flex-shrink-0">
              <div className="relative w-56 sm:w-72 md:w-80 h-32 md:h-40 bg-white rounded-4xl shadow-xl border border-white/10 flex items-center justify-center p-6 transition-all duration-300 hover:scale-105">
                <div className="relative w-full h-full">
                  <Image
                    src={partner.img}
                    alt={partner.name}
                    fill
                    className="object-contain transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Partners;
