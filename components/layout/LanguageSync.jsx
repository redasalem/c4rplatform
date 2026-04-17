"use client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const updateDirection = () => {
      document.documentElement.lang = i18n.language;
      document.documentElement.dir = i18n.dir();
    };

    updateDirection();

    const handleLanguageChange = () => {
      updateDirection();
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  return null;
}
