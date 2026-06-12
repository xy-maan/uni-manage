"use client";
import { CircleUser, Moon, Settings, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from '@/i18n/navigation';
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
import { logoutAction } from "@/Actions/logout.action";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { GetUserStatus } from "@/Actions/status.action";
import LanguageSelector from "../../UtilitiesComponents/LanguageSelector/LanguageSelector";
export default function StatusData() {
  const [role, setRole] = useState("");
  const { data } = useSession();
  async function handleLogout() {
    const { ok, payload } = await logoutAction();
    if (!data?.djangoAccess) {
      toast.error("No Token", { position: "top-center", duration: 2000 });
    }

    if (ok) {
      toast.success(payload.detail, {
        position: "top-center",
        duration: 2000,
      });
    } else {
      toast.error(payload.detail, { position: "top-center", duration: 2000 });
    }
    await signOut({
      callbackUrl: "/login",
    });
  }
  async function getRoleUser() {
    if (data?.djangoAccess) {
      const res = await GetUserStatus(data?.djangoAccess);
      setRole(res?.payload?.role);
    }
    // console.log(role);
  }
  useEffect(() => {
    getRoleUser();
  }, [data]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="">
          <div className="flex items-center justify-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-full border border-border">
            <User className="size-4" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-55">
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
            <DropdownMenuItem asChild className="px-2  hover:!bg-transparent">
              <Link href={`/${role?.toLowerCase()}/profile`}>
                <span className="flex items-center focus:bg-accent focus:text-accent-foreground gap-2 cursor-pointer">
                  <CircleUser className="size-4 mr-2"/>
                 
                  Profile
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-2  hover:!bg-transparent">
              <Link href="/">
                <span className="flex items-center focus:bg-accent focus:text-accent-foreground gap-2 cursor-pointer">
                      <Settings className="size-4 mr-2"/>
               
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
    </div>
  );
}
