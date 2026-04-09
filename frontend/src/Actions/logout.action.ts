"use server"
import { clearTokens, getAccessToken, getRefreshToken } from "@/lib/cookies";
import { getCookie } from "cookies-next";
export async function logoutHandle(){
  const access_token =await getAccessToken();
  const refresh_token =await getRefreshToken();
    if (!access_token || !refresh_token) {
   throw new Error("No tokens found");
  }
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/logout/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refresh_token }),
    });
    const result = await res.json();
    clearTokens()
    console.log(result);
      return {...result, ok: res.ok,}
};