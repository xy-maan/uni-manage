"use server";
import getAuthData from "@/utilities/getAuthData";

export async function CreateSprintAction(data: {
  project: number;
  name: string;
  goal?: string;
  starts_at: string;
  ends_at: string;
  status?: string;
}) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/sprints/`, {
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