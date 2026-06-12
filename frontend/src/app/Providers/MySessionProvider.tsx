"use client"
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
import SessionWatcher from './SessionWatcher'
export default function MySessionProvider({children}:{children:ReactNode}) {
  return <>
  <SessionProvider   refetchInterval={10}
      refetchOnWindowFocus={true}>
         <SessionWatcher/>
{children}
  </SessionProvider>
  </>
}
