"use server"
import { CommentValues } from "@/schemas/Comment.schema";
import { Logout } from "@/types/logout";
import getAuthData from "@/utilities/getAuthData";
export async function CreateCommentAction(postId:number,content:any){
  const session = await getAuthData();
 if( !session?.django.access){
    return {ok:false,payload:null}
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/community/posts/${postId}/comments/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session.django.access}`,
        "Content-Type": "application/json",
      },
          body: JSON.stringify(content),
    });
    const payload = await res.json();
      return {    payload,
    ok: res.ok,}
};
