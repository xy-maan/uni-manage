"use server"
import { Category } from "@/types/marketplace";
import getAuthData from "@/utilities/getAuthData";

export async function getCategoriesAction() {
  const session = await getAuthData();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/projects/categories/`;
  const res = await fetch(url, {
    method: "GET",
    headers: session?.django.access
      ? { "Authorization": `Bearer ${session.django.access}` }
      : {},
    cache: "no-store",
  });
  const payload: Category[] = await res.json();
  return { payload, ok: res.ok };
}
