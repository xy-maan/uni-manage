'use client';
import { Link } from '@/i18n/navigation';;
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
export default function AuthError() {
	const searchParams = useSearchParams();
	const error = searchParams.get('error');
const router = useRouter();
	const errorMessages: Record<string, string> = {
		access_denied: 'You denied access to your Google account.',
		no_code: 'No authorization code received from Google.',
		network_error: 'Network error occurred. Please try again.',
		login_failed: 'Failed to create your account. Please try again.',
        invalid_email: 'You must use a university email (.edu.eg) to register.',
		default: 'An error occurred during authentication.',
		// OAuthSignin: "Failed to sign in with Google. Please try again.",
        // OAuthCallback: "Failed to complete Google sign in. Please try again.",
		// session_expired:"Your session has expired. Please login again to continue."
	};

	  const message = error ? (errorMessages[error] || errorMessages["default"]) : null;
	    useEffect(() => {
    if (!error) return;
    toast.error(message, { position: "top-center", duration: 4000 });
    router.replace("/login");
  }, [error]);
  
	return  null
}	

