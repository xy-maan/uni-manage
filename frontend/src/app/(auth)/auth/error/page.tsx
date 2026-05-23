'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export default function AuthError() {
	const searchParams = useSearchParams();
	const error = searchParams.get('error');

	const errorMessages: Record<string, string> = {
		access_denied: 'You denied access to your Google account.',
		no_code: 'No authorization code received from Google.',
		network_error: 'Network error occurred. Please try again.',
		login_failed: 'Failed to create your account. Please try again.',
        invalid_email: 'You must use a university email (.edu.eg) to register.',
		default: 'An error occurred during authentication.',
		OAuthSignin: "Failed to sign in with Google. Please try again.",
        OAuthCallback: "Failed to complete Google sign in. Please try again.",
		session_expired:"Your session has expired. Please login again to continue."
	};

	// const message = errorMessages[error || ''] || errorMessages['default'];
	  const message = error ? (errorMessages[error] || errorMessages["default"]) : null;
	return (
	<>
	{message && ( <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive mb-4">
      {message}
    </div>
)
}
</>
)}	
		// <div className=' mt-8  max-w-md min-h-[88vh] w-full'>
	// 		<div className="flex flex-col  lg:w-full  md:w-3/4 w-full p-4 bg-card mx-auto justify-center rounded-xl border border-border"> 
    //             <h1 className=' text-red-400 font-semibold my-3'>Login Error</h1> 
	// 	      {message && (
    // //     <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive mb-4">
    // //       {message}
    // //     </div>
    //    )}
	// 		<p className='text-muted-foreground text-sm'>{message}</p> 
	// 	<Link href="/login" className=''>
    //     <Button className="mt-5 bg-transparent text-foreground cursor-pointer font-medium hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 w-1/2 items-center justify-start ">	
    //     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left size-4"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
    //     Try again</Button>
    //     </Link> 
    //         </div> 
	// 	 </div>

