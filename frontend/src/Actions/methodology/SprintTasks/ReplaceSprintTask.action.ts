"use server";
import getAuthData from "@/utilities/getAuthData";

export async function ReplaceSprintTaskAction(sprintTaskId: number, data: { sprint: number; task: number }) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/sprint-tasks/${sprintTaskId}/`, {
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