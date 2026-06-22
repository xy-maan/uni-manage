// _components/NotificationCard.tsx
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from '@/i18n/navigation';
import {
  Users, MessageSquare, FileText, CircleAlert, CircleCheck, CircleX, Eye, Trash2, UserCheck,
  Bell,
} from "lucide-react";

const iconMap: Record<string, any> = {
  invitation: Users,
  request: Users,
  comment: MessageSquare,
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
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getDetailLink(n: any, role: string): string | null {
  if (n.data?.task_id && n.data?.project_id) {
    return `/${role}/projects/${n.data.project_id}?task=${n.data.task_id}`;
  }
  if (n.data?.project_id) {
    return `/${role}/projects/${n.data.project_id}`;
  }
  return null;
}

export default function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
  role
}: {
  notification: any;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
    role: string;
}) {
  const Icon = iconMap[notification.notification_type] ?? CircleAlert;
  // const link = getDetailLink(notification);
 const link = getDetailLink(notification, role);
  return (
    <Card className={notification.is_read ? "" : "border-primary/30 bg-primary/5"}>
      <CardContent className="p-5 pb-6 gap-4 flex">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 shrink-0">
          <Icon className="size-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4>{notification.title}</h4>
              {!notification.is_read && (
                <Badge className="dark:bg-destructive/60 text-xs">New</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground ml-2 shrink-0">
              {timeAgo(notification.created_at)}
            </span>
          </div>

          {notification.actor_detail && (
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">From:</span>
              <span className="text-sm font-medium">{notification.actor_detail.full_name}</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {notification.message}
          </p>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {/* {link && (
                <Link href={link} onClick={() => !notification.is_read && onMarkRead(notification.id)}>
                  <Button className="py-0 h-8 px-3 gap-1.5">
                    <Eye className="size-4 mr-1" />
                    View
                  </Button>
                </Link>
              )} */}
              {!notification.is_read && !link && (
                <Button
                  variant="outline"
                  className="py-0 h-8 px-3 gap-1.5"
                  onClick={() => onMarkRead(notification.id)}
                >
                  <CircleCheck className="size-4 mr-1" />
                  Mark as Read
                </Button>
              )}
            </div>
            <Button
              className="bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}