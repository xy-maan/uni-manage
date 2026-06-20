"use server"
import { Logout } from "@/types/logout";
import { Post } from "@/types/post";
import { Project } from "@/types/team";
import getAuthData from "@/utilities/getAuthData";
export async function GetAllSupervisorAction(){
  const session = await getAuthData();
 if( !session?.django.access){
    return {ok:false,payload:null}
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/supervisors/`, {
      headers: {
        "Authorization": `Bearer ${session.django.access}`,
      },
    });
    const payload  = await res.json();
console.log(payload);

      return {    payload,
    ok: res.ok}
};
