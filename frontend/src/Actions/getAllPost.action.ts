"use server"
import { PostItems } from "@/types/getPosts";
import getAuthData from "@/utilities/getAuthData";
export async function GetPostAction(){
  const session = await getAuthData();
 if( !session?.django.access){
     throw new Error("please login first!");
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/community/posts/`, {
      method: "Get",
      headers: {
        "Authorization": `Bearer ${session.django.access}`,
        "Content-Type": "application/json",
      },    
     cache: "no-store",});
    const payload:PostItems = await res.json();
    
      return {    payload,
    ok: res.ok,}
};
