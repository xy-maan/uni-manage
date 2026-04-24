
"use server";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export default async function getAuthData() {
  try {
    const cookieStore = await cookies();

    const nextAuthToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;


   
    const nextAuthData: any = await decode({
        token: nextAuthToken,
        secret: process.env.NEXTAUTH_SECRET!,
      });
    if (!nextAuthData) return null;

    if (nextAuthData.error) {
      console.error("Token error:", nextAuthData.error);
      return null;
    }
         const access = nextAuthData?.djangoAccess || null;
    const refresh = nextAuthData?.djangoRefresh || null;


    console.log({ access, refresh, nextAuthData });

    return {
      nextAuth: nextAuthData,
      django: {
        access,
        refresh,
      },
    };
  } catch (err) {
    console.error("getAuthData error:", err);
    return null;
  }
}