// uploadDeliverableFile.action.ts
"use server";
import getAuthData from "@/utilities/getAuthData";

export async function UploadDeliverableFileAction(deliverable_id: number, file: File) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  
  const formData = new FormData();
  formData.append("deliverable", String(deliverable_id));
  formData.append("file", file); 
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/deliverable-files/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.django.access}` },
    body: formData,
  });
  const payload = await res.json();
  return { payload, ok: res.ok };
}