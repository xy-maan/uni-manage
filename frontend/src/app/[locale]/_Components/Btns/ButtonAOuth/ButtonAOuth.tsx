"use client";
import React, {  useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";
export default function ButtonAOuth() {
  const [loading, setLoading] = useState(false);
  const t=useTranslations('login')
 async function handleLogin() {

    if (loading) return;
  setLoading(true);
    await signIn("google", {
      callbackUrl: "/",
    });
  }
  return (
    <>
      <Button
       disabled={loading}
        className="flex items-center gap-3 justify-center px-4 py-2 bg-(--input)/30 border-2 border-auth w-full rounded-md h-11 mb-2 cursor-pointer hover:bg-(--muted)/50 font-medium text-sm"
        onClick={() => handleLogin()}
      >
       { !loading &&
       <FcGoogle className="size-5" />
     
       }
      
        <span className="text-foreground font-medium">
         {loading ?  <div className="w-4 h-4 border-2 border-foreground  border-t-transparent rounded-full animate-spin"></div>:   t("button")}
        </span>
      </Button>
    </>
  );
}
