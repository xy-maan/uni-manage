"use server";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
export default async function getAuthData() {
  try {
    const cookieStore = await cookies();
    //  NextAuth token
    const nextAuthToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;

    let nextAuthData = null;

    if (nextAuthToken) {
      nextAuthData = await decode({
        token: nextAuthToken,
        secret: process.env.NEXTAUTH_SECRET!,
      });
    }

    //  Django tokens
    const access = cookieStore.get("access_token")?.value;
    const refresh = cookieStore.get("refresh_token")?.value;
console.log(nextAuthData);
    return {
      nextAuth: nextAuthData,
      django: {
        access,
        refresh,
      },
    };
  } catch (err) {
    return null;
  }
}