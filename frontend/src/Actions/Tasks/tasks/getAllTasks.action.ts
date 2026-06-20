// "use server";

// import getAuthData from "@/utilities/getAuthData";

// export async function GetTasksAction(params?: {
//   project?: number;
//   assignee?: number;
//   status?: "todo" | "in_progress" | "review" | "done";
// }) {
//   const session = await getAuthData();

//   if (!session?.django.access) {
//     return { ok: false, payload: null };
//   }

//   const query = new URLSearchParams();
//   if (params?.project) query.append("project", String(params.project));
//   if (params?.assignee) query.append("assignee", String(params.assignee));
//   if (params?.status) query.append("status", params.status);

//   const qs = query.toString() ? `?${query.toString()}` : "";

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/${qs}`,
//     {
//       headers: {
//         Authorization: `Bearer ${session.django.access}`,
//       },
//     }
//   );

//   const payload = await res.json();

//   return {
//     ok: res.ok,
//     payload,
//   };
// }
// Actions/Tasks/tasks/getTasks.action.ts
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