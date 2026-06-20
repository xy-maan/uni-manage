"use server";
import getAuthData from "@/utilities/getAuthData";

export async function GetSprintTasksAction() {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/sprint-tasks/`, {
    headers: { Authorization: `Bearer ${session.django.access}` },
  });
  const payload = await res.json();
  return { ok: res.ok, payload };
}