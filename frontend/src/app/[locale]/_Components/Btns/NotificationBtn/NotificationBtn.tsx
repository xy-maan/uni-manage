"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCheck,
  Users,
  ChevronRight,
  MessagesSquare,
  FileText,
  CircleAlert,
  CircleCheck,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from '@/i18n/navigation';

export default function NotificationBtn() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <div className=" m-0 hidden sm:block">
          <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md relative p-0  has-[>svg]:px-0">
            <Bell className="size-4" />
            <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-destructive text-white text-xs animate-pulse">
              5
            </Badge>
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-95 min-w-32 max-w-[calc(100vw-2rem)] p-0 overflow-x-hidden overflow-y-auto  "
      >
        <DropdownMenuGroup className="gap-0">
          <DropdownMenuLabel className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-base font-medium">Notifications</h3>
                <span className="text-xs text-muted-foreground mt-0.5">
                  5 unread
                </span>
              </div>
              <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-8 rounded-md">
                <CheckCheck className="size-4" />
              </Button>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
          <ScrollArea className="max-h-[min(500px,calc(100vh-200px))]">

        <DropdownMenuGroup className="p-2 space-y-2 ">
          <DropdownMenuItem asChild className="px-2   hover:bg-transparent!">
            <Card className="p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer border-primary/30 bg-primary/5 text-card-foreground">
              <CardContent className=" p-3 pb-6 w-full">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 size-8 rounded-lg flex items-center justify-center">
                    <Users className="size-4 text-primary" />
                  </div>

                  <div className=" flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium ">Team Invitation</p>
                        <div className="size-2 rounded-full bg-destructive"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">10h</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1">
                      AI-Powered Student Assistant
                    </p>
                  </div>

                  <ChevronRight className="size-4" />
                </div>
              </CardContent>
            </Card>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2   hover:bg-transparent!">
            <Card className="p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer border-primary/30 bg-primary/5 text-card-foreground">
              <CardContent className=" p-3 pb-6 w-full">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 size-8 rounded-lg flex items-center justify-center">
                    <MessagesSquare className="size-4 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium ">Team Message</p>
                        <div className="size-2 rounded-full bg-destructive"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">10h</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Youssef: Just uploaded the latest UI mockups. Ple...
                    </p>
                  </div>

                  <ChevronRight className="size-4" />
                </div>
              </CardContent>
            </Card>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2   hover:bg-transparent!">
            <Card className="p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer border-primary/30 bg-primary/5 text-card-foreground">
              <CardContent className=" p-3 pb-6 w-full">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 size-8 rounded-lg flex items-center justify-center">
                    <FileText className="size-4 text-primary" />
                  </div>

                  <div className=" flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium ">Notification</p>
                        <div className="size-2 rounded-full bg-destructive"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">10h</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1">
                      New notification{" "}
                    </p>
                  </div>

                  <ChevronRight className="size-4" />
                </div>
              </CardContent>
            </Card>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2   hover:bg-transparent!">
            <Card className="p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer border-primary/30 bg-primary/5 text-card-foreground">
              <CardContent className=" p-3 pb-6 w-full">
                <div className="flex items-start gap-3">
                  <div className="bg-warning/10 size-8 rounded-lg flex items-center justify-center">
                    <CircleAlert className="size-4 text-warning" />
                  </div>

                  <div className=" flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium ">Task Deadline</p>
                        <div className="size-2 rounded-full bg-destructive"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">10h</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Complete Database Schema Design - Due in 2 days
                    </p>
                  </div>

                  <ChevronRight className="size-4" />
                </div>
              </CardContent>
            </Card>
          </DropdownMenuItem>
                  <DropdownMenuItem asChild className="px-2 hover:bg-transparent! ">
            <Card className="p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer border-primary/30 bg-primary/5 text-card-foreground">
              <CardContent className=" p-3 pb-6 w-full">
                <div className="flex items-start gap-3">
                  <div className="bg-success/10 size-8 rounded-lg flex items-center justify-center">
                    <CircleCheck className="size-4 text-success" />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium ">Request Approved</p>
                        <div className="size-2 rounded-full bg-destructive"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">10h</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1">
Dr. Abdullah accepted
                    </p>
                  </div>

                  <ChevronRight className="size-4" />
                </div>
              </CardContent>
            </Card>
          </DropdownMenuItem>
             
        </DropdownMenuGroup>
              <DropdownMenuGroup className="gap-0 p-2">
 <DropdownMenuItem asChild className=" hover:bg-transparent! p-0">
  <Link href="/student/notification">
 <div className="border-t bg-muted/30 p-0 w-full">
    <Button className="w-full  rounded-none bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 px-4 py-2 h-10 cursor-pointer">
      View All Notifications
    </Button>
 </div>
  </Link>
 </DropdownMenuItem>
        </DropdownMenuGroup>  
          </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
