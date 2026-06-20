"use server";

import getAuthData from "@/utilities/getAuthData";

export async function GetActivityAction(params?: { task?: number }) {
  const session = await getAuthData();

  if (!session?.django.access) {
    return { ok: false, payload: null };
  }

  const qs = params?.task ? `?task=${params.task}` : "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/activity/${qs}`,
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
