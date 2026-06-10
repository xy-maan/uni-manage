// import ButtonAOuth from '@/app/_Components/Auth/ButtonAOuth/ButtonAOuth'
// import RoleSwitcher from '@/app/_Components/Auth/RoleSwitcher/RoleSwitcher'
import React from 'react'
import AuthError from '../auth/error/page'
import ButtonAOuth from '../../_Components/Auth/ButtonAOuth/ButtonAOuth'
import { useTranslations } from "next-intl";
export type roleType={
    role?:string
}
export default function LoginPage({ role = 'student' }:  roleType ) {
    const t=useTranslations('login')
  return (
      <div className=" w-full max-w-md mt-8 min-h-[88vh] ">
      <div className="lg:w-full  md:w-3/4 w-full mx-auto bg-card flex flex-col items-start justify-start rounded-xl border border-border ">
        <div className="w-full gap-6 flex flex-col ">
          <div className="flex flex-col items-start px-6 pt-6 gap-1.5 ">
            <h4 className="text-foreground ">{t("title")}</h4>
          </div>
          <div className="px-6 pb-6">
             <AuthError /> 
                 {/* <RoleSwitcher mode="login" role={role} /> */}
              <div className="mb-4 relative">
              <div className="absolute inset-0 flex items-center ">
                <div className="bg-border  w-full h-px "></div>
              </div>
            </div>
            <div className="">
             <ButtonAOuth/>
            </div>
            
          </div>
        </div>
      </div>
        {/* <div className="mt-6">
          <p className="text-center text-sm text-muted-foreground ">Already have an account?<Link  href={`/register/${role}`}>
         
   <span className='text-primary hover:underline font-medium'>Sign Up</span></Link></p>
        </div> */}

    </div>
    )
}
