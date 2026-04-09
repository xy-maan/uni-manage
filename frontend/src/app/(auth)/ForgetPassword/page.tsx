import ForgetPasswordForm from '@/app/_Components/Auth/Forms/ForgetPasswordForm/ForgetPasswordForm'
import React from 'react'
import Link  from 'next/link';

export default function ForgetPassword() {
  return (
  <>
     <div className=" w-full max-w-md  min-h-[88vh]  mt-6">
      <div className="lg:w-full  md:w-3/4 w-full mx-auto bg-card flex flex-col items-start justify-start rounded-xl border border-border ">
        <div className="w-full gap-6 flex flex-col ">
          <div className="flex flex-col items-start px-6 pt-6 gap-1.5 ">
            <h4 className="text-foreground ">Forgot Password</h4>
            <p className="text-muted-foreground">
          We'll send you an email with instructions to reset your password
            </p>
          </div>
             <div className="px-6 pb-6">

          <ForgetPasswordForm/>
             </div>
        </div>
      </div>
      <div className="mt-6">
          <Link href="/login" className='flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 gap-3'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left mt-px h-4 w-4"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
        Back To Sign In
        </Link>
      </div>
      <div className="mt-6">
          <p className="text-center text-sm text-muted-foreground ">Remember your password?<Link  href={`/login`}>
         
   <span className='text-primary hover:underline font-medium'> Sign In</span></Link></p>
        </div>
      
    </div>
  </>
  )
}
