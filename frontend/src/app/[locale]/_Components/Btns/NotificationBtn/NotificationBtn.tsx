// "use client";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Bell,
//   CheckCheck,
//   Users,
//   ChevronRight,
//   MessagesSquare,
//   FileText,
//   CircleAlert,
//   CircleCheck,
// } from "lucide-react";
// import React from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Card, CardContent } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Link } from '@/i18n/navigation';

// export default function NotificationBtn() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild className="">
//         <div className=" m-0 hidden sm:block">
//           <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md relative p-0  has-[>svg]:px-0">
//             <Bell className="size-4" />
//             <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-destructive text-white text-xs animate-pulse">
//               5
//             </Badge>
//           </Button>
//         </div>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         align="end"
//         sideOffset={8}
//         className="w-95 min-w-32 max-w-[calc(100vw-2rem)] p-0 overflow-x-hidden overflow-y-auto  "
//       >
//         <DropdownMenuGroup className="gap-0">
//           <DropdownMenuLabel className="p-4 border-b bg-muted/30">
//             <div className="flex items-center justify-between">
//               <div className="flex flex-col">
//                 <h3 className="text-base font-medium">Notifications</h3>
//                 <span className="text-xs text-muted-foreground mt-0.5">
//                   5 unread
//                 </span>
//               </div>
//               <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-8 rounded-md">
//                 <CheckCheck className="size-4" />
//               </Button>
//             </div>
//           </DropdownMenuLabel>
//         </DropdownMenuGroup>
//           <ScrollArea className="max-h-[min(500px,calc(100vh-200px))]">

//         <DropdownMenuGroup className="p-2 space-y-2 ">
//           <DropdownMenuItem asChild className="px-2   hover:bg-transparent!">
//             <Card className="p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer border-primary/30 bg-primary/5 text-card-foreground">
//               <CardContent className=" p-3 pb-6 w-full">
//                 <div className="flex items-start gap-3">
//                   <div className="bg-primary/10 size-8 rounded-lg flex items-center justify-center">
//                     <Users className="size-4 text-primary" />
//                   </div>

//                   <div className=" flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-2 mb-1">
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm font-medium ">Team Invitation</p>
//                         <div className="size-2 rounded-full bg-destructive"></div>
//                       </div>
//                       <span className="text-xs text-muted-foreground">10h</span>
//                     </div>

//                     <p className="text-xs text-muted-foreground line-clamp-1">
//                       AI-Powered Student Assistant
//                     </p>
//                   </div>

//                   <ChevronRight className="size-4" />
//                 </div>
//               </CardContent>
//             </Card>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild className="px-2   hover:bg-transparent!">
//             <Card className="p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer border-primary/30 bg-primary/5 text-card-foreground">
//               <CardContent className=" p-3 pb-6 w-full">
//                 <div className="flex items-start gap-3">
//                   <div className="bg-primary/10 size-8 rounded-lg flex items-center justify-center">
//                     <MessagesSquare className="size-4 text-primary" />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-2 mb-1">
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm font-medium ">Team Message</p>
//                         <div className="size-2 rounded-full bg-destructive"></div>
//                       </div>
//                       <span className="text-xs text-muted-foreground">10h</span>
//                     </div>

//                     <p className="text-xs text-muted-foreground line-clamp-1">
//                       Youssef: Just uploaded the latest UI mockups. Ple...
//                     </p>
//                   </div>

//                   <ChevronRight className="size-4" />
//                 </div>
//               </CardContent>
//             </Card>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild className="px-2   hover:bg-transparent!">
//             <Card className="p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer border-primary/30 bg-primary/5 text-card-foreground">
//               <CardContent className=" p-3 pb-6 w-full">
//                 <div className="flex items-start gap-3">
//                   <div className="bg-primary/10 size-8 rounded-lg flex items-center justify-center">
//                     <FileText className="size-4 text-primary" />
//                   </div>

//                   <div className=" flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-2 mb-1">
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm font-medium ">Notification</p>
//                         <div className="size-2 rounded-full bg-destructive"></div>
//                       </div>
//                       <span className="text-xs text-muted-foreground">10h</span>
//                     </div>

//                     <p className="text-xs text-muted-foreground line-clamp-1">
//                       New notification{" "}
//                     </p>
//                   </div>

//                   <ChevronRight className="size-4" />
//                 </div>
//               </CardContent>
//             </Card>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild className="px-2   hover:bg-transparent!">
//             <Card className="p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer border-primary/30 bg-primary/5 text-card-foreground">
//               <CardContent className=" p-3 pb-6 w-full">
//                 <div className="flex items-start gap-3">
//                   <div className="bg-warning/10 size-8 rounded-lg flex items-center justify-center">
//                     <CircleAlert className="size-4 text-warning" />
//                   </div>

//                   <div className=" flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-2 mb-1">
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm font-medium ">Task Deadline</p>
//                         <div className="size-2 rounded-full bg-destructive"></div>
//                       </div>
//                       <span className="text-xs text-muted-foreground">10h</span>
//                     </div>

//                     <p className="text-xs text-muted-foreground line-clamp-1">
//                       Complete Database Schema Design - Due in 2 days
//                     </p>
//                   </div>

//                   <ChevronRight className="size-4" />
//                 </div>
//               </CardContent>
//             </Card>
//           </DropdownMenuItem>
//                   <DropdownMenuItem asChild className="px-2 hover:bg-transparent! ">
//             <Card className="p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer border-primary/30 bg-primary/5 text-card-foreground">
//               <CardContent className=" p-3 pb-6 w-full">
//                 <div className="flex items-start gap-3">
//                   <div className="bg-success/10 size-8 rounded-lg flex items-center justify-center">
//                     <CircleCheck className="size-4 text-success" />
//                   </div>

