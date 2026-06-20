// Actions/SprintTasks/AssignTaskToSprint.action.ts
"use server";
import getAuthData from "@/utilities/getAuthData";

export async function AssignTaskToSprintAction(data: { sprint: number; task: number }) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/sprint-tasks/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.django.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const payload = await res.json();
  return { ok: res.ok, payload };
}