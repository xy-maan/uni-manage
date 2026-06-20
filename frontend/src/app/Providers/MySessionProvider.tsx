"use client"
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
import SessionWatcher from './SessionWatcher'
import { Session } from 'next-auth';
export default function MySessionProvider({children,  session}:{children:ReactNode; session: Session | null;}) {
  return <>
  <SessionProvider   refetchInterval={5*60}
      refetchOnWindowFocus={true}    session={session}>
         <SessionWatcher/>
{children}
  </SessionProvider>
  </>
}
