"use client"
import React from 'react'
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { saveTokens } from '@/lib/cookies';
// import { handleSignInGoogle } from '@/Actions/auth.action';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner'
export default  function ButtonAOuth() {
const router = useRouter();

// const { mutate, isPending } = useMutation({
//   mutationFn: handleSignInGoogle,
//   onSuccess: (res) => {
//     if (!res.ok) {
//       toast.error(res.error, { position: 'top-center', duration: 2000 });
//       return;
//     }
//     toast.success('Login successful!', { position: 'top-center', duration: 2000 });
//     router.push('/complete-profile');
//   },
//   onError: (error:any) => {
//     toast.error(error.message, { position: 'top-center', duration: 2000 });
//   },
// });

// const login = useGoogleLogin({
//   onSuccess: (tokenResponse) => {
//     mutate({ access_token: tokenResponse.access_token }); 
//   },
//   onError: (error) => console.error(error),
// });

// const handleLogin = () => {
//   const width = 500, height = 600;
//   const left = window.screenX + (window.outerWidth - width) / 2;
//   const top = window.screenY + (window.outerHeight - height) / 2;
//   window.open(
//     'http://localhost:8000/api/users/auth/google/',
//     'google-login',
//     `width=${width},height=${height},left=${left},top=${top}`
//   );
// };
	const handleLogin = () => {
		window.location.href = 'http://localhost:8000/api/users/auth/google/';
	};

  return (
    <>
      <Button className="flex items-center gap-3 justify-center px-4 py-2 bg-(--input)/30 border-2 border-auth w-full rounded-md h-11 mb-2 cursor-pointer hover:bg-(--muted)/50 font-medium text-sm"     onClick={() => handleLogin()}    >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z"
                    fill="#EA4335"
                  />
                </svg>
                <span 
        className="text-foreground font-medium">
                  Continue with Google
                </span>
              </Button>
           
    </>
  )
}
