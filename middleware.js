import { NextResponse } from "next/server";
import {
  AUTH_TOKEN_COOKIE,
  applyAuthCookies,
  clearAuthCookies,
  fetchSessionFromToken,
} from "@/lib/authSession";

const buildLoginRedirect = (request) => {
  const loginUrl = new URL("/auth/login", request.url);
  const returnUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.searchParams.set("returnUrl", returnUrl);

  return loginUrl;
};

const redirectToLogin = (request) => {
  const response = NextResponse.redirect(buildLoginRedirect(request));
  return clearAuthCookies(response);
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Language Detection Logic
  // Check cookie first, then browser header, then fallback to 'ar'
  const cookieLang = request.cookies.get("i18nextLng")?.value || request.cookies.get("i18next")?.value;
  const headerLang = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0];
  const lang = cookieLang || (headerLang === "en" ? "en" : "ar");
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Add lang/dir to request headers so Server Components can read them
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-lang", lang);
  requestHeaders.set("x-dir", dir);

  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isUserRoute = pathname.startsWith("/dashboard/user");
  const isBookingRoute = pathname.startsWith("/booking");

  // If not a protected route, just return next with the lang headers
  if (!isAdminRoute && !isUserRoute && !isBookingRoute) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    const response = NextResponse.redirect(buildLoginRedirect(request));
    return clearAuthCookies(response);
  }

  const session = await fetchSessionFromToken(token);

  if (!session.success) {
    const response = NextResponse.redirect(buildLoginRedirect(request));
    return clearAuthCookies(response);
  }

  const role = session.user.role;

  // Role based redirection
  if (isAdminRoute && role !== "admin") {
    const response = NextResponse.redirect(new URL("/dashboard/user", request.url));
    response.headers.set("x-lang", lang);
    response.headers.set("x-dir", dir);
    return applyAuthCookies(response, { token, role });
  }

  if (isUserRoute && role === "admin") {
    const response = NextResponse.redirect(new URL("/dashboard/admin", request.url));
    response.headers.set("x-lang", lang);
    response.headers.set("x-dir", dir);
    return applyAuthCookies(response, { token, role });
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  return applyAuthCookies(response, { token, role });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
