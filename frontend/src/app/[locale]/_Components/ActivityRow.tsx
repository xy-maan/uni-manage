import { MessageSquare, CircleAlert, Users, FileText } from "lucide-react";

const actionIconMap: Record<string, { icon: any; bg: string; color: string }> = {
  created: { icon: FileText, bg: "bg-primary/10", color: "text-primary" },
  updated: { icon: CircleAlert, bg: "bg-warning/10", color: "text-warning" },
  status_changed: { icon: CircleAlert, bg: "bg-warning/10", color: "text-warning" },
  commented: { icon: MessageSquare, bg: "bg-primary/10", color: "text-primary" },
  assigned: { icon: Users, bg: "bg-success/10", color: "text-success" },
};

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function activityMessage(activity: any) {
  const actionMap: Record<string, string> = {
    created: "created this task",
    updated: "updated this task",
    status_changed: `moved this task to ${activity.data?.status ?? "a new status"}`,
    assigned: "was assigned to this task",
    commented: "commented on this task",
  };
  return actionMap[activity.action] ?? activity.message ?? "made a change";
}

export default function ActivityRow({ activity }: { activity: any }) {
  const config = actionIconMap[activity.action] ?? actionIconMap.updated;
  const Icon = config.icon;

  return (
    <div className="flex gap-3">
      <div className={`size-8 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
        <Icon className={`size-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm">
          <span className="font-medium">{activity.actor_detail?.full_name}</span>{" "}
          {activityMessage(activity)}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">{timeAgo(activity.created_at)}</p>
      </div>
    </div>
  );
}