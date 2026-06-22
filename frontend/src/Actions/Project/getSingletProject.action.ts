"use server";
import getAuthData from "@/utilities/getAuthData";
import { Project } from "@/types/team";

export async function getSingleProjectAction(project_id: number) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${project_id}/`,
    {
      headers: {
        Authorization: `Bearer ${session.django.access}`,
        "Content-Type": "application/json",
      },
    }
  );
  const payload:Project = await res.json();
  

  return { payload, ok: res.ok };
}
