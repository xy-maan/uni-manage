// updateSupervisorRequest.action.ts
"use server"
import getAuthData from "@/utilities/getAuthData";

export async function UpdateSupervisorRequestAction(request_id: number, data: Record<string, unknown>) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/projects/supervisor-requests/${request_id}/`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.django.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const payload = await res.json();
  return { payload, ok: res.ok };
}