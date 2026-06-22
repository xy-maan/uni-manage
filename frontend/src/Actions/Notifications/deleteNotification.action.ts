"use server";
import getAuthData from "@/utilities/getAuthData";

export async function DeleteNotificationAction(notification_id: number) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  (
  `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${notification_id}/`
);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${notification_id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.django.access}` },
  });
  const payload = await res.json();

  return { payload, ok: res.ok };
}
