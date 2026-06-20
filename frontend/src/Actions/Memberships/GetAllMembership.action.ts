"use server"
import { Logout } from "@/types/logout";
import { Post } from "@/types/post";
import { Memberships, Project } from "@/types/team";
import getAuthData from "@/utilities/getAuthData";
export async function GetMembershipsAction(){
  const session = await getAuthData();
 if( !session?.django.access){
    return {ok:false,payload:null}
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/memberships/`, {
      headers: {
        "Authorization": `Bearer ${session.django.access}`,
      },
    });
    const payload:Memberships  = await res.json();

      return {    payload,
    ok: res.ok}
};
