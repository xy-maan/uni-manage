"use server"
import { Technology } from "@/types/marketplace";
import getAuthData from "@/utilities/getAuthData";

export async function getTechnologiesAction() {
  const session = await getAuthData();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/projects/technologies/`;
  const res = await fetch(url, {
    method: "GET",
    headers: session?.django.access
      ? { "Authorization": `Bearer ${session.django.access}` }
      : {},
    cache: "no-store",
  });
  const payload: Technology[] = await res.json();
  return { payload, ok: res.ok };
}
