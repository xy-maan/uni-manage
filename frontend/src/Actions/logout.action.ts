"use server"
import { authOptions } from "@/lib/auth";
import { Logout } from "@/types/logout";
import { getServerSession } from "next-auth";
export async function logoutAction(){
  const session = await getServerSession(authOptions);

  if (!session?.djangoAccess || !session?.djangoRefresh) {
    return {
      ok: false,
      payload: { detail: "Session expired, please login again" },
    };
  }
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/logout/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session.djangoAccess}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: session.djangoRefresh }),
    });
    console.log("status:", res.status);
    const payload:Logout = await res.json();
    console.log("payload:", payload)
      return {    payload,
    ok: res.ok,}
};
