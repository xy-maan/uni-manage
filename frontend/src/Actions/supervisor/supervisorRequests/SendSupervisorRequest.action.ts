"use server"
import getAuthData from "@/utilities/getAuthData";
import { RequestType } from "@/types/schema";
export async function SendSupervisorRequestAction(data:RequestType) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/supervisor-requests/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.django.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = await res.json();
  return { payload, ok: res.ok };
}