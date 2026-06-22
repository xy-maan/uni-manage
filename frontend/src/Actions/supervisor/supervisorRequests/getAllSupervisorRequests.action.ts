// getAllSupervisorRequests.action.ts
"use server"
import getAuthData from "@/utilities/getAuthData";

export async function GetAllSupervisorRequestsAction() {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/supervisor-requests/`, {
    headers: { Authorization: `Bearer ${session.django.access}` },
  });

  const payload = await res.json();
    ("RAW API RESPONSE:", payload); 
  return { payload, ok: res.ok };
}