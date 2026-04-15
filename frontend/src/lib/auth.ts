import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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

  callbacks: {
    async signIn({ account, profile,user }) {
    //     if (!user.email?.endsWith(".edu.eg")) {
    //   return "/auth/error?error=invalid_email"; 
    // }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login/google/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: account?.access_token,
            id_token: account?.id_token,
          }),
        });

        if (response.ok) {
          const payload = await response.json();
          account!.djangoAccess = payload.access;
          account!.djangoRefresh = payload.refresh;
          return true;
        }

        return '/auth/error?error=login_failed';
      } catch {
        return '/auth/error?error=network_error';
      }
    },

    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.djangoAccess = account.djangoAccess;
        token.djangoRefresh = account.djangoRefresh;
      }
      return token;
    },

    async session({ session, token }) {
      session.access_token = token.access_token;
      session.id_token = token.id_token;
      session.djangoAccess = token.djangoAccess;
      session.djangoRefresh = token.djangoRefresh;
      return session;
    },
  },

  pages: {
    signIn:"/login",
    error: '/auth/error'
  },
};