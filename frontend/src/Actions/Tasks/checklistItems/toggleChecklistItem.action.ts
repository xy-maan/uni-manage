"use server";

import getAuthData from "@/utilities/getAuthData";

export async function ToggleChecklistItemAction(
  itemId: number,
  data: { is_completed: boolean }
) {
  const session = await getAuthData();

  if (!session?.django.access) {
    return { ok: false, payload: null };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/checklist-items/${itemId}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.django.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const payload = await res.json();

  return {
    ok: res.ok,
    payload,
  };
}
