"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/Actions/logout.action";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { clearTokens } from "@/lib/cookies";
// import { AuthContext } from "@/app/Providers/UserDataContext";
export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const singleRole = pathname.split("/");
const role = singleRole[1]; 
const isDashboard = role === "student" || role === "supervisor";
  // handle return home againnnn
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", "/");
      window.scrollTo(0, 0);
    }
    setActiveSection("");
  }, []);
const {status,data}=useSession()
  async function handleLogout() {
    const { ok, payload } = await logoutAction();
    if (ok) {
      toast.success(payload.detail, {
        position: "top-center",
        duration: 2000,
      });
      await clearTokens();
      await signOut({
            callbackUrl:'/login'
        })
      router.push("/login");
    } else {
      toast.error(payload.detail, { position: "top-center", duration: 2000 });
    }
  }
  return (
    <>
      <nav className="sticky w-full z-20  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60  top-0 left-0 text-muted-foreground border-b dark:border-gray-700 border-gray-300 ">
        <div className="container  h-16 lg:px-8 mx-auto flex justify-between items-center  px-4 py-4 ">
          <div className="flex items-center gap-2 hover:opacity-80 transition-all">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <Link
              href="/"
              className="flex justify-start items-center space-x-3 rtl:space-x-reverse"
            >
              <span className="self-center  text-heading  whitespace-nowrap bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent text-xl font-semibold ">
                UniManage
              </span>
            </Link>
          </div>

        {isDashboard&&  <ul className="md:flex hidden font-medium p-4 md:p-0 mt-4 m-0 gap-1  rounded-base md:space-x-8 rtl:space-x-reverse md:flex-row md:justify-between md:mt-0 md:border-0 ">
            <li className="m-0 ">
              <Link
                href={`/${role}/dashboard`}
                className={`flex ${ pathname === `/${role}/dashboard`? "bg-primary/10 text-primary":" text-muted-foreground hover:text-foreground hover:bg-muted/50"}  items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm
                      
                  `}
                aria-current="page"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-layout-dashboard h-4 w-4"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
                Dashboard
              </Link>
            </li>
  <li className="m-0 ">
             <Link
                href={`/${role}/projects`}
                className={`flex ${ pathname === `/${role}/projects`? "bg-primary/10 text-primary":" text-muted-foreground hover:text-foreground hover:bg-muted/50"}  items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm
                      
                  `}
                aria-current="page"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-folder-open h-4 w-4"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path></svg>
                Projects
              </Link>
            </li>
           <li className="m-0 ">
             <Link
                href={`/${role}/marketplace`}
                className={`flex ${ pathname === `/${role}/marketplace`? "bg-primary/10 text-primary":" text-muted-foreground hover:text-foreground hover:bg-muted/50"}  items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm
                      
                  `}
                aria-current="page"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-store h-4 w-4"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path></svg>
                Marketplace
              </Link>
            </li>
     
                   <li className="m-0 ">
             <Link
                href={`/${role}/community`}
                className={`flex ${ pathname === `/${role}/community`? "bg-primary/10 text-primary":" text-muted-foreground hover:text-foreground hover:bg-muted/50"}  items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm
                      
                  `}
                aria-current="page"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square-more h-4 w-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path></svg>
                Community
              </Link>
            </li>
          </ul>}
        {!isDashboard&&  <ul className="md:flex hidden font-medium p-4 md:p-0 mt-4  rounded-base md:space-x-8 rtl:space-x-reverse md:flex-row md:justify-between md:mt-0 md:border-0 ">
            <li>
              <Link
                href="#projects"
                onClick={() => setActiveSection("projects")}
                className={`block py-2 px-3  transition-colors  rounded md:bg-transparent md:p-0 text-sm font-medium 
                  ${
                    activeSection === "projects"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  `}
                aria-current="page"
              >
                Projects
              </Link>
            </li>

            <li>
              <Link
                href="#feature"
                onClick={() => setActiveSection("Feature")}
                className={`block py-2 px-3 transition-colors  rounded md:bg-transparent md:p-0 text-sm font-medium 
                  ${
                    activeSection === "Feature"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }
                    `}
                aria-current="page"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#work"
                onClick={() => setActiveSection("work")}
                className={`block py-2 px-3  transition-colors  rounded md:bg-transparent md:p-0 text-sm font-medium 
                  ${
                    activeSection === "work"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  `}
                aria-current="page"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="#access"
                onClick={() => setActiveSection("access")}
                className={`block py-2 px-3  transition-colors  rounded md:bg-transparent md:p-0 text-sm font-medium 
                  ${
                    activeSection === "access"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  `}
                aria-current="page"
              >
                Access
              </Link>
            </li>
          </ul>}
          <ul className="md:flex hidden  gap-0   items-center justify-center font-medium p-4 md:p-0 mt-4 rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row  md:mt-0 md:border-0 md:bg-neutral-primary">
            <li className="">
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
            <li className="size-16 flex items-center justify-cente">
                  {status === "loading" ? (
    <span className="w-9 h-9 flex items-center justify-center">  <span className="loader-auth"></span></span>
  ):<>{  status == "authenticated" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="">
                    <div className="flex items-center justify-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-full border border-border">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-user size-4"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>o
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-55"
                  >
                    <DropdownMenuGroup className="gap-0">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <h2 className="font-medium">{data?.user?.name}</h2>
                          <p className="text-xs text-muted-foreground">
                            {data?.user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        asChild
                        className="px-2  hover:!bg-transparent"
                      >
                        <Link href="/">
                          <span className="flex items-center focus:bg-accent focus:text-accent-foreground gap-2 cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-circle-user size-4 mr-2"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <circle cx="12" cy="10" r="3"></circle>
                              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                            </svg>{" "}
                            Profile
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="px-2  hover:!bg-transparent"
                      >
                        <Link href="/">
                          <span className="flex items-center focus:bg-accent focus:text-accent-foreground gap-2 cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-settings size-4 mr-2"
                            >
                              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Setting
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm focus:bg-accent  hover:!bg-transparent cursor-pointer !text-destructive hover:!text-destructive focus:!text-destructive"
                        onClick={() => handleLogout()}
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
 {status=="unauthenticated"&&    <DropdownMenu>
                  <DropdownMenuTrigger asChild className="">
                    <div className="flex items-center justify-center gap-1">
                      <span className="cursor-pointer text-sm text-foreground">
                        Sign In
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-down size-4 mt-1 text-foreground"
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-64"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Choose Your Role</DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="px-2">
                        <Link href="/login">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-graduation-cap size-4 mr-2"
                          >
                            <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                            <path d="M22 10v6"></path>
                            <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                          </svg>
                          <span>Student / Supervisor</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-2">
                        <Link href="/login">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-graduation-cap size-4 mr-2"
                          >
                            <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                            <path d="M22 10v6"></path>
                            <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                          </svg>
                          <span>Admin</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/login">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-building2 lucide-building-2 size-4 mr-2"
                          >
                            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                            <path d="M10 6h4"></path>
                            <path d="M10 10h4"></path>
                            <path d="M10 14h4"></path>
                            <path d="M10 18h4"></path>
                          </svg>
                          <span>Organization</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>}</>}

            </li>
          </ul>
          <button
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-0 focus:ring-neutral-tertiary"
          >
            <span className="sr-only">Open main menu</span>
            {isOpenMenu ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x h-5 w-5"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            ) : (
              <svg
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
              </svg>
            )}
          </button>
        </div>
        {/* mobile */}
        <div
          className={`${isOpenMenu ? "block p-4" : "hidden"} md:hidden absolute left-0 top-full bg-background min-h-screen border-t  w-full`}
        >
          <ul className="flex flex-col font-medium  space-y-2 bg-neutral-secondary-soft  w-full">
      {!isDashboard&&<>
            <li>
              <Link
                href="#projects"
                onClick={() => setActiveSection("projects")}
                className={`px-4  pl-2 py-2 mb-3 block w-full text-left text-sm font-medium hover:bg-muted rounded-lg transition-colors
                  ${
                    activeSection === "projects"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  `}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="#feature"
                onClick={() => setActiveSection("feature")}
                className={`px-4  pl-2 py-2 mb-3 block w-full text-left text-sm font-medium hover:bg-muted rounded-lg transition-colors
                  ${
                    activeSection === "feature"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  `}
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#work"
                onClick={() => setActiveSection("work")}
                className={`px-4  pl-2 py-2 mb-3 block w-full text-left text-sm font-medium hover:bg-muted rounded-lg transition-colors
                  ${
                    activeSection === "work"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  `}
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="#access"
                onClick={() => setActiveSection("access")}
                className={`px-4  pl-2 py-2 mb-3 block w-full text-left text-sm font-medium hover:bg-muted rounded-lg transition-colors
                  ${
                    activeSection === "access"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  `}
              >
                Access
              </Link>
            </li>
      </>}
       {isDashboard&&<>
            <li className="flex  items-center gap-2 px-4 py-2 rounded-lg transition-all
                       font-medium">
              <Link
                href="/dashboard"
                className={`px-4  pl-2 py-2 mb-3 block w-full text-left text-sm font-medium hover:bg-muted rounded-lg transition-colors text-foreground font-semibold text-muted-foreground hover:text-foreground
                  `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-layout-dashboard h-4 w-4"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
                Dashboard
              </Link>
            </li>
            <li className="flex  items-center gap-2 px-4 py-2 rounded-lg transition-all
                       font-medium">
            <Link
                href="/projects"
                className={`px-4  pl-2 py-2 mb-3 block w-full text-left text-sm font-medium hover:bg-muted rounded-lg transition-colors text-foreground font-semibold text-muted-foreground hover:text-foreground
                  `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-folder-open h-4 w-4"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path></svg>
                Projects
              </Link>
            </li>
            <li className="flex  items-center gap-2 px-4 py-2 rounded-lg transition-all
                       font-medium">
             <Link
                href="/marketplace"
                className={`px-4  pl-2 py-2 mb-3 block w-full text-left text-sm font-medium hover:bg-muted rounded-lg transition-colors text-foreground font-semibold text-muted-foreground hover:text-foreground
                  `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-store h-4 w-4"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path></svg>
                Marketplace
              </Link>
            </li>
            <li className="flex  items-center gap-2 px-4 py-2 rounded-lg transition-all
                       font-medium">
              <Link
                href="/community"
                className={`px-4  pl-2 py-2 mb-3 block w-full text-left text-sm font-medium hover:bg-muted rounded-lg transition-colors text-foreground font-semibold text-muted-foreground hover:text-foreground
                  `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square-more h-4 w-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path></svg>
                Community
              </Link>
            </li>
      </>}
            <li className="px-4 py-2 mb-3  w-full block text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              {theme === "light" ? (
                <Moon
                  onClick={() => setTheme("dark")}
                  className="cursor-pointer size-5 text-black"
                />
              ) : (
                <Sun
                  onClick={() => setTheme("light")}
                  className="cursor-pointer size-5"
                />
              )}
            </li>
          </ul>

          <div className="py-2 mb-3 ">
            <div className="  block w-full text-left text-sm font-medium text-muted-foreground">
              <p className=" text-xs text-muted-foreground px-4 pl-0 mb-2">
                Sign In
              </p>
              <div className="mb-3">
                  <Link href="/login">
                <div className="flex gap-2 items-center justify-start px-3 py-2 mb-2  bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-lg text-sm font-medium border h-9 w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-graduation-cap size-4 "
                    >
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                      <path d="M22 10v6"></path>
                      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                    </svg>
                    <span>Student / Supervisor</span>
                </div>
                  </Link>
                  <Link href="/login">
                <div className="flex gap-2 items-center justify-start  px-3 py-2   bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-lg text-sm font-medium border h-9 w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-building2 lucide-building-2 size-4 "
                    >
                      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                      <path d="M10 6h4"></path>
                      <path d="M10 10h4"></path>
                      <path d="M10 14h4"></path>
                      <path d="M10 18h4"></path>
                    </svg>
                    <span>Organization</span>
                </div>
                  </Link>
              </div>
            </div>

            {/* <div className="  mb-3 block w-full text-left text-sm font-medium text-muted-foreground">
              <p className=" text-xs text-muted-foreground px-4 mb-2">
                Get Started
              </p>
              <div className="">
                <div className="flex gap-2 items-center justify-start px-3 py-2 text-sm font-medium  mb-3 bg-primary hover:bg-primary/90 hover:text-foreground  rounded-lg text-foreground">
                  <Link href="/login/student">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-graduation-cap size-4"
                    >
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                      <path d="M22 10v6"></path>
                      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                    </svg>
                    <span>Student</span>
                  </Link>
                </div>
                <div className="flex gap-2 items-center justify-start  px-3 py-2 text-sm font-medium mb-3 bg-primary hover:text-foreground hover:bg-primary/90 rounded-lg text-foreground">
                  <Link href="/login/supervisor">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user-check size-4"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <polyline points="16 11 18 13 22 9"></polyline>
                    </svg>

                    <span>Supervisor</span>
                  </Link>
                </div>
                <div className="flex gap-2 items-center justify-start  px-3 py-2 text-sm font-medium mb-3 bg-primary hover:text-foreground hover:bg-primary/90 rounded-lg text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-building2 lucide-building-2 size-4"
                  >
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                    <path d="M10 6h4"></path>
                    <path d="M10 10h4"></path>
                    <path d="M10 14h4"></path>
                    <path d="M10 18h4"></path>
                  </svg>
                  <span>Organization</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </nav>
    </>
  );
}
