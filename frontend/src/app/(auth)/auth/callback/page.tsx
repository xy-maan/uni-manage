'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef } from 'react';
// import { saveTokens } from '@/lib/cookies';
import { GetUserStatus } from '@/Actions/status.action';
import { UserContext } from '@/app/Providers/UserDataContext';
export default function AuthCallback() {
const context=useContext(UserContext)
if(!context){
  throw new Error("Not Exit")
}

const  { setLoading, setUser }=context
  const { data: session, status } = useSession();
  const router = useRouter();

  
const hasRun = useRef(false);

useEffect(() => {
    if (status == "loading") return;

    if (status == "unauthenticated") {
      router.push("/login");
      return;
    }


    if (status !== "authenticated") return;
    if (!session?.djangoAccess) return;

    if (hasRun.current) return;
    hasRun.current = true;

    handleCallback();
  }, [status, session?.djangoAccess]);
  async function handleCallback()  {
    try{
const {payload,ok}=await GetUserStatus(session!.djangoAccess!)
    setUser(payload);
    setLoading(false);
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

  return null;
}
// useEffect(() => {
  //   if (status == 'loading') return;
  //   if (!session?.djangoAccess) {
  //     router.push('/login');
  //     return;
  //   }
  //   handleCallback();
  // }, [session, status]);
  //  useEffect(() => {
//   if (status == 'loading') return;
//   if (!session) { router.push('/login'); return; }
//   if (!session.djangoAccess) { router.push('/login?error=no_token'); return; }
//   if (hasRun.current) return;
//   hasRun.current = true;
//   handleCallback();
// }, [status, session?.djangoAccess]);