//                   <div className="flex flex-col flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-2 mb-1">
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm font-medium ">Request Approved</p>
//                         <div className="size-2 rounded-full bg-destructive"></div>
//                       </div>
//                       <span className="text-xs text-muted-foreground">10h</span>
//                     </div>

//                     <p className="text-xs text-muted-foreground line-clamp-1">
// Dr. Abdullah accepted
//                     </p>
//                   </div>

//                   <ChevronRight className="size-4" />
//                 </div>
//               </CardContent>
//             </Card>
//           </DropdownMenuItem>
             
//         </DropdownMenuGroup>
//               <DropdownMenuGroup className="gap-0 p-2">
//  <DropdownMenuItem asChild className=" hover:bg-transparent! p-0">
//   <Link href="/student/notification">
//  <div className="border-t bg-muted/30 p-0 w-full">
//     <Button className="w-full  rounded-none bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 px-4 py-2 h-10 cursor-pointer">
//       View All Notifications
//     </Button>
//  </div>
//   </Link>
//  </DropdownMenuItem>
//         </DropdownMenuGroup>  
//           </ScrollArea>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// NotificationBtn.tsx
"use client";
import { useContext, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell, CheckCheck, Users, ChevronRight, MessagesSquare, FileText, CircleAlert, CircleCheck,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { GetNotificationsAction } from "@/Actions/Notifications/getNotifications.action";
import { MarkNotificationReadAction } from "@/Actions/Notifications/markNotificationRead.action";
import { MarkAllNotificationsReadAction } from "@/Actions/Notifications/markAllNotificationsRead.action";
import { NotificationCountContext } from "@/app/Providers/NotificationCountProvider";

const iconMap: Record<string, any> = {
  invitation: Users,
  request: Users,
  comment: MessagesSquare,
  task_assignment: FileText,
  task_update: FileText,
  feedback: FileText,
  meeting: CircleAlert,
  deliverable_review: CircleAlert,
  approval: CircleCheck,
  system: Bell,
};

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "now";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function NotificationBtn({role}:{role:string}) {
  const context = useContext(NotificationCountContext);
  // if (!context) {
  //   throw new Error("Not Exit");
  // }
    if (!context) return null;
  const { notificationCount, setNotificationCount } = context;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function checkNotifications() {
    setLoading(true);
    try {
      const { ok, payload } = await GetNotificationsAction();
      if (ok) {
        setNotifications(payload);
        const unread = payload.filter((n: any) => !n.is_read).length;
        setNotificationCount(unread);
      } else {
        toast.error("Failed to load notifications", { position: "top-center", duration: 2000 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(notificationId: number) {
    const { ok } = await MarkNotificationReadAction(notificationId);
    if (ok) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
      setNotificationCount((prev:any) => Math.max(0, prev - 1));
    } else {
      toast.error("faild mark as read", { position: "top-center", duration: 2000 });
    }
  }

  async function handleMarkAllRead() {
    const { ok } = await MarkAllNotificationsReadAction();
    if (ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      setNotificationCount(0);
      toast.success("All notifications marked as read", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild mark all as read", { position: "top-center", duration: 2000 });
    }
  }

  useEffect(() => {
    checkNotifications();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="m-0 hidden sm:block">
          <Button className="bg-transparent hover:bg-accent hover:text-accent-foreground text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md relative p-0 has-[>svg]:px-0">
            <Bell className="size-4" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-destructive text-white text-xs animate-pulse">
                {notificationCount}
              </Badge>
            )}
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-95 min-w-32 max-w-[calc(100vw-2rem)] p-0 overflow-x-hidden overflow-y-auto"
      >
        <DropdownMenuGroup className="gap-0">
          <DropdownMenuLabel className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-base font-medium">Notifications</h3>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {notificationCount} unread
                </span>
              </div>
              {notificationCount > 0 && (
                <Button
                  className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-8 rounded-md"
                  onClick={handleMarkAllRead}
                >
                  <CheckCheck className="size-4" />
                </Button>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <ScrollArea className="max-h-[min(500px,calc(100vh-200px))]">
          <DropdownMenuGroup className="p-2 space-y-2">
            {loading && (
              <p className="text-xs text-muted-foreground text-center py-4">Loading...</p>
            )}

            {!loading && notifications.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No notifications yet</p>
            )}

            {!loading && notifications.slice(0, 6).map((n) => {
              const Icon = iconMap[n.notification_type] ?? Bell;
              return (
                <DropdownMenuItem
                  key={n.id}
                  asChild
                  className="px-2 hover:bg-transparent!"
                  onClick={() => !n.is_read && handleMarkRead(n.id)}
                >
                  <Card
                    className={`p-0 w-full rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer text-card-foreground ${
                      !n.is_read ? "border-primary/30 bg-primary/5" : ""
                    }`}
                  >
                    <CardContent className="p-3 pb-6 w-full">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 size-8 rounded-lg flex items-center justify-center">
                          <Icon className="size-4 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{n.title}</p>
                              {!n.is_read && <div className="size-2 rounded-full bg-destructive" />}
                            </div>
                            <span className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                        </div>

                        <ChevronRight className="size-4" />
                      </div>
                    </CardContent>
                  </Card>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>

          <DropdownMenuGroup className="gap-0 p-2">
            <DropdownMenuItem asChild className="hover:bg-transparent! p-0">
              <Link href={`/${role}/notification`}>
                <div className="border-t bg-muted/30 p-0 w-full">
                  <Button className="w-full rounded-none bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 px-4 py-2 h-10 cursor-pointer">
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