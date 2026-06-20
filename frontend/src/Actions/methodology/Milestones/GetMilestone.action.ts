// Actions/Milestones/GetMilestone.action.ts
"use server";
import getAuthData from "@/utilities/getAuthData";

export async function GetMilestoneAction(milestoneId: number) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/milestones/${milestoneId}/`, {
    headers: { Authorization: `Bearer ${session.django.access}` },
  });
  const payload = await res.json();
  return { ok: res.ok, payload };
}