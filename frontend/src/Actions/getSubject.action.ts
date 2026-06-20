"use server"
import { Logout } from "@/types/logout";
import { Post } from "@/types/post";
import getAuthData from "@/utilities/getAuthData";
export async function GetSubjectAction(){
  const session = await getAuthData();
 if( !session?.django.access){
    return {ok:false,payload:null}
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/subjects/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.django.access}`,
        // "Content-Type": "application/json",
      },
    });
    const payload = await res.json();
      return {    payload,
    ok: res.ok,}
};
