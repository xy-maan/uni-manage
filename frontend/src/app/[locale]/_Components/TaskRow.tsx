// TaskRow.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/navigation";

const priorityConfig: Record<string, { label: string; class: string }> = {
  low: { label: "Low", class: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", class: "bg-blue-500/10 text-blue-600" },
  high: { label: "High", class: "bg-destructive/10 text-destructive" },
  urgent: { label: "Urgent", class: "bg-red-600/10 text-red-700" },
};

const borderColorByPriority: Record<string, string> = {
  low: "border-l-muted-foreground",
  medium: "border-l-blue-500",
  high: "border-l-warning",
  urgent: "border-l-destructive",
};

function formatDate(dateString: string | null) {
  if (!dateString) return "No due date";
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TaskRow({ task, projectId }: { task: any; projectId?: number }) {
  const priority = priorityConfig[task.priority] ?? priorityConfig.medium;
  const borderColor = borderColorByPriority[task.priority] ?? borderColorByPriority.medium;

  return (
    <Link href={projectId ? `/student/projects/${projectId}?task=${task.id}` : "#"}>
      <Card className={`p-0 gap-0 border-l-4 ${borderColor} hover:bg-accent/30 transition-colors cursor-pointer`}>
        <CardContent className="p-4 pb-6">
          <div className="flex items-start justify-between mb-3 p-0">
            <h4 className="flex-1 pr-2">{task.title}</h4>
            <Badge className={`border-0 ${priority.class}`}>{priority.label}</Badge>
          </div>
          {task.description && (
            <p className="text-muted-foreground mb-3 text-sm line-clamp-1">{task.description}</p>
          )}
          <div className="flex items-start justify-between p-0 text-sm text-foreground/70">
            <div className="gap-4 flex items-center">
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                <span>{formatDate(task.due_at)}</span>
              </div>
              {task.comments?.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="size-4" />
                  <span>{task.comments.length}</span>
                </div>
              )}
            </div>
            {task.assignee_detail && (
              <span className="bg-muted flex size-6 items-center justify-center rounded-full text-xs text-foreground/70">
                {task.assignee_detail.full_name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}