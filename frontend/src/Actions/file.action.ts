"use server"
import getAuthData from "@/utilities/getAuthData";

export async function UploadFileAction(postId: number, file: File) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/community/posts/${postId}/upload_attachment/`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${session.django.access}` },
      body: formData,
    }
  );

  const payload = await res.json();
  return { payload, ok: res.ok };
}