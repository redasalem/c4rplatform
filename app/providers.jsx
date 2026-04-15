"use client";
import "../i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const { i18n } = useTranslation();
  const dir = i18n.dir();

  useEffect(() => {
    document.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [dir, i18n.language]);

  // Create RTL/LTR Cache for MUI
  const cacheRtl = useMemo(() => {
    return createCache({
      key: dir === "rtl" ? "muirtl" : "muiltr",
      stylisPlugins: dir === "rtl" ? [prefixer, rtlPlugin] : [prefixer],
    });
  }, [dir]);

  const theme = useMemo(
    () =>
      createTheme({
        direction: dir,
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
    [dir],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            {children}
            <ToastContainer
              position={dir === "rtl" ? "bottom-right" : "bottom-left"}
              rtl={dir === "rtl"}
              theme="dark"
              pauseOnHover
              draggable
              closeOnClick
              limit={3}
              autoClose={4000}
            />
          </AuthProvider>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}
