"use server";

import getAuthData from "@/utilities/getAuthData";

export async function GetChecklistItemsAction(params?: { checklist?: number }) {
  const session = await getAuthData();

  if (!session?.django.access) {
    return { ok: false, payload: null };
  }

  const qs = params?.checklist ? `?checklist=${params.checklist}` : "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/checklist-items/${qs}`,
    {
      headers: {
        Authorization: `Bearer ${session.django.access}`,
      },
    }
  );

  const payload = await res.json();

  return {
    ok: res.ok,
    payload,
  };
}
