"use client"
import { getAccessToken } from "@/lib/cookies";
import React, { Children, createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
type TokenContextType = {
  token: string | null
  setToken: Dispatch<SetStateAction<string | null>>
  AuthLoading:boolean
  setAuthLoading: Dispatch<SetStateAction<boolean>>

}
export const AuthContext = createContext<TokenContextType | null>(null)
export default function TokenContextProvider({ children }: { children: React.ReactNode }) {
const [token, setToken] = useState<string | null>(null);
const [AuthLoading, setAuthLoading] = useState(true);
  useEffect(() => {
     async function checkAuth() {
        const myToken = await getAccessToken()
        setToken(myToken??null)
        setAuthLoading(false)
      }
       checkAuth();
  }, []);
 
  return (
    <AuthContext.Provider value={{ token, setToken,AuthLoading,setAuthLoading}}>
      {children}
    </AuthContext.Provider>
  );
}
