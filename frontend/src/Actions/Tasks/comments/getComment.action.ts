"use server";

import getAuthData from "@/utilities/getAuthData";

export async function GetCommentAction(commentId: number) {
  const session = await getAuthData();

  if (!session?.django.access) {
    return { ok: false, payload: null };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/comments/${commentId}/`,
    {
      headers: {
        Authorization: `Bearer ${session.django.access}`,
      },
    }
  );

  const payload = await res.json();

  return {
    ok: res.ok,
    payload,
  };
}
