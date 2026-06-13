import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {routing} from './i18n/routing';
import createMiddleware from 'next-intl/middleware';
const handleI18nRouting = createMiddleware(routing);
export async function proxy(request: NextRequest) { 
  const pathname = request.nextUrl.pathname;
const isLoginPage = pathname.endsWith("/login");
const locales = routing.locales;

const firstSegment = pathname.split("/")[1];
const locale = (locales as readonly string[]).includes(firstSegment)
? firstSegment
: routing.defaultLocale;
const isHomePage =
  pathname === `/${locale}` ||
  pathname === `/${locale}/marketplace` ||
  pathname === `/${locale}/`;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  if (!token) {
    if (!isLoginPage && !isHomePage ) {
      return NextResponse.redirect(  new URL(`/${locale}/login`, request.url));
}
return handleI18nRouting(request);
  }
  if (
    token.error === "SessionExpired" ||
    token.error === "RefreshAccessTokenError" ||
    token.error === "NoRefreshToken"
  ) {
      if (!isLoginPage ) {
      return NextResponse.redirect(  new URL(`/${locale}/login`, request.url)
);
    }
    return handleI18nRouting(request);
  }


  if (isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  }
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
  const userRole = token.role; 
  if (pathWithoutLocale.startsWith("/supervisor") && userRole !== "SUPERVISOR") {
    return NextResponse.redirect(new URL(`/${locale}/student/dashboard`, request.url));
  }

  if (pathWithoutLocale.startsWith("/student") && userRole !== "STUDENT") {
    return NextResponse.redirect(new URL(`/${locale}/supervisor/dashboard`, request.url));
  }


      return handleI18nRouting(request);
}
export const config = {
  matcher: [
    // "/login",
    // "/student/:path*",
    // // "/supervisor/:path*",
    // "/complete-profile",
   '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ],
};
