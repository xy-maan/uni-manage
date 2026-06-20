"use server";
import getAuthData from "@/utilities/getAuthData";
import { Team } from "@/types/team";

export async function completeTeamAction(teamId: number) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/teams/${teamId}/complete/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.django.access}`,
        "Content-Type": "application/json",
      },
    }
  );

  const payload: Team = await res.json();
  return { payload, ok: res.ok };
}
