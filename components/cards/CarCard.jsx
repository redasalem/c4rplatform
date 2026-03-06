"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DirectionsCar,
  Speed,
  Settings,
  AirlineSeatReclineExtra,
  LocalGasStation,
  ArrowBack,
  LocationOn,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";

const CarCard = ({ car }) => {
  const { t, i18n } = useTranslation("common");
  // Use first image or placeholder
  const imageUrl =
    car.image ||
    car.images?.[0]?.url ||
    car.images?.[0] ||
    "/images/car-home.png";

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
      dir={i18n.dir()}
    >
      {/* Image Section */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={car.name || t("carCard.fallbackImage")}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-black/50 backdrop-blur-md text-white text-sm font-bold px-3 py-1.5 rounded-full border border-white/20">
            {t("carCard.model")} {car.year || "2024"}
          </span>
        </div>
        {car.region && (
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            <span className="bg-orange-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <LocationOn style={{ fontSize: 16 }} />
              {t(`regions.${car.region}`) || car.region}
            </span>
            {car.category && (
              <span
                className={`backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg ${car.category === "with_driver"
                    ? "bg-purple-600/90"
                    : car.category === "corporate"
                      ? "bg-green-600/90"
                      : "bg-sky-600/90"
                  }`}
              >
                {t(`carCard.categories.${car.category}`) || car.category}
              </span>
            )}
          </div>
        )}
        {/* Overlays for premium feel */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="min-w-0">
            <h3 className="text-xl md:text-2xl font-black text-slate-800 truncate">
              {car.name}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm font-bold truncate">
              {car.brand} {car.model}
            </p>
          </div>
          <div className="text-left shrink-0">
            <span className="text-orange-600 font-black text-2xl md:text-3xl">
              {car.pricePerDay}
            </span>
            <span className="text-slate-400 text-[10px] md:text-sm font-bold mr-1 block">
              {t("carCard.priceDay")}
            </span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-slate-600">
            <Settings
              sx={{ fontSize: { xs: 18, md: 22 } }}
              className="text-orange-500"
            />
            <span className="text-xs md:text-sm font-bold">
              {t("carCard.specs.auto")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <LocalGasStation
              sx={{ fontSize: { xs: 18, md: 22 } }}
              className="text-orange-500"
            />
            <span className="text-xs md:text-sm font-bold">
              {t("carCard.specs.petrol")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <AirlineSeatReclineExtra
              sx={{ fontSize: { xs: 18, md: 22 } }}
              className="text-orange-500"
            />
            <span className="text-xs md:text-sm font-bold">
              {t("carCard.specs.seats")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Speed
              sx={{ fontSize: { xs: 18, md: 22 } }}
              className="text-orange-500"
            />
            <span className="text-xs md:text-sm font-bold">
              {t("carCard.specs.limitedKm")}
            </span>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <Link
            href={`/cars/${car._id}`}
            className="flex-1 bg-slate-100 text-slate-900 text-center py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {t("carCard.details")}
          </Link>
          <Link
            href={`/booking/${car._id}`}
            className="flex-[1.5] bg-orange-500 text-white text-center py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2 group/btn"
          >
            {t("carCard.bookNow")}
            <ArrowBack
              fontSize="small"
              className="transition-transform group-hover/btn:-translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
