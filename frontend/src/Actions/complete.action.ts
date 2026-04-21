"use server";
import { RoleDataType } from "@/app/_Components/Auth/Forms/FormStudent/FormStudent";
import getAuthData from "@/utilities/getAuthData";
// import { ProfileFormType } from "@/types/auth";
export async function completeProfileAction(data: RoleDataType,token:string) {
  if (!token) {
    throw new Error("No access token");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/complete/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const payload = await res.json();
  return {
    payload,
    ok: res.ok,
  };
}
