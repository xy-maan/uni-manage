
"use server";
import getAuthData from "@/utilities/getAuthData";

export async function GetTasksAction(
  projectId?: number,
  filters?: { assignee?: number; status?: "todo" | "in_progress" | "review" | "done" }
) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const params = new URLSearchParams();
  if (projectId) params.append("project", String(projectId));
  if (filters?.assignee) params.append("assignee", String(filters.assignee));
  if (filters?.status) params.append("status", filters.status);

  const queryString = params.toString();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${session.django.access}` },
  });
  const payload = await res.json();
  return { ok: res.ok, payload };
}