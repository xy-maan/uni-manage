// "use client";
// import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";
// import Link from "next/link";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { usePathname } from "next/navigation";
// import { signOut, useSession } from "next-auth/react";
// import { logoutFromBackend } from "@/Actions/logout.action";
//  const navList: { path: string; content: string; isLogin: boolean }[] = [
//     { path: "/", content: "Home", isLogin: false },
//     { path: "/features", content: "Features", isLogin: false },
//     { path: "/work", content: "How it Works", isLogin: false },
//     { path: "/access", content: "Access", isLogin: false },
//   ];
// export default function Navbar() {
// //   const { data: session } = useSession(); // الحصول على الجلسة التي تحتوي التوكنات
// // console.log(session);

// //   async function onLogoutClick() {
// //     // 1. الحصول على التوكنات من الجلسة (التي خزنها NextAuth في الـ Callback)
// //     const accessToken = session?.backendTokens?.access_token;
// //     const refreshToken = session?.backendTokens?.refresh_token;

// //     if (accessToken && refreshToken) {
// //       await logoutFromBackend(accessToken, refreshToken);
// //     }
// //     await signOut({ callbackUrl: "/login" });
// //   }
//   const { theme, setTheme } = useTheme();
//   const [isOpenMenu, setIsOpenMenu] = useState(false);
//   const pathName=usePathname()
  
//   return (
//     <>
//       <nav className="sticky w-full z-20  bg-background/95  top-0 left-0 text-muted-foreground border-b dark:border-gray-700 border-gray-300 ">
//         <div className="container  h-16 lg:px-8 mx-auto flex justify-between items-center  px-4 py-4 ">
//           <Link
//             href="/"
//             className="flex justify-start items-center space-x-3 rtl:space-x-reverse"
//           >
//             <span className="self-center  text-heading  whitespace-nowrap bg-linear-to-r text-2xl from-primary to-secondary bg-clip-text text-transparent font-bold">
//               UniManage
//             </span>
//           </Link>

    
//           <ul className="md:flex hidden font-medium p-4 md:p-0 mt-4  rounded-base md:space-x-8 rtl:space-x-reverse md:flex-row md:justify-between md:mt-0 md:border-0 ">
//            <li>
//               <Link
//                 href="/"
//                 className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors  rounded md:bg-transparent md:p-0"
//                 aria-current="page"
//               >
//               Home
//               </Link>
//             </li>
            
