"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SessionWatcher() {
  const { data: session,update } = useSession();
  useEffect(() => {
      if (
          session?.error === "SessionExpired" ||
          session?.error === "RefreshAccessTokenError" ||
          session?.error === "NoRefreshToken"
        ) {
    signOut({ callbackUrl: "/login", redirect: false }).then(() => {
       window.location.href = "/login";
    });
  }
}, [session])
    
    return null;
}