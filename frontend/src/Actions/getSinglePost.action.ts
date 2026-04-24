"use server"
import { PostItem } from "@/types/getPosts";
import { InteractionPayload } from "@/types/iteractions";
import getAuthData from "@/utilities/getAuthData";
export async function GetSinglePostAction(postId:string) {
  const session = await getAuthData();
  if (!session?.django.access)  throw new Error("please login first!");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/community/posts/${postId}/`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${session.django.access}` },
    }
  );

  const payload:PostItem = await res.json();
  return { payload, ok: res.ok };
}