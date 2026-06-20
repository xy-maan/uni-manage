"use server"
import { Logout } from "@/types/logout";
import { Post } from "@/types/post";
import getAuthData from "@/utilities/getAuthData";
export async function GetAcademicAction(){
  const session = await getAuthData();
 if( !session?.django.access){
    return {ok:false,payload:null}
 } 
   const res= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/academic-years/`, {
      method: "GET",
    });
    const payload = await res.json();
      return {    payload,
    ok: res.ok,}
};
