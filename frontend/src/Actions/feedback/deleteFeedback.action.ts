import getAuthData from "@/utilities/getAuthData";
export async function DeleteFeedbackAction(feedback_id: number) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/feedback/${feedback_id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.django.access}` },
  });

  return { payload: null, ok: res.ok };
}