"use server";
import { RoleDataType } from "@/app/_Components/Auth/Forms/FormStudent/FormStudent";
import getAuthData from "@/utilities/getAuthData";
// import { ProfileFormType } from "@/types/auth";
export async function completeProfileAction(data: RoleDataType) {
  const session = await getAuthData();

  if (!session?.django.access) {
    throw new Error("No access token");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/profile/complete/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.django.access}`,
    },
    body: JSON.stringify(data),
  });

  const payload = await res.json();
  return {
    payload,
    ok: res.ok,
  };
}
