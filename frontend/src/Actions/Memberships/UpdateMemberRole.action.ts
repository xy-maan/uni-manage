"use server"
import { Logout } from "@/types/logout";
import { Post } from "@/types/post";
import { Project } from "@/types/team";
import getAuthData from "@/utilities/getAuthData";
export async function UpdateMemberRoleAction({membership_id,data}:{membership_id:number;data:any}){
  const session = await getAuthData();
 if( !session?.django.access){
    return {ok:false,payload:null}
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/memberships/${membership_id}/`, {
    method: "PATCH",
      headers: {
        "Authorization": `Bearer ${session.django.access}`,
      },
    });
    const payload  = await res.json();

      return {    payload,
    ok: res.ok}
};
