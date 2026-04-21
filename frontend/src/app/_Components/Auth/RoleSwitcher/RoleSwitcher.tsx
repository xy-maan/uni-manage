"use client";
import React, { useEffect, useState } from "react";
import RegisterStudent from "../Forms/FormStudent/FormStudent";
// import RegisterSupervisor from "../Forms/RegisterSupervisor/RegisterSupervisor";
import { useRouter } from "next/navigation";

import Link from "next/link";

export default function RoleSwitcher({ role }: { role: string }) {
  const router = useRouter();
  // console.log(router.push);
  return (
    <div className="">
      <div className="bg-muted rounded-2xl h-9 flex items-center justify-between p-0.75 mb-6 text-muted-foreground">
        <span
          className={`flex items-center justify-center w-1/2 cursor-pointer"   
            ${role === "STUDENT" ? "text-foreground" : "text-muted-foreground"}`}
        >
          <span className="text-sm ">Student</span>
        </span>
        <span
          className={`flex items-center justify-center w-1/2 cursor-pointer"   
              ${
                role === "SUPERVISOR"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
        >
          <span className="text-sm cursor-pointer">Supervisor</span>
        </span>
      </div>
      <>
        {role === "STUDENT" && <RegisterStudent />}
        {/* {role === "SUPERVISOR" && <RegisterSupervisor />} */}
      </>
    </div>
  );
}
