'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveTokens } from '@/lib/cookies';
import { GetUserStatus } from '@/Actions/auth.action';
import { toast } from 'sonner';
export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      if (accessToken && refreshToken) {
        await saveTokens(accessToken, refreshToken);
        await handleUserNavigate(accessToken);
      } else {
        router.push('/login?error=no_tokens');
      }
    };
    run();
  }, [searchParams, router]);
  async function handleUserNavigate(accessToken:string){

    const {payload,ok}=await GetUserStatus(accessToken);
      if (ok) {
    console.log(payload);
 toast.success('Login successful!', { position: 'top-center', duration: 2000 });
     if (payload.is_complete) {
          router.push(payload.role === 'STUDENT' ? '/student/dashboard' : '/supervisor/dashboard');
        } else {
          router.push('/complete-profile');
        }
      }
     else {
        router.push('/login?error=invalid_token');
        //  toast.error(res.error, { position: 'top-center', duration: 2000 });
      }
      }
  return (
    <div>
      <p>Loadinggggggggggg</p>
    </div>
  );
}