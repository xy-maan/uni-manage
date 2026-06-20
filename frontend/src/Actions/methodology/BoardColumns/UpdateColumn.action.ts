// Actions/BoardColumns/UpdateColumn.action.ts
"use server";
import getAuthData from "@/utilities/getAuthData";

export async function UpdateColumnAction(columnId: number, data: { name?: string; position?: number; wip_limit?: number }) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/board-columns/${columnId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.django.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const payload = await res.json();
  return { ok: res.ok, payload };
}