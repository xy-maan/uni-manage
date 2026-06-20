// MilestoneDashboard.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { GetMilestoneDashboardAction } from "@/Actions/methodology/Milestones/GetMilestoneDashboard.action";

export default function MilestoneDashboard({ milestoneId }: { milestoneId: number }) {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    const { ok, payload } = await GetMilestoneDashboardAction(milestoneId);
    if (ok) setDashboard(payload);
    else toast.error("Failed to load milestone dashboard", { position: "top-center", duration: 2000 });
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, [milestoneId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (!dashboard) return null;

  return (
    <Card className="p-0">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>{dashboard.completed_task_count}/{dashboard.task_count} tasks</span>
          <span>{dashboard.progress_percent}%</span>
        </div>
        <Progress value={dashboard.progress_percent} className="h-2" />
      </CardContent>
    </Card>
  );
}