//             <li>
//               <Link
//                 href="#"
//                 className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors  rounded md:bg-transparent md:p-0"
//                 aria-current="page"
//               >
//                 Features
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="#"
//                 className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors  rounded md:bg-transparent md:p-0"
//                 aria-current="page"
//               >
//                 How It Works
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="#"
//                 className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors  rounded md:bg-transparent md:p-0"
//                 aria-current="page"
//               >
//                 Access
//               </Link>
//             </li>
//           </ul>
//           <ul className="md:flex hidden  items-center justify-center font-medium p-4 md:p-0 mt-4 rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:justify-between md:mt-0 md:border-0 md:bg-neutral-primary">
//               <li>
//                 {theme === "light" ? (
//                   <Moon
//                     onClick={() => setTheme("dark")}
//                     className="cursor-pointer size-5 text-black"
//                   />
//                 ) : (
//                   <Sun
//                     onClick={() => setTheme("light")}
//                     className="cursor-pointer size-5 "
//                   />
//                 )}
//               </li>     
//     <li>
//               <DropdownMenu>
//   <DropdownMenuTrigger asChild className="" >
//   <div className="flex items-center justify-center gap-1">
//      <span className="cursor-pointer text-sm text-foreground">
//       Sign In
//     </span>
//      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 mt-1 text-foreground"><path d="m6 9 6 6 6-6"></path></svg>
//   </div>
//   </DropdownMenuTrigger>
//       <button className="text-red-500">
//       Logout
//     </button>
//   <DropdownMenuContent  align="end"
//   sideOffset={8}
//   className="w-64">
//     <DropdownMenuGroup>
//       <DropdownMenuLabel>Choose Your Role</DropdownMenuLabel>
//     </DropdownMenuGroup>
//     <DropdownMenuGroup>
//       <DropdownMenuSeparator />
//       <DropdownMenuItem asChild  className="px-2">
//         <Link href="/login">
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap h-4 w-4 mr-2"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
//         <span>Student / Supervisor</span>
//         </Link>
//       </DropdownMenuItem>
//       <DropdownMenuItem asChild>
//         <Link href="/login">
//       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 h-4 w-4 mr-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
//         <span>Organization</span>
//         </Link>
//       </DropdownMenuItem>
//     </DropdownMenuGroup>
//   </DropdownMenuContent>
// </DropdownMenu>
//     </li>
//        <li>
//               <DropdownMenu>
//   <DropdownMenuTrigger asChild className="" >
//   <div className="flex items-center justify-center gap-1 bg-primary px-3 py-2 rounded-md text-sm">
//      <span className="cursor-pointer text-sm text-primary-foreground ">
//       Get Started
//     </span>
//      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 mt-1 text-primary-foreground"><path d="m6 9 6 6 6-6"></path></svg>
//   </div>
//   </DropdownMenuTrigger>
//   <DropdownMenuContent  align="end"
//   sideOffset={8}
//   className="w-64">
//     <DropdownMenuGroup>
//       <DropdownMenuLabel>Join as...</DropdownMenuLabel>
//     </DropdownMenuGroup>
//     <DropdownMenuGroup>
//       <DropdownMenuSeparator />
//       <DropdownMenuItem className="px-2" asChild>
//       <Link href="/login/student"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap h-4 w-4"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
//         <span>Student</span></Link>
//       </DropdownMenuItem>
//       <DropdownMenuItem asChild>
// <Link href="/login/supervisor">
//      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
//         <span>Supervisor</span>
// </Link>
//       </DropdownMenuItem>
//       <DropdownMenuItem>
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 h-4 w-4"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
//         <span>Organization</span>
//       </DropdownMenuItem>
//     </DropdownMenuGroup>
//   </DropdownMenuContent>
// </DropdownMenu>
//     </li>
//           </ul>
//                 <button
//             onClick={() => setIsOpenMenu(!isOpenMenu)}
//             type="button"
//             className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-0 focus:ring-neutral-tertiary"
//           >
//             <span className="sr-only">Open main menu</span>
//             {isOpenMenu? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-5 w-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>: <svg
//               className="w-6 h-6"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               width={24}
//               height={24}
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeWidth={2}
//                 d="M5 7h14M5 12h14M5 17h14"
//               />
//             </svg>}
           
//           </button>
//         </div>
//         {/* mobile */}
//         <div className={`${isOpenMenu ? "block p-4" : "hidden"} md:hidden absolute left-0 top-full bg-background min-h-screen border-t  w-full`}>
//     <ul className="flex flex-col font-medium  space-y-2 bg-neutral-secondary-soft  w-full">
//       <li><Link href="/" className="px-4 py-2 mb-3 block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Home</Link></li>
//       <li><Link href="#" className="px-4 py-2 mb-3 block  w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Features</Link></li>
//       <li><Link href="#" className="px-4 py-2 mb-3 block  w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">How It Works</Link></li>
//       <li><Link href="#" className="px-4 py-2 mb-3 block  w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Access</Link></li>
//       <li className="px-4 py-2 mb-3  w-full block text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
//         {theme === "light" ? (
//           <Moon onClick={() => setTheme("dark")} className="cursor-pointer size-5 text-black" />
//         ) : (
//           <Sun onClick={() => setTheme("light")} className="cursor-pointer size-5" />
//         )}
//       </li>
//     </ul> 


//             <div className="py-2 mb-3 ">

//                        <div className="  block w-full text-left text-sm font-medium text-muted-foreground">
//      <p className=" text-xs text-muted-foreground px-4 mb-2">
//       Sign In
//     </p>
//  <div className="mb-3">
//    <div className="flex gap-2 items-center justify-start px-3 py-2 mb-2  bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-lg text-sm font-medium border h-9 w-full">
//        <Link href="/login">
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap h-4 w-4 "><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
//         <span>Student / Supervisor</span>
//        </Link>
//    </div>
//       <div className="flex gap-2 items-center justify-start  px-3 py-2   bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-lg text-sm font-medium border h-9 w-full">

//        <Link href="/login">
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 h-4 w-4 "><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
//         <span>Organization</span>
//        </Link>
//       </div>
//  </div>
//                      </div>
                     
