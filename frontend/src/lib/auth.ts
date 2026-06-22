import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { refreshTokenAction } from "@/Actions/refresh.action";
import { jwtDecode } from "jwt-decode";
import { GetUserStatus } from "@/Actions/status.action";
type JwtPayload = {
  exp?: number;
};
function decodeTokenExpiry(token: string): number {
  const decoded = jwtDecode<JwtPayload>(token);

  return decoded.exp ? decoded.exp * 1000 : 0;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      //     if (!user.email?.endsWith(".edu.eg")) {
      //   return "/auth/error?error=invalid_email";
      // }
      if (!account?.access_token) return "/auth/error?error=no_google_token";
  if (!account?.id_token) return "/auth/error?error=no_id_token";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/login/google/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: account.access_token,
            id_token: account.id_token,
          }),
        },
      );

if (!response.ok) return "/auth/error?error=login_failed";
const payload = await response.json();
      account.djangoAccess = payload.access;
      account.djangoRefresh = payload.refresh;
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.djangoAccess = account.djangoAccess;
        token.djangoRefresh = account.djangoRefresh;
        token.access_token = account.access_token;
        // neww
        token.djangoAccessExpires = decodeTokenExpiry(account.djangoAccess as string);
        // 
        token.id_token = account.id_token;

        // بجرب 
        //  token.djangoAccessExpires = Date.now() +5*1000;

    const { payload, ok } = await GetUserStatus(account.djangoAccess as string);
    if (ok) {
      token.role = payload.role;
      // token.isComplete = payload.is_complete;
    }
        return token;
      }

      if (
        token.djangoAccess &&
        token.djangoAccessExpires &&
      Date.now() < (token.djangoAccessExpires as number) 
      ) {
        return token;
      }

      if (!token.djangoRefresh) {
        return { ...token, error: "NoRefreshToken" };
      }
      const { ok, access,refresh } = await refreshTokenAction(
        token.djangoRefresh as string,
      );


      if (!ok || !access) {
        return { ...token, error: "RefreshAccessTokenError" };
      }
      
      return {
        ...token,
        djangoAccess: access,
        djangoAccessExpires: decodeTokenExpiry(access),
        djangoRefresh: refresh ?? token.djangoRefresh,
        error: undefined,
      };
    },

    async session({ session, token }) {

     session.access_token = token.access_token;
      session.id_token = token.id_token;
      session.djangoAccess = token.djangoAccess;
      session.djangoRefresh = token.djangoRefresh;
      session.error = token.error;
  session.role = token.role;           

        return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

