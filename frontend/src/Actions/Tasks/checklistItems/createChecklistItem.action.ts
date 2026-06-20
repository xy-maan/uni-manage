"use server";

import getAuthData from "@/utilities/getAuthData";

export interface CreateChecklistItemPayload {
  checklist: number;
  content: string;
  is_completed?: boolean;
  position?: number;
}

export async function CreateChecklistItemAction(data: CreateChecklistItemPayload) {
  const session = await getAuthData();

  if (!session?.django.access) {
    return { ok: false, payload: null };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/checklist-items/`,
    {
      method: "POST",
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
