"use server";
import { UserData } from "@/types/userStatus";
export async function GetUserStatus(token: string) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/status/`, {
         method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        
      });
      const payload:UserData = await res.json();
      console.log("statussss",payload)
  return{
    payload,
    ok: res.ok,
  }
}