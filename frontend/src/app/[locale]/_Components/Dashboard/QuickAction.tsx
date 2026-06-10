import React from "react";
import {
  Calendar,
  CircleAlert,
  CircleCheck,
  Clock,
  Bell,
  MessageSquare,
  Users,
  Eye,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/navigation';
export default function QuickAction({ variant }: { variant: string }) {
  return (
    <div className="space-y-2">
      {variant == "student" && (
        <Link href="/student/findteam">
          <Button className="gap-2 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 w-full justify-start mb-2 cursor-pointer bg-background">
            <Users className="mr-2 size-4" />
            Find Team Members
          </Button>
        </Link>
      )}
      {variant == "supervisor" && (
        <Link href="/supervisor/projects">
          <Button className="gap-2 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 w-full justify-start mb-2 cursor-pointer bg-background">
            <Bell className="mr-2 size-4" />
            Review Requests
          </Button>
        </Link>
      )}

      {variant == "student" && (
        <Button className="cursor-pointer gap-2 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 w-full justify-start bg-background">
          <FileText className="mr-2 size-4" />
          Upload Document
        </Button>
      )}

      {variant == "supervisor" && (
        <Link href="/supervisor/projects">
          <Button className="cursor-pointer gap-2 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 w-full justify-start bg-background">
            <Eye className="mr-2 size-4" />
            View Projects
          </Button>
        </Link>
      )}

      {variant == "student" && (
        <Link href="/student/notification">
          <Button className="cursor-pointer gap-2 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 w-full justify-start bg-background">
            <MessageSquare className="mr-2 size-4" />
            Message Supervisor
          </Button>
        </Link>
      )}

      {variant == "supervisor" && (
        <Link href="/student/notification">
          <Button className="cursor-pointer gap-2 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 w-full justify-start bg-background">
            <TrendingUp className="mr-2 size-4" />
            View Analytics
          </Button>
        </Link>
      )}
    </div>
  );
}
