import { Button } from "@radix-ui/themes";
import React from "react";
import Link from "next/link";
import ButtonAOuth from "@/app/_Components/Auth/ButtonAOuth/ButtonAOuth";
import RoleSwitcher from "../../_Components/Auth/RoleSwitcher/RoleSwitcher";
import { roleType } from "../login/page";

export default function RegisterPage({ role = 'student' }:  roleType) {
  return (
    <div className=" w-full max-w-2xl flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h2 className="font-bold mb-2 mt-4 text-2xl">Create Your Account</h2>
        <p className="mb-1 text-muted-foreground">
          Join thousands of students managing their projects
        </p>
        <p className="text-muted-foreground italic text-sm">
          UniManage — Manage Your Uni Life
        </p>
      </div>
      <div className="lg:w-full md:w-3/4 w-full mx-auto bg-card flex flex-col items-start justify-start rounded-xl border border-border ">
        <div className="w-full gap-6 flex flex-col">
          <div className="flex flex-col items-start px-6 pt-6 gap-1.5">
            <h4 className="text-foreground ">Sign Up</h4>
            <p className="text-muted-foreground">
              Choose your account type to get started
            </p>
          </div>
          <div className="px-6">
            <div className="mb-6 ">
        <ButtonAOuth/>
            </div>
            <div className="mb-6 relative">
              <div className="absolute inset-0 flex items-center ">
                <div className="bg-border  w-full h-px "></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-muted-foreground text-xs uppercase">
                  Or sign up with email
                </span>
              </div>
            </div>
            <RoleSwitcher mode="register"  role={role}/>
          </div>
        </div>
      </div>
        <div className="mt-6">
          <p className="text-center text-sm text-muted-foreground ">Already have an account?<Link href={`/login/${role}`}>
   <span className='text-primary hover:underline font-medium'> Sign in</span></Link></p>
        </div>
      
    </div>
    
  );
}
