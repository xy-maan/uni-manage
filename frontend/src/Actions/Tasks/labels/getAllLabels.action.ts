"use server";

import getAuthData from "@/utilities/getAuthData";

export async function GetAllLabelsAction() {
  const session = await getAuthData();

  if (!session?.django.access) {
    return { ok: false, payload: null };
  }

("🔍 BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
("🔍 Full URL:", `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/labels/`);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/labels/`,
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
