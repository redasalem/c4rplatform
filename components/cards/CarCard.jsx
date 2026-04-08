"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  AirlineSeatReclineExtra,
  LocalGasStation,
  ArrowBack,
  LocationOn,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";

const CarCard = ({ car }) => {
  const { t, i18n } = useTranslation("common");
  const { user } = useAuth();
  const canBookCar = user?.role !== "admin";
  // Use first image or placeholder
  const imageUrl =
    car.image ||
    car.images?.[0]?.url ||
    car.images?.[0] ||
    "/images/car-home.png";

  return (
    <div
      className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-orange-500/30 shadow-md hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.25)] transition-all duration-500 group flex flex-col h-full relative hover:-translate-y-2"
      dir={i18n.dir()}
    >
      {/* Decorative Gradient Background (visible on hover) */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

      {/* Image Section */}
      <div className="relative h-48 sm:h-52 md:h-64 w-full shrink-0 overflow-hidden z-10 rounded-t-4xl">
        <Image
          src={imageUrl}
          alt={car.name || t("carCard.fallbackImage")}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-115 group-hover:rotate-1"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Subtle dark gradient overlay at the bottom of the image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>

        {/* Year Badge - Glassmorphism */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className="bg-black/30 backdrop-blur-lg text-white text-[10px] sm:text-xs font-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-white/20 shadow-xl flex items-center justify-center">
            {t("carCard.model")} {car.year || "2024"}
          </span>
        </div>

        {/* Region & Category Badges */}
        {car.region && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
            <span className="bg-orange-600/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl flex items-center gap-1 shadow-lg border border-orange-400/30">
              <LocationOn style={{ fontSize: 12 }} className="sm:!text-[14px]" />
              {t(`regions.${car.region}`) || car.region}
            </span>
            {car.category && (
              <span
                className={`backdrop-blur-md text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-lg border border-white/20 ${
                  car.category === "with_driver"
                    ? "bg-purple-600/80"
                    : car.category === "corporate"
                    ? "bg-emerald-600/80"
                    : "bg-sky-600/80"
                }`}
              >
                {t(`carCard.categories.${car.category}`) || car.category}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:px-5 sm:pb-5 sm:pt-3 flex flex-col grow relative z-10">
        <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 truncate tracking-tight group-hover:text-orange-600 transition-colors duration-300">
              {car.name}
            </h3>
            <p className="text-slate-500 text-[10px] sm:text-xs md:text-sm font-bold truncate mt-0.5 sm:mt-1">
              {car.brand} {car.model}
            </p>
          </div>
          <div className="text-left shrink-0 bg-orange-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-orange-100 group-hover:bg-orange-100 transition-colors duration-300">
            <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent font-black text-lg sm:text-xl md:text-2xl block leading-none">
              {car.pricePerDay}
            </span>
            <span className="text-orange-600/70 text-[9px] sm:text-[10px] md:text-xs font-black block mt-0.5 sm:mt-1 uppercase tracking-wider text-center">
              {t("carCard.priceDay")}
            </span>
          </div>
        </div>

        {/* Specs Grid - Premium Pills */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <div className="flex items-center gap-2 bg-slate-50/80 px-3 py-2.5 rounded-xl border border-slate-100 group-hover:border-orange-200 group-hover:bg-white transition-all duration-300 flex-1">
            <LocalGasStation sx={{ fontSize: 18 }} className="text-orange-500 shrink-0" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600 truncate">
              {car.fuelType || t("carCard.specs.petrol")}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50/80 px-3 py-2.5 rounded-xl border border-slate-100 group-hover:border-orange-200 group-hover:bg-white transition-all duration-300 flex-1">
            <AirlineSeatReclineExtra sx={{ fontSize: 18 }} className="text-orange-500 shrink-0" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600 truncate">
              {`${car.seats || 5} ${t("seats")}`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2 sm:gap-3">
          <Link
            href={`/cars/${car._id}`}
            className={`${canBookCar ? "flex-1" : "w-full"} bg-white text-slate-700 text-center py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-extrabold text-[11px] sm:text-sm border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center shadow-sm`}
          >
            {t("carCard.details")}
          </Link>
          {canBookCar && (
            <Link
              href={`/booking/${car._id}`}
              className="flex-[1.5] bg-gradient-to-l from-orange-600 to-orange-500 text-white text-center py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-black text-[11px] sm:text-sm hover:from-orange-700 hover:to-orange-600 transition-all shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(249,115,22,0.6)] active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 relative overflow-hidden group/btn"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/btn:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out"></div>
              <span className="relative z-10">{t("carCard.bookNow")}</span>
              <ArrowBack
                fontSize="small"
                className="relative z-10 transition-transform group-hover/btn:-translate-x-1.5 !text-[16px] sm:!text-[20px]"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
