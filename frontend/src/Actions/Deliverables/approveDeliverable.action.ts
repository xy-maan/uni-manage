"use server";
import getAuthData from "@/utilities/getAuthData";

export async function ApproveDeliverableAction(deliverable_id: number, note?: string) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/deliverables/${deliverable_id}/approve/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.django.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note }),
  });
  const payload = await res.json();
  return { payload, ok: res.ok };
}
