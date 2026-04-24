"use server"
import { InteractionPayload } from "@/types/iteractions";
import getAuthData from "@/utilities/getAuthData";
export async function DownvotePostAction(postId:number) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/community/posts/${postId}/downvote/`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${session.django.access}` },
    }
  );

  const payload:InteractionPayload = await res.json();
  return { payload, ok: res.ok };
}