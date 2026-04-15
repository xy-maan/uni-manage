"use server";
import { RoleDataType } from "@/app/_Components/Auth/Forms/FormStudent/FormStudent";
import { getAccessToken } from "@/lib/cookies";
// import { ProfileFormType } from "@/types/auth";
export async function completeProfileAction(data: RoleDataType) {
  const access_token = await getAccessToken();
  if (!access_token) {
    throw new Error("No tokens found");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/complete/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(data),
  });

  const payload = await res.json();
  return {
    payload,
    ok: res.ok,
  };
}
