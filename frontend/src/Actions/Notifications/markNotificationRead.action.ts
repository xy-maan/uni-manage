"use server";
import getAuthData from "@/utilities/getAuthData";

export async function MarkNotificationReadAction(notification_id: number) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${notification_id}/mark-read/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.django.access}` },
  });
  const payload = await res.json();
  return { payload, ok: res.ok };
}
