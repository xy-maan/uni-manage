"use server"
import { Logout } from "@/types/logout";
import { Post } from "@/types/post";
import { Project } from "@/types/team";
import getAuthData from "@/utilities/getAuthData";
export async function ReplaceMembershipAction({membership_id}:{membership_id:number}){
  const session = await getAuthData();
 if( !session?.django.access){
    return {ok:false,payload:null}
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/memberships/${membership_id}/`, {
    method: "PUT",
      headers: {
        "Authorization": `Bearer ${session.django.access}`,
      },
    });
    const payload  = await res.json();

      return {    payload,
    ok: res.ok}
};
