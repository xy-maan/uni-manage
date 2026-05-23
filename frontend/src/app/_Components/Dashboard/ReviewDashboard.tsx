import React from "react";
import {
  Calendar,
  CircleAlert,
  CircleCheck,
  Clock,
  FileText,
  MessageSquare,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
export default function ReviewDashboard({ variant }: { variant: string }) {
  return (
    <Card className="p-0">
      <CardHeader className="px-6 pt-6 gap-1.5">
        <h4 className="leading-none">
          {variant == "student" && "Recent Activity"}
          {variant == "supervisor" && " Pending Reviews"}
        </h4>
        {variant == "supervisor" && (
          <p className="text-muted-foreground">
            Items waiting for your feedback
          </p>
        )}
      </CardHeader>
      <CardContent className="pb-6 px-6">
        {variant == "student" && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-4 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm">
                  Dr. Abdulrahman commented on your progress report
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-warning/10 flex items-center justify-center">
                <CircleAlert className="size-4 text-warning" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm">New task assigned: UI Design Review</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  5 hours ago
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-success/10 flex items-center justify-center">
                <Users className="size-4 text-success" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm">Abdullah joined your project team</h3>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        )}
        {variant == "supervisor" && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg border-2 border-destructive/20 bg-destructive/5">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm">Progress Report</h4>
                <Badge className="dark:bg-destructive/60 text-xs  bg-destructive">
                  Urgent
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                AI-Powered Study Assistant
              </p>
              <p className="text-xs mb-2 text-muted-foreground">
                by Abdulrahman
              </p>
              <p className="text-xs text-muted-foreground">2 hours ago </p>
              <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent w-full mt-3">
                Review Now
              </Button>
            </div>

            <div className="p-3 rounded-lg border-2 border-border">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm">Code Review</h4>
                {/* <Badge className='dark:bg-destructive/60 text-xs  bg-destructive'>Urgent</Badge> */}
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                AI-Powered Study Assistant
              </p>
              <p className="text-xs mb-2 text-muted-foreground">
                by Abdulrahman
              </p>
              <p className="text-xs text-muted-foreground">2 hours ago </p>
              <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent w-full mt-3">
                Review Now
              </Button>
            </div>
            <div className="p-3 rounded-lg border-2 border-destructive/20 bg-destructive/5">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm">Design Mockups</h4>
                <Badge className="dark:bg-destructive/60 text-xs  bg-destructive">
                  Urgent
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                AI-Powered Study Assistant
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                by Abdulrahman
              </p>
              <p className="text-xs text-muted-foreground">2 hours ago </p>
              <Button className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 bg-transparent w-full mt-3">
                Review Now
              </Button>
            </div>
          </div>
        )}

        <Button className="mt-4 w-full bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 cursor-pointer">
          View All Review
        </Button>
      </CardContent>
    </Card>
  );
}
