"use server"
import { MarketplaceListResponse } from "@/types/marketplace";
import getAuthData from "@/utilities/getAuthData";

export async function getMarketplaceProjectsAction(params: Record<string, string> = {}) {
  const session = await getAuthData();
  const query = new URLSearchParams(params).toString();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/projects/marketplace/projects/${query ? `?${query}` : ''}`;
  const res = await fetch(url, {
    method: "GET",
    headers: session?.django.access
      ? { "Authorization": `Bearer ${session.django.access}` }
      : {},
    cache: "no-store",
  });
  const payload: MarketplaceListResponse = await res.json();
  return { payload, ok: res.ok };
}
