// createSupervisor.action.ts
"use server"
import getAuthData from "@/utilities/getAuthData";

export async function CreateSupervisorAction(data: {
  project: number;
  supervisor: number;
  role: "primary" | "secondary";
}) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/supervisors/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.django.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = await res.json();
  return { payload, ok: res.ok };
}