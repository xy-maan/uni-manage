"use server"
import { Comments } from "@/types/comments";
import { Logout } from "@/types/logout";
import {  CreatePostRequest, Post } from "@/types/post";
import getAuthData from "@/utilities/getAuthData";
export async function GetCommentAction(postId:number){
  const session = await getAuthData();
 if( !session?.django.access){
    return {ok:false,payload:null}
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/community/posts/${postId}/comments/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.django.access}`,
        "Content-Type": "application/json",
      },
    });
    const payload:Comments = await res.json();
      return {    payload,
    ok: res.ok,}
};
