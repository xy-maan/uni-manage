"use server";
import { TaskActivity } from "@/types/tasks";
import getAuthData from "@/utilities/getAuthData";
 
export async function GetTaskActivityListAction() {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
 
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/activity/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${session.django.access}` },
  });
 
  const payload: TaskActivity[] = await res.json();
  return { payload, ok: res.ok };
}