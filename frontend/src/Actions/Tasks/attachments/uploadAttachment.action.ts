"use server";

import getAuthData from "@/utilities/getAuthData";

/**
 * Expects a FormData object built on the client with:
 *   formData.append("task", String(taskId));
 *   formData.append("file", fileInput.files[0]);
 *
 * Do NOT set Content-Type manually — fetch sets the correct
 * multipart boundary automatically when given a FormData body.
 */
export async function UploadAttachmentAction(formData: FormData) {
  const session = await getAuthData();

  if (!session?.django.access) {
    return { ok: false, payload: null };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/attachments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.django.access}`,
    },
    body: formData,
  });

  const payload = await res.json();

  return {
    ok: res.ok,
    payload,
  };
}
