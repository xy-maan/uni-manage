"use server";
import getAuthData from "@/utilities/getAuthData";
import { CreateTeamInput, Team } from "@/types/team";
import { createProjectValues } from "@/types/schema";

export async function createProjectAction(data: createProjectValues) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
console.log("URL:", `${process.env.NEXT_PUBLIC_BASE_URL}/projects/`);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.django.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload: Team = await res.json();

  return { payload, ok: res.ok };
}
