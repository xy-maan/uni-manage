// SprintDashboard.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { GetSprintDashboardAction } from "@/Actions/methodology/Sprints/GetSprintDashboard.action";
import Loading from "../CommunityComponent/Loading";

export default function SprintDashboard({ sprintId }: { sprintId: number }) {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    const { ok, payload } = await GetSprintDashboardAction(sprintId);
    if (ok) {
      setDashboard(payload);
    } else {
      toast.error("Failed to load sprint dashboard", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, [sprintId]);

  if (loading) return <Loading/>;
  if (!dashboard) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-0">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Backlog</p>
          <p className="text-xl font-semibold">{dashboard.backlog_count}</p>
        </CardContent>
      </Card>
      <Card className="p-0">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Tasks</p>
          <p className="text-xl font-semibold">{dashboard.completed_task_count}/{dashboard.task_count}</p>
        </CardContent>
      </Card>
      <Card className="p-0">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Story Points</p>
          <p className="text-xl font-semibold">{dashboard.completed_story_points}/{dashboard.story_points}</p>
        </CardContent>
      </Card>
      <Card className="p-0">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Velocity</p>
          <p className="text-xl font-semibold">{dashboard.velocity}</p>
        </CardContent>
      </Card>
    </div>
  );
}