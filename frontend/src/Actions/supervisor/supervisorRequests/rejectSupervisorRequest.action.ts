// rejectSupervisorRequest.action.ts
"use server"
import getAuthData from "@/utilities/getAuthData";

export async function RejectSupervisorRequestAction(request_id: number) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/projects/supervisor-requests/${request_id}/reject/`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${session.django.access}` },
    }
  );

  const payload = await res.json();
  return { payload, ok: res.ok };
}