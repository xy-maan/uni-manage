"use server";
import getAuthData from "@/utilities/getAuthData";

export async function GetUnreadCountAction() {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/unread-count/`, {
    headers: { Authorization: `Bearer ${session.django.access}` },
  });
  const payload = await res.json();
  return { payload, ok: res.ok };
}
