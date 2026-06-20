"use server";

import getAuthData from "@/utilities/getAuthData";

export async function DeleteChecklistAction(checklistId: number) {
  const session = await getAuthData();

  if (!session?.django.access) {
    return { ok: false, payload: null };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/checklists/${checklistId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.django.access}`,
      },
    }
  );

  if (res.status === 204) {
    return {
      ok: true,
      payload: { detail: "Checklist deleted successfully" },
    };
  }

  const payload = await res.json();

  return {
    ok: false,
    payload,
  };
}
