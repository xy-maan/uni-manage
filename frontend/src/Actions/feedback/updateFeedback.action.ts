"use server";
import getAuthData from "@/utilities/getAuthData";

export async function UpdateFeedbackAction(feedback_id: number, data: { content: string }) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/feedback/${feedback_id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.django.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const payload = await res.json();
  return { payload, ok: res.ok };
}
