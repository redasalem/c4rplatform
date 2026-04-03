"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { carService } from "@/services/api";
import CarCard from "@/components/cards/CarCard";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { CircularProgress, Container } from "@mui/material";
import { DirectionsCar } from "@mui/icons-material";

import { useTranslation } from "react-i18next";

export default function AllCarsPage() {
  const { t, i18n } = useTranslation("common");
  const {
    data: carsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allCars"],
    queryFn: () => carService.getAll().catch(() => ({ data: { cars: [] } })),
  });

  const cars = carsData?.data?.cars || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20" dir={i18n.dir()}>
      <Breadcrumbs items={[{ label: t("carsPage.breadcrumb") }]} />
      <Container maxWidth="xl" className="pt-12 relative z-10">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full mb-6 border border-primary/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <DirectionsCar fontSize="small" />
            <span className="font-black text-sm uppercase tracking-widest">
              {t("carsPage.badge")}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
            {t("carsPage.titlePart1")}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
              {t("carsPage.titlePart2")}
            </span>{" "}
            {t("carsPage.titlePart3")}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-bold text-lg leading-relaxed">
            {t("carsPage.subtitle")}
          </p>
        </div>

        {/* Cars Grid */}
        {cars.length === 0 ? (
          <div className="text-center py-24 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl">
            <p className="text-slate-500 font-black text-xl">
              {t("carsPage.empty")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
