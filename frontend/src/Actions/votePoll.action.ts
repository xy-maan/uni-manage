"use server"
import getAuthData from "@/utilities/getAuthData";

export async function VotePollAction(postId: number, optionId: number) {
  const session = await getAuthData();
  if (!session?.django.access) return { ok: false, payload: null };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/community/posts/${postId}/vote-poll/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.django.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify( { option_id: optionId } ),
    }
  );

  const payload = await res.json();
  console.log(payload);
  
  return { ok: res.ok, payload };
}