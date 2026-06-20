"use server";
import { ReviewDeliverableValues } from "@/schemas/deliverable.schema";
import getAuthData from "@/utilities/getAuthData";

export async function RejectDeliverableAction(deliverable_id: number, note: ReviewDeliverableValues) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/deliverables/${deliverable_id}/reject/`, {
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
