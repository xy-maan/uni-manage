"use client";
import React, { useEffect, useState } from "react";
import RegisterStudent from "../Forms/RegisterForms/RegisterStudent/RegisterStudent";
import RegisterSupervisor from "../Forms/RegisterForms/RegisterSupervisor/RegisterSupervisor";
import { useRouter } from "next/navigation";
import SupervisorLoginForm from './../Forms/LoginForms/SupervisorLoginForm/SupervisorLoginForm';
import StudentLoginForm from './../Forms/LoginForms/StudentLoginForm/StudentLoginForm';
import Link from "next/link";

export default function RoleSwitcher({
  mode,
  role,
}: {
  mode: "login" | "register";
  role: string;
}) {
  const router = useRouter();
  // console.log(router.push);
  
  return (
    <div className="">
      <div className="bg-muted rounded-2xl h-9 flex items-center justify-between p-0.75 mb-6 text-muted-foreground">
        <Link
  href={`/${mode}/student`}
          className={`flex items-center justify-center w-1/2 cursor-pointer"   
            ${role === "student" ? "text-foreground" : "text-muted-foreground"}`}
        >
          <span className="text-sm ">Student</span>
            
</Link>
        <Link
        href={`/${mode}/supervisor`}
          className={`flex items-center justify-center w-1/2 cursor-pointer"   
              ${
                role === "supervisor"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}        >
          <span className="text-sm cursor-pointer">Supervisor</span>
        </Link>
      </div>
      {mode === "register" && (
        <>
          {role === "student" && <RegisterStudent />}
          {role === "supervisor" && <RegisterSupervisor />}
        </>
      )}
      {mode === "login" && (
        <>
          {role === "student" && <StudentLoginForm />}
          {role === "supervisor" && <SupervisorLoginForm />}
        </>
      )}
    </div>
  );
}

