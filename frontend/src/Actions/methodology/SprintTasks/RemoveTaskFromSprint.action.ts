// Actions/SprintTasks/RemoveTaskFromSprint.action.ts
"use server";
import getAuthData from "@/utilities/getAuthData";

export async function RemoveTaskFromSprintAction(sprintTaskId: number) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/sprint-tasks/${sprintTaskId}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.django.access}` },
  });
  if (res.status === 204) return { ok: true, payload: { detail: "Task removed from sprint" } };
  const payload = await res.json();
  return { ok: false, payload };
}