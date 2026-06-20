// Actions/Milestones/ReplaceMilestone.action.ts
"use server";
import getAuthData from "@/utilities/getAuthData";

export async function ReplaceMilestoneAction(milestoneId: number, data: any) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/milestones/${milestoneId}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.django.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const payload = await res.json();
  return { ok: res.ok, payload };
}