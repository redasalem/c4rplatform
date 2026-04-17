"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations directly (bundled approach for Next.js)
import arCommon from "./public/locales/ar/common.json";
import enCommon from "./public/locales/en/common.json";

const resources = {
  ar: {
    common: arCommon,
  },
  en: {
    common: enCommon,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ar",
    lng: "ar",
    supportedLngs: ["ar", "en"],
    ns: ["common"],
    defaultNS: "common",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      caches: ["cookie", "localStorage"],
      lookupQuerystring: "lang",
      lookupCookie: "i18nextLng",
      lookupLocalStorage: "i18nextLng",
    },
    react: {
      useSuspense: false,
      bindI18n: "languageChanged",
      bindI18nStore: "",
      transEmptyNodeValue: "",
      usePureComponent: true,
    },
  });

export default i18n;
