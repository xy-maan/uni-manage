import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server' 
import getAuthData from './utilities/getAuthData';
export async function proxy(request: NextRequest) {
    const token = request.cookies.get("next-auth.session-token")?.value;
  const pathname = request.nextUrl.pathname;
   if (token) {

    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();

  } else {

    if (
      pathname === "/student/dashboard" ||
      pathname === "/complete-profile"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/login", "/student/:path*", "/complete-profile"],
};