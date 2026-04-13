"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar, CircularProgress } from "@mui/material";
import {
  Dashboard,
  DirectionsCar,
  EventNote,
  Person,
  Logout,
  Settings,
  AddCircle,
  Star,
  Home,
  Lock,
  Notifications,
  Article,
  Category,
} from "@mui/icons-material";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

// Sub-component to handle searchParams safely
function DashboardSidebarContent({
  isAdmin,
  user,
  logout,
  getInitials,
  prefix,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation("common");

  const userLinks = [
    {
      name: t("dashboard.profile"),
      href: `${prefix}?tab=profile`,
      icon: <Person />,
    },
    {
      name: t("dashboard.bookings"),
      href: `${prefix}?tab=bookings`,
      icon: <EventNote />,
    },
    {
      name: t("notifications.title"),
      href: `${prefix}?tab=notifications`,
      icon: <Notifications />,
    },
    {
      name: t("dashboard.changePassword"),
      href: `${prefix}?tab=password`,
      icon: <Settings />,
    },
  ];

  const adminLinks = [
    {
      name: t("dashboard.adminBookings"),
      href: `${prefix}?tab=bookings`,
      icon: <EventNote />,
    },
    {
      name: t("dashboard.admin.tabs.notifications"),
      href: `${prefix}?tab=notifications`,
      icon: <Notifications />,
    },
    {
      name: t("dashboard.adminCars"),
      href: `${prefix}?tab=cars`,
      icon: <DirectionsCar />,
    },
    {
      name: t("dashboard.adminReviews"),
      href: `${prefix}?tab=reviews`,
      icon: <Star />,
    },
    {
      name: t("dashboard.admin.tabs.categories"),
      href: "/dashboard/admin/categories",
      icon: <Category />,
    },
    {
      name: t("dashboard.admin.tabs.blog"),
      href: "/dashboard/admin/blogs",
      icon: <Article />,
    },
    {
      name: t("dashboard.profile"),
      href: `${prefix}?tab=profile`,
      icon: <Person />,
    },
    {
      name: t("dashboard.adminPassword"),
      href: `${prefix}?tab=password`,
      icon: <Lock />,
    },
  ];

  const links = isAdmin ? adminLinks : userLinks;
  const currentTab =
    searchParams.get("tab") || (isAdmin ? "bookings" : "profile");

  return (
    <>
      {/* Sidebar - Premium Midnight Glassmorphism */}
      <aside className="w-80 bg-midnight/80 backdrop-blur-2xl border-l border-white/10 hidden md:flex flex-col fixed h-full overflow-y-auto right-0 z-40 shadow-[20px_0_50px_rgba(0,0,0,0.5)] pt-24">
        {/* User Info Card */}
        <div className="p-8 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "var(--primary)",
                  fontFamily: "inherit",
                  fontWeight: "900",
                  fontSize: "1.2rem",
                  border: "2px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
            </div>
            <div>
              <h3 className="font-black text-white text-base tracking-tight mb-1">
                {user?.name}
              </h3>
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {isAdmin
                    ? t("dashboard.roleAdmin")
                    : t("dashboard.roleClient")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Home Link */}
        <div className="px-6 pt-6">
          <Link
            href="/"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-500 border border-white/5 group"
          >
            <Home className="text-slate-500 group-hover:text-primary group-hover:scale-110 transition-all" />
            <span className="text-sm">{t("dashboard.backToHome")}</span>
          </Link>
        </div>

        {/* Navigation Title */}
        <div className="px-8 pt-8 pb-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            {t("dashboard.mainMenu")}
          </p>
        </div>

        <nav className="flex-1 px-6 space-y-2.5">
          {links.map((link) => {
            const linkTab = link.href.includes('?tab=') 
              ? link.href.split("?tab=")[1] 
              : null;
            
            // Check if active: pathname match takes priority over tab match
            const pathMatch = pathname === link.href;
            const isActive = pathMatch 
              ? true 
              : linkTab 
                ? linkTab === currentTab 
                : false;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all duration-500 group relative ${
                  isActive
                    ? "bg-primary text-white shadow-[0_15px_30px_rgba(249,115,22,0.3)]"
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" />
                )}
                <span
                  className={`transition-all duration-500 ${isActive ? "text-white scale-110" : "text-primary/70 group-hover:text-primary group-hover:scale-110"}`}
                >
                  {link.icon}
                </span>
                <span className="text-sm tracking-tight">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-white/5 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl font-black text-white bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all duration-500 shadow-xl shadow-red-900/40 border border-red-500/20 group"
          >
            <Logout className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">{t("dashboard.secureLogout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const { t, i18n } = useTranslation("common");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-10">
        <h2 className="text-2xl font-black mb-4">
          {t("dashboard.loginRequired")}
        </h2>
        <Link
          href="/auth/login"
          className="bg-primary px-8 py-3 rounded-xl font-black"
        >
          {t("dashboard.loginButton")}
        </Link>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const prefix = isAdmin ? "/dashboard/admin" : "/dashboard/user";

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-transparent flex" dir={i18n.dir()}>
      <Suspense
        fallback={
          <div className="w-80 hidden md:block bg-white/5 animate-pulse" />
        }
      >
        <DashboardSidebarContent
          isAdmin={isAdmin}
          user={user}
          logout={logout}
          getInitials={getInitials}
          prefix={prefix}
        />
      </Suspense>

      {/* Main Content */}
      <main className="flex-1 md:mr-80 pt-20 pb-20 md:pb-0 relative z-10">
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-1000">
          {children}
        </div>
      </main>
    </div>
  );
}
