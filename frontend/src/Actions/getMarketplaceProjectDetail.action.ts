"use server"
import { MarketplaceProjectDetail } from "@/types/marketplace";
import getAuthData from "@/utilities/getAuthData";

export async function getMarketplaceProjectDetailAction(projectId: number) {
  const session = await getAuthData();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/projects/marketplace/projects/${projectId}/`;
  const res = await fetch(url, {
    method: "GET",
    headers: session?.django.access
      ? { "Authorization": `Bearer ${session.django.access}` }
      : {},
    cache: "no-store",
  });
  const payload: MarketplaceProjectDetail = await res.json();
  return { payload, ok: res.ok };
}
