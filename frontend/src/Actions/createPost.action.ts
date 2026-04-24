"use server"
import { Logout } from "@/types/logout";
import {  CreatePostRequest, Post } from "@/types/post";
import getAuthData from "@/utilities/getAuthData";
export async function CreatePostAction(data:CreatePostRequest){
  const session = await getAuthData();
 if( !session?.django.access){
    return {ok:false,payload:null}
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/community/posts/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session.django.access}`,
        "Content-Type": "application/json",
      },
          body: JSON.stringify(data),
    });
    const payload:Post = await res.json();
      return {    payload,
    ok: res.ok,}
};
