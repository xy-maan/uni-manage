import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server' 
export async function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
   if(token){
    if(request.nextUrl.pathname==="/login"){
      return NextResponse.redirect(new URL('/', request.url))
    }
    else{
      return NextResponse.next()
    }
   }
   else{
    if(request.nextUrl.pathname==="/student/dashboard"){
       return NextResponse.redirect(new URL('/login', request.url))
    }
    else{
      return NextResponse.next()
    }
   }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher:['/student/dashboard','/login','/']
}