// Actions/BoardColumns/CreateColumn.action.ts
"use server";
import { FormValues } from "@/app/[locale]/_Components/Methodology/Btns/Kanban/CreateColumnBtn";
import getAuthData from "@/utilities/getAuthData";

export async function CreateColumnAction(data: FormValues) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/board-columns/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.django.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  const payload = await res.json();
  return { ok: res.ok, payload };
}