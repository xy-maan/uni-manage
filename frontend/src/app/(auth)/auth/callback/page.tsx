'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { saveTokens } from '@/lib/cookies';
import { GetUserStatus } from '@/Actions/status.action';
export default function AuthCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (status === 'loading') return;
  //   if (!session?.djangoAccess) {
  //     router.push('/login');
  //     return;
  //   }
  //   handleCallback();
  // }, [session, status]);
const hasRun = useRef(false);
  useEffect(() => {
    if (status === 'loading') return;

    if (hasRun.current) return; 
    hasRun.current = true;

    if (!session?.djangoAccess) {
      router.push('/login');
      return;
    }

    handleCallback();
  }, [session, status]);
  async function handleCallback()  {
    await saveTokens(session!.djangoAccess!, session!.djangoRefresh!);
    try{
const {payload,ok}=await GetUserStatus(session!.djangoAccess!)
    if (ok) {
      if (payload.is_complete) {
          router.push(`/${payload.role.toLowerCase()}/dashboard`);
      } else {
        router.push('/complete-profile');
      }
    }
    else{
          router.push("/login?error=invalid_token");
    }
    }
    catch (error) {
			router.push('/login?error=network_error');
		}

  };

  return ;
}