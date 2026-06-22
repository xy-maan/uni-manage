"use server"
import { Logout } from "@/types/logout";
import { Post } from "@/types/post";
import { Project } from "@/types/team";
import getAuthData from "@/utilities/getAuthData";
export async function GetAllProjectsAction(){
  const session = await getAuthData();
 if( !session?.django.access){
    return {ok:false,payload:null}
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/`, {
      headers: {
        "Authorization": `Bearer ${session.django.access}`,
      },
    });
    const payload:Project[]  = await res.json();
const projects = payload.filter((p: any) =>
  p.memberships?.some(
    (m: any) =>
      m.user_detail?.email === session.nextAuth.email
  )
);
  const myProject = payload.find((p: any) =>
    p.memberships?.some(
      (m: any) =>
        m.user_detail?.email === session.nextAuth.email
    )
  );
      return {    payload,
    ok: res.ok,projects,myProject}
};
