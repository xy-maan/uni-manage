// StudentDashboardClient.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { Calendar, ArrowRight } from "lucide-react";
import CardsInfoDashboard from "./CardsInfoDashboard";
import ActivityRow from "../../ActivityRow";
import QuickAction from "./QuickAction";
import EmptyProjectCard from "../../EmptyProjectCard";
import TaskRow from "../../TaskRow";
// import CardsInfoDashboard from "../CardsInfoDashboard";
// import ReviewDashboard from "../ReviewDashboard";
// import QuickAction from "../QuickAction";
// import TaskRow from "./TaskRow";
// import ActivityRow from "./ActivityRow";
// import EmptyProjectCard from "./EmptyProjectCard";

function formatDate(dateString: string | null) {
  if (!dateString) return "No due date";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function StudentDashboardClient({
  project,
  myProjectsCount,
  tasks,
  myUpcomingTasks,
  activity,
  completedCount,
  pendingCount,
  teamCount,
}: {
  project: any;
  myProjectsCount: number;
  tasks: any[];
  myUpcomingTasks: any[];
  activity: any[];
  completedCount: number;
  pendingCount: number;
  teamCount: number;
}) {
  const totalTasks = tasks.length;
  const completionPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const primarySupervisor = project?.supervisors?.find((s: any) => s.role === "primary");

  return (
    <div>
      {project ? (
        <div className="card-project text-card-foreground rounded-xl flex flex-col mb-8 border-2 border-primary/20 relative h-full bg-linear-to-br from-primary/5 to-secondary/5">
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="leading-none">{project.name}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {primarySupervisor
                    ? `Supervised by ${primarySupervisor.supervisor_detail?.full_name}`
                    : project.description || "No description provided"}
                </p>
              </div>
              <Badge className="capitalize">{project.status.replace("_", " ")}</Badge>
            </div>

            <div className="progress">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground font-medium">Project Progress</span>
                <span>{completionPercent}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={completionPercent}
                className="relative w-full rounded-full h-3 bg-primary/20 overflow-hidden"
              >
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card-footer px-6 pb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Calendar className="size-4" />
              <span>
                {project.updated_at
                  ? `Updated ${formatDate(project.updated_at)}`
                  : "No recent updates"}
              </span>
            </div>
            <Button asChild>
              <Link href={`/student/projects/${project.id}`}>
                View Project
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <EmptyProjectCard />
      )}

      {/* Stats Cards */}
      <CardsInfoDashboard
        variant="student"
        completedCount={completedCount}
        pendingCount={pendingCount}
        teamCount={teamCount}
        documentsCount={0 /* مفيش endpoint مخصص للـ documents، اربطها لو فيه */}
      />

      <div className="gap-8 grid lg:grid-cols-3">
        {/* Upcoming Tasks */}
        <div className="upcoming lg:col-span-2">
          <Card className="p-0">
            <CardHeader className="px-6 pt-6 gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h4 className="leading-none font-medium">Upcoming Tasks</h4>
                  <p className="text-muted-foreground">Your assigned tasks for this week</p>
                </div>
                {project && (
                  <Button variant="ghost" asChild>
                    <Link href={`/student/projects/${project.id}?tab=tasks`}>View All</Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-6 px-6">
              <div className="space-y-4">
                {myUpcomingTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No upcoming tasks assigned to you
                  </p>
                )}
                {myUpcomingTasks.map((task) => (
                  <TaskRow key={task.id} task={task} projectId={project?.id} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="p-0">
            <CardHeader className="px-6 pt-6 gap-1.5">
              <h4 className="leading-none">Recent Activity</h4>
            </CardHeader>
            <CardContent className="pb-6 px-6">
              <div className="space-y-4">
                {activity.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
                {activity.map((a) => (
                  <ActivityRow key={a.id} activity={a} />
                ))}
              </div>
              {project && (
                <Button variant="ghost" className="mt-4 w-full" asChild>
                  <Link href={`/student/projects/${project.id}`}>View All Activity</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="p-0">
            <CardHeader className="px-6 pt-6 gap-1.5">
              <h4 className="leading-none">Quick Actions</h4>
            </CardHeader>
            <CardContent className="pb-6 px-6">
              <QuickAction variant="student" hasProject={!!project}   projectId={project?.id}/>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}