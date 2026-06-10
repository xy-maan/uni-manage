"use client";
import React, { useState } from "react";
import { Link } from '@/i18n/navigation';
import {
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
export default function SidebarAdmin({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "User Management" },
  { href: "/admin/supervisor-verification", icon: UserCheck, label: "Supervisor Verification", badge: "23" },
  { href: "/admin/domain-validation", icon: GraduationCap, label: "Domain Validation" },
  { href: "/admin/project-oversight", icon: FolderOpen, label: "Project Oversight" },
  { href: "/admin/content-moderation", icon: MessageSquare, label: "Content Moderation", badge: "5" },
  { href: "/admin/audit-logs", icon: FileText, label: "System Audit Logs" },
  { href: "/admin/setting", icon: Settings, label: "Settings" },
];
  const pathname = usePathname();

  return (
     <div  className={`
    fixed lg:sticky
    top-18.25
    left-0
    h-[calc(100vh-73px)]
    w-64
    bg-background
    border-r
    z-40
    transition-transform duration-300

    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

  lg:translate-x-0
  `}>
      <div className="p-4 h-full flex flex-col" >          
<div className="space-y-1 flex-1">
{navItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                  onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center text-center text-muted-foreground hover:bg-muted hover:text-foreground gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  ${pathname === item.href
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >  <div className="flex items-center gap-3">
                  < item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge className={pathname === item.href
                    ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                  }>
                    {item.badge}
                  </Badge>
                )}</Link>)    })}
           
</div>
        <div className="pt-4 border-t mt-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-lg">
            <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">System Administrator</p>
            </div>
          </div>
        </div>
 </div>
    </div>
  );
}
