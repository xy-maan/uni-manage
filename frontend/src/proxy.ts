
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locales = routing.locales;

  const firstSegment = pathname.split("/")[1];
  const locale = (locales as readonly string[]).includes(firstSegment)
    ? firstSegment
    : routing.defaultLocale;

  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

  const isLoginPage =
    pathWithoutLocale === "/login" ||
    pathWithoutLocale.startsWith("/login/");

  const isHomePage =
    pathname === `/${locale}` ||
    pathname === `/${locale}/` ||
    pathname === "/" ||
    pathname === "";

  const isCompleteProfilePage =
    pathWithoutLocale === "/complete-profile" ||
    pathWithoutLocale.startsWith("/complete-profile/");

  if (isHomePage) {
    return handleI18nRouting(request);
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
    return handleI18nRouting(request);
  }

  if (
    token.error === "SessionExpired" ||
    token.error === "RefreshAccessTokenError" ||
    token.error === "NoRefreshToken"
  ) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
    return handleI18nRouting(request);
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const role = token.role as string | null;

  if (role === "STUDENT" && pathWithoutLocale.startsWith("/supervisor")) {
    return NextResponse.redirect(new URL(`/${locale}/student/dashboard`, request.url));
  }

  if (role === "SUPERVISOR" && pathWithoutLocale.startsWith("/student")) {
    return NextResponse.redirect(new URL(`/${locale}/supervisor/dashboard`, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};