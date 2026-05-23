"use client";
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  MessagesSquare,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
export default function SidebarAdmin() {
  const pathname = usePathname();
  return (
    <Sidebar className="top-18.25 h-[calc(100svh-73px)] w-64">
      <SidebarContent className=" bg-background/95 p-4  h-full flex flex-col ">
        <SidebarMenu className="">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${pathname == "/admin/dashboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground"} gap-3 px-4 py-3 h-full font-medium text-center`}
            >
              <Link href="/admin/dashboard" className="flex items-center gap-3">
                <LayoutDashboard className="size-5" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${pathname == "/admin/users" ? "bg-primary text-primary-foreground" : "text-muted-foreground"} gap-3 px-4 py-3 h-full font-medium text-center`}
            >
              <Link href="/admin/users" className="flex items-center gap-3">
                <Users className="size-5" />
                User Management
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${pathname == "/admin/supervisor-verification" ? "bg-primary text-primary-foreground" : "text-muted-foreground"} gap-3 px-4 py-3 h-full font-medium text-center`}
            >
              <Link
                href="/admin/supervisor-verification"
                className="flex items-center gap-3"
              >
                <UserCheck className="size-5 shrink-0" />
                Supervisor Verification
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                  23
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${pathname == "/admin/domain-validation" ? "bg-primary text-primary-foreground" : "text-muted-foreground"} gap-3 px-4 py-3 h-full font-medium text-center`}
            >
              <Link
                href="/admin/domain-validation"
                className="flex items-center gap-3"
              >
                <GraduationCap className="size-5 shrink-0" />
                Domain Validation
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${pathname == "/admin/project-oversight" ? "bg-primary text-primary-foreground" : "text-muted-foreground"} gap-3 px-4 py-3 h-full font-medium text-center`}
            >
              <Link
                href="/admin/project-oversight"
                className="flex items-center gap-3"
              >
                <FolderOpen className="size-5 shrink-0" />
                Project Oversight
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${pathname == "/admin/content-moderation" ? "bg-primary text-primary-foreground" : "text-muted-foreground"} gap-3 px-4 py-3 h-full font-medium text-center`}
            >
              <Link
                href="/admin/content-moderation"
                className="flex items-center gap-3"
              >
                <MessageSquare className="size-5 shrink-0" />
                Content Moderation
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                  23
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${pathname == "/admin/audit-logs" ? "bg-primary text-primary-foreground" : "text-muted-foreground"} gap-3 px-4 py-3 h-full font-medium text-center`}
            >
              <Link
                href="/admin/audit-logs"
                className="flex items-center gap-3"
              >
                <FileText className="size-5 shrink-0" />
                System Audit Logs
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`${pathname == "/admin/setting" ? "bg-primary text-primary-foreground" : "text-muted-foreground"} gap-3 px-4 py-3 h-full font-medium text-center`}
            >
              <Link href="/admin/setting" className="flex items-center gap-3">
                <Settings className="size-5 shrink-0" />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
