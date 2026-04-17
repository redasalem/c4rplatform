"use client";
import "../i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children, lang, dir }) {
  const [queryClient] = useState(() => new QueryClient());
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!initialized && lang) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
      setInitialized(true);
    }
  }, [lang, i18n, initialized]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang || "ar";
      document.documentElement.dir = dir || "rtl";
    }
  }, [dir, lang, mounted]);

  const effectiveDir = mounted ? (i18n.dir() === "rtl" ? "rtl" : "ltr") : (dir || "rtl");

  const theme = useMemo(
    () =>
      createTheme({
        direction: effectiveDir,
        typography: {
          fontFamily: "var(--font-almarai)",
        },
        palette: {
          mode: "dark",
          primary: {
            main: "#f97316",
          },
        },
      }),
    [effectiveDir],
  );

  const toastPosition = effectiveDir === "rtl" ? "bottom-left" : "bottom-right";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          {children}
          <ToastContainer
            position={toastPosition}
            rtl={effectiveDir === "rtl"}
            theme="dark"
            pauseOnHover
            draggable
            closeOnClick
            limit={3}
            autoClose={4000}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
