"use client";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";

export const SUPPORTED_LANGUAGES = ["ar", "en"];
export const DEFAULT_LANGUAGE = "ar";

export const useLanguage = () => {
  const { i18n, t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !initialized) {
      setInitialized(true);
    }
  }, [mounted, initialized]);

  const currentLanguage = mounted ? i18n.language : DEFAULT_LANGUAGE;
  const isRtl = currentLanguage === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  const changeLanguage = useCallback(
    async (lang) => {
      if (!SUPPORTED_LANGUAGES.includes(lang)) return;

      await i18n.changeLanguage(lang);

      document.cookie = `i18nextLng=${lang};path=/;max-age=31536000;SameSite=Lax`;
      document.cookie = `i18next=${lang};path=/;max-age=31536000;SameSite=Lax`;

      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    },
    [i18n]
  );

  return {
    language: currentLanguage,
    dir,
    isRtl,
    isLtr: !isRtl,
    mounted,
    initialized,
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLanguage,
    t,
    i18n,
  };
};

export const LanguageProvider = ({ children, serverLang, serverDir }) => {
  const { i18n } = useTranslation("common");
  const [mounted, setMounted] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !synced && serverLang) {
      if (i18n.language !== serverLang) {
        i18n.changeLanguage(serverLang);
      }
      document.documentElement.lang = serverLang;
      document.documentElement.dir = serverDir || (serverLang === "ar" ? "rtl" : "ltr");
      setSynced(true);
    }
  }, [mounted, synced, serverLang, serverDir, i18n]);

  return children;
};
