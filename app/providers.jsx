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

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // Don't retry for 404 errors - they won't fix themselves
              if (error?.response?.status === 404) return false;
              // Retry other errors up to 2 times
              return failureCount < 2;
            },
            refetchOnWindowFocus: false, // Prevent excessive re-fetching
            staleTime: 5 * 60 * 1000, // 5 minutes default stale time
          },
        },
      }),
  );
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // HYDRATION STABILIZATION: Force server-matching defaults during hydration pass.
  // Once mounted, we adapt to the user's detected i18n settings.
  const currentLang = mounted ? i18n.language : "ar";
  const dir = (currentLang === "ar") ? "rtl" : "ltr";

  useEffect(() => {
    if (mounted) {
      document.dir = dir;
      document.documentElement.lang = currentLang;
    }
  }, [dir, currentLang, mounted]);

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
    </QueryClientProvider>
  );
}
