"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authService, userService } from "@/services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check for cached user on initial load
    if (typeof window !== "undefined") {
      const cachedUser = localStorage.getItem("c4r_user");
      return cachedUser ? JSON.parse(cachedUser) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from token on mount to verify session
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return;

      const token = Cookies.get("token");
      if (token) {
        try {
          const profile = await userService.getProfile();
          if (profile.success) {
            setUser(profile.data);
            localStorage.setItem("c4r_user", JSON.stringify(profile.data));
          } else {
            // Token might be invalid
            Cookies.remove("token");
            localStorage.removeItem("c4r_user");
            setUser(null);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // Only clear if it's a 401/403 error, otherwise maybe network issue
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            Cookies.remove("token");
            localStorage.removeItem("c4r_user");
            setUser(null);
          }
        }
      } else {
        // No token, ensure local state is clear
        localStorage.removeItem("c4r_user");
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data && data.success) {
        const { token, user } = data.data;
        Cookies.set("token", token, { expires: 7 }); // Store token for 7 days
        setUser(user);
        localStorage.setItem("c4r_user", JSON.stringify(user));
        toast.success("تم تسجيل الدخول بنجاح");

        // Handle redirection
        const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const returnUrl = searchParams ? searchParams.get("returnUrl") : null;

        if (returnUrl) {
          router.push(returnUrl);
        } else {
          router.push("/");
        }
        return true;
      } else {
        toast.error(data?.message || "فشل تسجيل الدخول");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      const msg = error?.response?.data?.message || error?.message || "تعذر الاتصال بالخادم. الرجاء المحاولة لاحقاً.";
      toast.error(msg);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data && data.success) {
        toast.success("تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول.");
        router.push("/auth/login");
        return true;
      } else {
        toast.error(data?.message || "فشل إنشاء الحساب");
        return false;
      }
    } catch (error) {
      console.error("Register error:", error);
      const msg = error?.response?.data?.message || error?.message || "تعذر الاتصال بالخادم. الرجاء المحاولة لاحقاً.";
      toast.error(msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("token");
      localStorage.removeItem("c4r_user");
      setUser(null);
      router.push("/");
      toast.success("تم تسجيل الخروج بنجاح");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
