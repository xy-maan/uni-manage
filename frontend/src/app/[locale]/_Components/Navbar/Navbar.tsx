"use client";
import { Building2, ChevronDown, Ellipsis, FolderOpen, GraduationCap, LayoutDashboard, MessageSquare, Moon, Settings, Store, Sun, Users, X } from "lucide-react";
import { useTheme } from "next-themes";
// import Link from "@/i18n/navigation";
import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter,Link } from "@/i18n/navigation";
import { signOut, useSession } from "next-auth/react";
import StatusData from "./StatusData/StatusData";
import NotificationBtn from "../Btns/NotificationBtn/NotificationBtn";
import ChatBtn from "../Btns/ChatBtn/ChatBtn";
import SearchNavbarBtn from "./SearchNavbarBtn/SearchNavbarBtn";
import LanguageSelector from "../UtilitiesComponents/LanguageSelector/LanguageSelector";

export default function Navbar() {

   const navItemsHome = [
  { href: "/#projects",  label: "Projects" },
  { href: "/#feature",  label: "Features" },
  { href: "/#work",  label: "How It Works" },
  { href: "/#access",  label: "Access" },
];
  const { theme, setTheme } = useTheme();
  const {status,data}=useSession()
  const router = useRouter();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
// const locale = useLocale(); 
const role = pathname.split("/")[1]; 
const isDashboard = role === "student" || role === "supervisor";

//   const singleRole = pathname.split("/");
// const role = singleRole[1]; 
const navItems = [
  { href: `/${role}/dashboard`, icon: LayoutDashboard, label: "Dashboard" },
  { href: `/${role}/projects/create`, icon: FolderOpen, label: "Projects" },
  { href: `/${role}/marketplace`, icon: Store, label: "Marketplace" },
  { href: `/${role}/community`, icon: MessageSquare, label: "Community" },
]
  // handle return home againnnn
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", "/");
      window.scrollTo(0, 0);
    }
    setActiveSection("");
  }, []);
 
  return (
    <>
{    role!="admin"&& role!="complete-profile"&& 
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
       
       {isDashboard&& 
        <ul className="md:flex hidden font-medium p-4 md:p-0 mt-4 m-0 gap-1  rounded-base md:space-x-8 rtl:space-x-reverse md:flex-row md:justify-between md:mt-0 md:border-0 ">
           {navItems.map((item) => {
                       return (
                           <li className="m-0 "  key={item.href}>

                         <Link
                          
                           href={item.href}
                          className={`flex ${ pathname == item.href? "bg-primary/10 text-primary":" text-muted-foreground hover:text-foreground hover:bg-muted/50"}  items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm
                      
                  `}
                         >  <div className="flex items-center gap-3">
                             < item.icon className="h-5 w-5 shrink-0" />
                             <span>{item.label}</span>
                           </div>
                        
                           
                           </Link>   
                           </li>
                            )})}
           
          
               <li className="m-0 ">
{/* <Link href={`/${role}/findteam`}>    */}
       <DropdownMenu >
                  <DropdownMenuTrigger asChild className="flex  text-muted-foreground hover:text-foreground hover:bg-muted/50  items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm">
                    <div className="flex items-center justify-center gap-1">
               
<Ellipsis className="size-4"/>
                      <span className="cursor-pointer text-sm ">
                       More 
                      </span>
                      <ChevronDown className="size-3 mt-1"/>
                     
                    </div>
                  </DropdownMenuTrigger>
                      <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                   className="w-48"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>More Options</DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="px-1 cursor-pointer">
                        <Link href={`/${role}/findteam`}>
                        <Users className="size-4 mr-2"/>
             

          <span>Find Team</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-1 cursor-pointer">
                        <Link href="/login">
                         <Settings className="size-4 mr-2"/>
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                  
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
</DropdownMenu>
{/* </Link> */}
  
            </li>
          </ul>}
        {!isDashboard&& <ul className="md:flex hidden font-medium p-4 md:p-0 mt-4  rounded-base md:space-x-8 rtl:space-x-reverse md:flex-row md:justify-between md:mt-0 md:border-0 ">
             {navItemsHome.map((item) => {
                       return (
                           <li className=" "  key={item.href}>

                         <Link
                           
                           href={item.href}
                          className={`block py-2 px-3  transition-colors  rounded md:bg-transparent md:p-0 text-sm font-medium 
                  ${
                    activeSection == "projects"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  `}
                      
                   onClick={() => setActiveSection(item.label)}
                         >  
                             
                              {item.label}
                           </Link>   
                           </li>
                            )})}
          </ul>}

          
          <ul className="md:flex hidden gap-2 text-accent-foreground   items-center justify-center font-medium p-4 md:p-0 mt-4 rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row  md:mt-0 md:border-0 md:bg-neutral-primary">

              {status === "authenticated" && (
               <div className="flex items=center gap-2 justify-center m-0"> <ChatBtn/>
               <SearchNavbarBtn/>
    <NotificationBtn /></div>
  )}
    <button
    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    className="
      flex items-center justify-center
      size-9  hover:text-accent-foreground dark:hover:bg-accent/50
      hover:bg-muted transition
      mr-0
      p-0
        has-[>svg]:px-0
        rounded-md
    "
  >
    {theme === "light" ? (
      <Moon className="size-4" />
    ) : (
      <Sun className="size-4" />
    )}
  </button>
 <div className="flex items-center justify-center  min-w-11 min-h-11 gap-3">
     
   <div className="">
          <LanguageSelector/>    
          </div>
    {status === "loading" ? (
      <span className="loader-auth"></span>
    ) : status === "authenticated" ? (

      // <div className="size-11 rounded-full border border-border flex items-center justify-center">
        <StatusData />
      // </div>

    ) : (
        <DropdownMenu>
                  <DropdownMenuTrigger asChild className="">
                    <div className="flex items-center justify-center gap-1">
                      <span className="cursor-pointer text-sm text-foreground">
                        Sign In
                      </span>
             
                      <ChevronDown className="size-4 mt-1 text-foreground"/>
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
                         <GraduationCap className="size-4 mr-2"/>
                          <span>Student / Supervisor</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-2">
                        <Link href="/login">
                         <GraduationCap className="size-4 mr-2"/>
                          <span>Admin</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/login">
                        <Building2 className="size-4 mr-2"/>
                      
                          <span>Organization</span>
                        </Link>
                      </DropdownMenuItem>
                             
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
    )}

  </div>
          </ul>
          <button
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-0 focus:ring-neutral-tertiary"
          >
            <span className="sr-only">Open main menu</span>
            {isOpenMenu ? (
              <X className="size-5"/>
            
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
               {!isDashboard&& 
                           <li className=" ">
             {navItemsHome.map((item) => 

                         <Link
                           key={item.href}
                           href={item.href}
                           className={`px-4  pl-2 py-2 mb-3 block w-full text-left text-sm font-medium hover:bg-muted rounded-lg transition-colors
                  ${
                    activeSection == "projects"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  `}
                      
                   onClick={() => {setActiveSection(item.label); setIsOpenMenu(false);}}
                         >  
                             
                              {item.label}
                           </Link>   
                            )}
                            </li>
          }
       {isDashboard&&<>

         {navItems.map((item) => {
                       return (
                           <li className="flex  items-center gap-2 px-4 py-2 rounded-lg transition-all
                       font-medium "  key={item.href}>

                         <Link
                          
                           href={item.href}
                          className={`px-4  pl-2 py-2 mb-3 block w-full text-left text-sm font-medium hover:bg-muted rounded-lg transition-colors hover:text-foreground  ${ pathname == `/${role}/dashboard`? "bg-primary/10 text-primary":" text-muted-foreground hover:text-foreground hover:bg-muted/50"}
                  `}
                   onClick={() => {
    setIsOpenMenu(false); }}
                         >  <div className="flex items-center gap-3">
                             < item.icon className="h-5 w-5 shrink-0" />
                             <span>{item.label}</span>
                           </div>
                        
                           
                           </Link>   
                           </li>
                            )})}
         
      </>}
            <li className="px-4 py-2 mb-3  w-full block text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              {theme == "light" ? (
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
                   <GraduationCap className="size-4"/>
                    <span   onClick={() => {
    setIsOpenMenu(false); 
  }}>Student / Supervisor</span>
                </div>
                  </Link>
                  <Link href="/login">
                <div className="flex gap-2 items-center justify-start  px-3 py-2   bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-lg text-sm font-medium border h-9 w-full">
                   <Building2 className="size-4"/>
                    <span>Organization</span>
                </div>
                  </Link>
              </div>
            </div>


          </div>
        </div>
      </nav> }
  
    </>
  );
}