//                      <div className="  mb-3 block w-full text-left text-sm font-medium text-muted-foreground">
//      <p className=" text-xs text-muted-foreground px-4 mb-2">
//      Get Started
//     </p>
//  <div className="">
//    <div className="flex gap-2 items-center justify-start px-3 py-2 text-sm font-medium  mb-3 bg-primary hover:bg-primary/90 hover:text-foreground  rounded-lg text-foreground">
//     <Link href="/login/student">
//            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap h-4 w-4"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
//         <span>Student</span>
//     </Link>
//    </div>
//       <div className="flex gap-2 items-center justify-start  px-3 py-2 text-sm font-medium mb-3 bg-primary hover:text-foreground hover:bg-primary/90 rounded-lg text-foreground">
//              <Link href="/login/supervisor">
//             < svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
           
//         <span>Supervisor</span>
//              </Link>
//       </div>
//         <div className="flex gap-2 items-center justify-start  px-3 py-2 text-sm font-medium mb-3 bg-primary hover:text-foreground hover:bg-primary/90 rounded-lg text-foreground">
//    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 h-4 w-4"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
//         <span>Organization</span>
//       </div>
//  </div>
//                      </div>
//             </div>
//   </div>
//       </nav>
//     </>
//   );
// }
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { logoutHandle } from "@/Actions/logout.action";
import { clearTokens } from "@/lib/cookies";
import { toast } from "sonner";
 const navList: { path: string; content: string; isLogin: boolean }[] = [
    { path: "/", content: "Home", isLogin: false },
    { path: "/features", content: "Features", isLogin: false },
    { path: "/work", content: "How it Works", isLogin: false },
    { path: "/access", content: "Access", isLogin: false },
  ];
export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const pathName=usePathname()
  const router = useRouter();
