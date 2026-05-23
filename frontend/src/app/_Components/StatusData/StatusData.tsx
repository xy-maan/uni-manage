"use client";
import { Moon, Sun, User } from "lucide-react";
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
import { GetUserStatus } from "@/Actions/status.action";
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
    console.log(role);
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
            <DropdownMenuItem asChild className="px-2  hover:!bg-transparent">
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
    </div>
  );
}
