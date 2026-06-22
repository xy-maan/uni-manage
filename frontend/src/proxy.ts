// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import {routing} from './i18n/routing';
// import createMiddleware from 'next-intl/middleware';
// const handleI18nRouting = createMiddleware(routing);
// export async function proxy(request: NextRequest) { 
//   const pathname = request.nextUrl.pathname;
// const isLoginPage = pathname.endsWith("/login");
// const locales = routing.locales;

// const firstSegment = pathname.split("/")[1];
// const locale = (locales as readonly string[]).includes(firstSegment)
// ? firstSegment
// : routing.defaultLocale;
// const isHomePage =
//   pathname === `/${locale}` ||
//   pathname === `/${locale}/`;
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET!,
//   });
//   if (!token) {
//     if (!isLoginPage && !isHomePage ) {
//       return NextResponse.redirect(  new URL(`/${locale}/login`, request.url));
// }
// return handleI18nRouting(request);
//   }
//   if (
//     token.error === "SessionExpired" ||
//     token.error === "RefreshAccessTokenError" ||
//     token.error === "NoRefreshToken"
//   ) {
//       if (!isLoginPage ) {
//       return NextResponse.redirect(  new URL(`/${locale}/login`, request.url)
// );
//     }
//     return handleI18nRouting(request);
//   }


//   if (isLoginPage) {
//     return NextResponse.redirect(new URL(`/${locale}/`, request.url));
//   }
//     const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
//   const userRole = token.role; 
//   if (pathWithoutLocale.startsWith("/supervisor") && userRole !== "SUPERVISOR") {
//     return NextResponse.redirect(new URL(`/${locale}/student/dashboard`, request.url));
//   }

//   if (pathWithoutLocale.startsWith("/student") && userRole !== "STUDENT") {
//     return NextResponse.redirect(new URL(`/${locale}/supervisor/dashboard`, request.url));
//   }


//       return handleI18nRouting(request);
// }
// export const config = {
//   matcher: [
//     // "/login",
//     // "/student/:path*",
//     // // "/supervisor/:path*",
//     // "/complete-profile",
//    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
//   ],
// };
// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { routing } from "./i18n/routing";
// import createMiddleware from "next-intl/middleware";

// const handleI18nRouting = createMiddleware(routing);

// export async function proxy(request: NextRequest) {  // ✅ الاسم الصحيح
//   const pathname = request.nextUrl.pathname;
//   const locales = routing.locales;

//   const firstSegment = pathname.split("/")[1];
//   const locale = (locales as readonly string[]).includes(firstSegment)
//     ? firstSegment
//     : routing.defaultLocale;

//   const isLoginPage = pathname === `/${locale}/login` || pathname === `/${locale}/login/`;
//   const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  

//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET!,
//   });

//   // ✅ مفيش token خالص
//   if (!token) {
//     if (!isLoginPage) {
//       return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
//     }
//     return handleI18nRouting(request);
//   }

//   // ✅ Token فيه error (expired/refresh failed)
//   if (
//     token.error === "SessionExpired" ||
//     token.error === "RefreshAccessTokenError" ||
//     token.error === "NoRefreshToken"
//   ) {
//     if (!isLoginPage) {
//       const url = new URL(`/${locale}/login`, request.url);
//       return NextResponse.redirect(url);
//     }
//     return handleI18nRouting(request);
//   }

//   // ✅ عنده token صحيح وهو على صفحة login → رجعه للهوم
//   if (isLoginPage) {
//     return NextResponse.redirect(new URL(`/${locale}/`, request.url));
//   }

//   // ✅ Role-based access
//   const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
//   const userRole = token.role;

//   if (pathWithoutLocale.startsWith("/supervisor") && userRole !== "SUPERVISOR") {
//     return NextResponse.redirect(new URL(`/${locale}/student/dashboard`, request.url));
//   }

//   if (pathWithoutLocale.startsWith("/student") && userRole !== "STUDENT") {
//     return NextResponse.redirect(new URL(`/${locale}/supervisor/dashboard`, request.url));
//   }

//   return handleI18nRouting(request);
// }

// export const config = {
//   matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
// };
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
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  const isCompleteProfilePage =
    pathWithoutLocale === "/complete-profile" ||
    pathWithoutLocale.startsWith("/complete-profile/");

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (isHomePage) {
    return handleI18nRouting(request);
  }

  // =========================
  // Not authenticated
  // =========================
  if (!token) {
    if (!isLoginPage) {
      return NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );
    }

    return handleI18nRouting(request);
  }

  // =========================
  // Session expired
  // =========================
  if (
    token.error === "SessionExpired" ||
    token.error === "RefreshAccessTokenError" ||
    token.error === "NoRefreshToken"
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/login`, request.url)
    );
  }

  // =========================
  // Logged in user on login page
  // =========================
  if (isLoginPage) {
    return NextResponse.redirect(
      new URL(`/${locale}`, request.url)
    );
  }
if (isHomePage) {
  return handleI18nRouting(request); 
}
  const role = token.role as string | null;

  // =========================
  // Profile not completed
  // =========================
  // if (!role) {
  //   if (!isCompleteProfilePage) {
  //     return NextResponse.redirect(
  //       new URL(`/${locale}/complete-profile`, request.url)
  //     );
  //   }

  //   return handleI18nRouting(request);
  // }

  // =========================
  // Profile completed
  // Prevent access to complete-profile
  // =========================
  // if (isCompleteProfilePage) {
  //   return NextResponse.redirect(
  //     new URL(`/${locale}/${role.toLowerCase()}/dashboard`, request.url)
  //   );
  // }

  // =========================
  // Role protection
  // =========================
  if (
    role === "STUDENT" &&
    pathWithoutLocale.startsWith("/supervisor")
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/student/dashboard`, request.url)
    );
  }

  if (
    role === "SUPERVISOR" &&
    pathWithoutLocale.startsWith("/student")
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/supervisor/dashboard`, request.url)
    );
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};