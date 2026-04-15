"use server";
import { UserData } from "@/types/userStatus";
import getAuthData from "@/utilities/getAuthData";
export async function GetUserStatus(token: string) {
    const tokens=await getAuthData()
    if (!tokens) {
    throw new Error("please login!!!");
  }
  const {django:{access}}=tokens
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/status/`, {
         method: 'GET',
        headers: { Authorization: `Bearer ${access}` },
      });
      const payload:UserData = await res.json();
  return{
    payload,
    ok: res.ok,
  }
}