const { mutate } = useMutation({
  mutationFn: logoutHandle,
  onSuccess: () => {
     toast.success('Login successful!', { position: 'top-center', duration: 2000 });
    router.push('/login');
  },
  onError: (error:any) => {
     toast.error(error.message, { position: 'top-center', duration: 2000 });
  },
});
  
  return (
    <>
      <nav className="sticky w-full z-20  bg-background/95  top-0 left-0 text-muted-foreground border-b dark:border-gray-700 border-gray-300 ">
        <div className="container  h-16 lg:px-8 mx-auto flex justify-between items-center  px-4 py-4 ">
          <Link
            href="/"
            className="flex justify-start items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center  text-heading  whitespace-nowrap bg-linear-to-r text-2xl from-primary to-secondary bg-clip-text text-transparent font-bold">
              UniManage
            </span>
          </Link>

    
          <ul className="md:flex hidden font-medium p-4 md:p-0 mt-4  rounded-base md:space-x-8 rtl:space-x-reverse md:flex-row md:justify-between md:mt-0 md:border-0 ">
           <li>
              <Link
                href="/"
                className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors  rounded md:bg-transparent md:p-0"
                aria-current="page"
              >
              Home
              </Link>
            </li>
            
            <li>
              <Link
                href="#"
                className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors  rounded md:bg-transparent md:p-0"
                aria-current="page"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors  rounded md:bg-transparent md:p-0"
                aria-current="page"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors  rounded md:bg-transparent md:p-0"
                aria-current="page"
              >
                Access
              </Link>
            </li>
          </ul>
          <ul className="md:flex hidden  items-center justify-center font-medium p-4 md:p-0 mt-4 rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:justify-between md:mt-0 md:border-0 md:bg-neutral-primary">
              <li>
                {theme === "light" ? (
                  <Moon
                    onClick={() => setTheme("dark")}
                    className="cursor-pointer size-5 text-black"
                  />
                ) : (
                  <Sun
                    onClick={() => setTheme("light")}
                    className="cursor-pointer size-5 "
                  />
                )}
              </li>     
    <li>
              <DropdownMenu>
  <DropdownMenuTrigger asChild className="" >
  <div className="flex items-center justify-center gap-1">
     <span className="cursor-pointer text-sm text-foreground">
      Sign In
    </span>
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 mt-1 text-foreground"><path d="m6 9 6 6 6-6"></path></svg>
  </div>
  </DropdownMenuTrigger>
      <button className="text-red-500" onClick={() => mutate()}>
      Logout
    </button>
  <DropdownMenuContent  align="end"
  sideOffset={8}
  className="w-64">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Choose Your Role</DropdownMenuLabel>
    </DropdownMenuGroup>
    <DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild  className="px-2">
        <Link href="/login">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap h-4 w-4 mr-2"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
        <span>Student / Supervisor</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/login">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 h-4 w-4 mr-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
        <span>Organization</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
    </li>
       <li>
              <DropdownMenu>
  <DropdownMenuTrigger asChild className="" >
  <div className="flex items-center justify-center gap-1 bg-primary px-3 py-2 rounded-md text-sm">
     <span className="cursor-pointer text-sm text-primary-foreground ">
      Get Started
    </span>
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 mt-1 text-primary-foreground"><path d="m6 9 6 6 6-6"></path></svg>
  </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent  align="end"
  sideOffset={8}
  className="w-64">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Join as...</DropdownMenuLabel>
    </DropdownMenuGroup>
    <DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="px-2" asChild>
      <Link href="/login/student"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap h-4 w-4"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
        <span>Student</span></Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
<Link href="/login/supervisor">
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
        <span>Supervisor</span>
</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 h-4 w-4"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
        <span>Organization</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
    </li>
          </ul>
                <button
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-0 focus:ring-neutral-tertiary"
          >
            <span className="sr-only">Open main menu</span>
            {isOpenMenu? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-5 w-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>: <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={2}
                d="M5 7h14M5 12h14M5 17h14"
              />
            </svg>}
           
          </button>
        </div>
        {/* mobile */}
        <div className={`${isOpenMenu ? "block p-4" : "hidden"} md:hidden absolute left-0 top-full bg-background min-h-screen border-t  w-full`}>
    <ul className="flex flex-col font-medium  space-y-2 bg-neutral-secondary-soft  w-full">
      <li><Link href="/" className="px-4 py-2 mb-3 block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Home</Link></li>
      <li><Link href="#" className="px-4 py-2 mb-3 block  w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Features</Link></li>
      <li><Link href="#" className="px-4 py-2 mb-3 block  w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">How It Works</Link></li>
      <li><Link href="#" className="px-4 py-2 mb-3 block  w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Access</Link></li>
      <li className="px-4 py-2 mb-3  w-full block text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
        {theme === "light" ? (
          <Moon onClick={() => setTheme("dark")} className="cursor-pointer size-5 text-black" />
        ) : (
          <Sun onClick={() => setTheme("light")} className="cursor-pointer size-5" />
        )}
      </li>
    </ul> 


            <div className="py-2 mb-3 ">

                       <div className="  block w-full text-left text-sm font-medium text-muted-foreground">
     <p className=" text-xs text-muted-foreground px-4 mb-2">
      Sign In
    </p>
 <div className="mb-3">
   <div className="flex gap-2 items-center justify-start px-3 py-2 mb-2  bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-lg text-sm font-medium border h-9 w-full">
       <Link href="/login">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap h-4 w-4 "><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
        <span>Student / Supervisor</span>
       </Link>
   </div>
      <div className="flex gap-2 items-center justify-start  px-3 py-2   bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-lg text-sm font-medium border h-9 w-full">

       <Link href="/login">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 h-4 w-4 "><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
        <span>Organization</span>
       </Link>
      </div>
 </div>
                     </div>
                     
                     <div className="  mb-3 block w-full text-left text-sm font-medium text-muted-foreground">
     <p className=" text-xs text-muted-foreground px-4 mb-2">
     Get Started
    </p>
 <div className="">
   <div className="flex gap-2 items-center justify-start px-3 py-2 text-sm font-medium  mb-3 bg-primary hover:bg-primary/90 hover:text-foreground  rounded-lg text-foreground">
    <Link href="/login/student">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap h-4 w-4"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
        <span>Student</span>
    </Link>
   </div>
      <div className="flex gap-2 items-center justify-start  px-3 py-2 text-sm font-medium mb-3 bg-primary hover:text-foreground hover:bg-primary/90 rounded-lg text-foreground">
             <Link href="/login/supervisor">
            < svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
           
        <span>Supervisor</span>
             </Link>
      </div>
        <div className="flex gap-2 items-center justify-start  px-3 py-2 text-sm font-medium mb-3 bg-primary hover:text-foreground hover:bg-primary/90 rounded-lg text-foreground">
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 h-4 w-4"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
        <span>Organization</span>
      </div>
 </div>
                     </div>
            </div>
  </div>
      </nav>
    </>
  );
}
