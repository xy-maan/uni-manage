"use server"
import { clearTokens, getAccessToken, getRefreshToken } from "@/lib/cookies";
import { Logout } from "@/types/logout";
import getAuthData from "@/utilities/getAuthData";
import { getCookie } from "cookies-next";
export async function logoutAction(){
  const access_token =await getAccessToken();
  const refresh_token =await getRefreshToken();
   const tokens=await getAuthData()

    if (!access_token || !refresh_token|| !tokens) {
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
    const payload:Logout = await res.json();
    clearTokens()
      return {    payload,
    ok: res.ok,}
};