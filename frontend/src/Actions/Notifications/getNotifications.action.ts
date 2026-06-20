"use server";
import getAuthData from "@/utilities/getAuthData";

export async function GetNotificationsAction(unreadOnly?: boolean) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${unreadOnly ? "?unread=true" : ""}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${session.django.access}` },
  });
  const payload = await res.json();
  return { payload, ok: res.ok };
}
