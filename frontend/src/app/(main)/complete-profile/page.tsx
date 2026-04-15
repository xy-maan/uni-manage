"use client"
import { GetUserStatus } from '@/Actions/status.action'
import FormStudent from '@/app/_Components/Auth/Forms/FormStudent/FormStudent'
import FormSupervisor from '@/app/_Components/Auth/Forms/FormSupervisor/FormSupervisor'
import RoleSwitcher from '@/app/_Components/Auth/RoleSwitcher/RoleSwitcher'
import { getAccessToken } from '@/lib/cookies'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

export default function page() {
  const [role, setRole] = useState<string | null>(null);
  // const session= useSession()
  // console.log(session);
 async function getRole(){
  const token =await getAccessToken()
  
  const { payload }= await GetUserStatus(token)
  console.log(payload.role);
  setRole(payload.role)
 }
 useEffect(() => {
  getRole()
 }, [])
 
  return <div className="w-full max-w-md mt-8 min-h-[88vh] ">
      <div className="lg:w-full  md:w-3/4 w-full mx-auto bg-card flex flex-col items-start justify-start rounded-xl border border-border ">
        <div className="w-full gap-6  ">
          <div className=" px-6 pt-6 gap-1.5">
          <div className="flex items-center justify-center">  <h4 className="text-foreground text-center "> Please Complete Your Profile</h4></div>
            <div className="border-b border-input mt-5"></div>

          </div>
<div className="px-6 pb-6">
{role=="STUDENT"&&<FormStudent/>}
{role=="SUPERVISOR"&&<FormSupervisor/>}
</div>
  </div>
  </div>
  </div>
}
