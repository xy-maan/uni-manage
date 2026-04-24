import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  if (!token) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
  if (
    token.error === "RefreshAccessTokenError" ||
    token.error === "NoRefreshToken"
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "session_expired");

    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");

    return response;
  }
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/student/:path*", "/supervisor/:path*", "/complete-profile"],
};
