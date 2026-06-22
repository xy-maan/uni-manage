"use client";
import { useContext, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { NotificationCountContext } from "@/app/Providers/NotificationCountProvider";
import { GetNotificationsAction } from "@/Actions/Notifications/getNotifications.action";
import { MarkNotificationReadAction } from "@/Actions/Notifications/markNotificationRead.action";
import { MarkAllNotificationsReadAction } from "@/Actions/Notifications/markAllNotificationsRead.action";
import { DeleteNotificationAction } from "@/Actions/Notifications/deleteNotification.action";
import NotificationCard from "@/app/[locale]/_Components/NotificationCard";

export default function NotificationsPageClient({role}:{role:string}) {
  const context = useContext(NotificationCountContext);
  if (!context) {
    throw new Error("Not Exit");
  }
  const { notificationCount, setNotificationCount } = context;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
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
      toast.error("Something went wrong loading notifications", { position: "top-center", duration: 2000 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkRead(notificationId: number) {
    const { ok } = await MarkNotificationReadAction(notificationId);
    if (ok) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
      setNotificationCount((prev) => Math.max(0, prev - 1));
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

  async function handleDelete(notificationId: number) {
    const target = notifications.find((n) => n.id === notificationId);
    const { ok,payload } = await DeleteNotificationAction(notificationId);
    if (ok) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (target && !target.is_read) {
        setNotificationCount((prev) => Math.max(0, prev - 1));
      }
      toast.success("Notification deleted", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  async function handleClearAll() {
    const deletions = notifications.map((n) => DeleteNotificationAction(n.id));
    await Promise.all(deletions);
    setNotifications([]);
    setNotificationCount(0);
    toast.success("All notifications cleared", { position: "top-center", duration: 2000 });
  }

  const total = notifications.length;
  const unreadList = notifications.filter((n) => !n.is_read);
  const readList = notifications.filter((n) => n.is_read);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="mb-2 text-2xl font-medium">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with team invitations, supervisor responses, and project activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadList.length > 0 && (
            <Button variant="outline" onClick={handleMarkAllRead}>
              <CheckCheck className="size-4 mr-2" />
              Mark All as Read
            </Button>
          )}
          {total > 0 && (
            <Button variant="outline" onClick={handleClearAll}>
              <Trash2 className="size-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-0">
          <CardContent className="p-4 pb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <h3 className="text-2xl mt-1">{total}</h3>
            </div>
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="size-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="p-4 pb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unread</p>
              <h3 className="text-2xl mt-1">{unreadList.length}</h3>
            </div>
            <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Badge className="bg-destructive text-white flex items-center justify-center text-base">
                {unreadList.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="p-4 pb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Read</p>
              <h3 className="text-2xl mt-1">{readList.length}</h3>
            </div>
            <div className="size-12 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCheck className="size-6 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="All">
            All <Badge className="bg-secondary text-secondary-foreground">{total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Unread">
            Unread <Badge className="bg-secondary text-secondary-foreground">{unreadList.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Read">
            Read <Badge className="bg-secondary text-secondary-foreground">{readList.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="All" className="space-y-4">
          {loading && <p className="text-sm text-muted-foreground text-center py-12">Loading...</p>}
          {!loading && notifications.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">No notifications yet</p>
          )}
          {!loading && notifications.map((n) => (
            <NotificationCard key={n.id} role={role} notification={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
          ))}
        </TabsContent>

        <TabsContent value="Unread" className="space-y-4">
          {unreadList.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">No unread notifications</p>
          )}
          {unreadList.map((n) => (
            <NotificationCard key={n.id} role={role} notification={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
          ))}
        </TabsContent>

        <TabsContent value="Read" className="space-y-4">
          {readList.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">No read notifications</p>
          )}
          {readList.map((n) => (
            <NotificationCard key={n.id} role={role} notification={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}