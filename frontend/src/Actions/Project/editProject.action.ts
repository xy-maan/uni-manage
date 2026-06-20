"use server"
import { editProjectValues } from "@/types/schema";
import { Project } from "@/types/team";
import getAuthData from "@/utilities/getAuthData";

export async function EditProjectAction(project_id: number, data:editProjectValues) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${project_id}/`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${session.django.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload: Project = await res.json();
  return { payload, ok: res.ok };
}