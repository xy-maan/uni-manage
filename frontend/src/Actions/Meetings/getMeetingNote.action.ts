"use server";
import getAuthData from "@/utilities/getAuthData";

export async function GetMeetingNotesAction() {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/meeting-notes/`, {
    headers: { Authorization: `Bearer ${session.django.access}` },
  });
  const payload = await res.json();
  return { payload, ok: res.ok };
}