// OverviewProject.tsx
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TrendingUp, Activity, Users, CircleCheck, ExternalLink, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Membership, Project, Supervsiors, Technology } from "@/types/team";

import Loading from "../CommunityComponent/Loading";
import { Link } from '@/i18n/navigation';
import { GetTasksAction } from "@/Actions/Tasks/tasks/getAllTasks.action";
import { GetDeliverablesAction } from "@/Actions/Deliverables/getDeliverables.action";
import { Deliverable } from "@/types/deliverable";
import { Task } from "@/types/task";
import { TaskActivity } from "@/types/tasks";
import { GetTaskActivityListAction } from "@/Actions/Tasks/tasks/getAllTasksActivity.action";

const methodologyLabel: Record<string, string> = {
  kanban: "Kanban",
  sprint: "Sprint (Agile)",
  milestone: "Milestone-based",
};

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function activityMessage(activity: TaskActivity) {
  const actionMap: Record<string, string> = {
    created: "created this task",
    updated: "updated this task",
    status_changed: `moved to ${activity.data?.status ?? "a new status"}`,
    assigned: "was assigned",
    commented: "commented",
  };
  return actionMap[activity.action] ?? activity.message ?? "made a change";
}

export default function OverviewProject({
  project,
  role,
}: {
  project: Project;
  role: string;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [activity, setActivity] = useState<TaskActivity[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOverviewData() {
    setLoading(true);
    try {
        const tasksRes=await  GetTasksAction(project.id)
        const deliverablesRes=await GetDeliverablesAction()
        const activityRes=await GetTaskActivityListAction()
      if (tasksRes.ok) setTasks(tasksRes.payload);
      else toast.error("Failed to load tasks", { position: "top-center", duration: 2000 });

      if (deliverablesRes.ok) {
        setDeliverables(deliverablesRes.payload.filter((d: Deliverable) => d.project === project.id));
      } else {
        toast.error("Failed to load deliverables", { position: "top-center", duration: 2000 });
      }

      if (activityRes.ok && activityRes.payload) {
         const projectTaskIds = tasksRes.ok && tasksRes.payload
    ? tasksRes.payload.map((t: Task) => t.id)
    : [];
        const filtered = activityRes.payload
          .filter((a: TaskActivity) => projectTaskIds.includes(a.task))
          .sort((a: TaskActivity, b: TaskActivity) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setActivity(filtered);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong loading the overview", { position: "top-center", duration: 2000 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverviewData();
  }, [project.id]);

  if (loading) return <Loading />;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const approvedDeliverables = deliverables.filter((d) => d.status === "approved").length;

  const isLeader = project.memberships.some((m: Membership) => m.role === "leader");

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-0">
          <CardContent className="p-4 pb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Completion</p>
              <TrendingUp className="size-5 text-primary" />
            </div>
            <p className="text-2xl font-semibold">{completionPercent}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedTasks} of {totalTasks} tasks
            </p>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-4 pb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">In Progress</p>
              <Activity className="size-5 text-blue-600" />
            </div>
            <p className="text-2xl font-semibold">{inProgressTasks}</p>
            <p className="text-xs text-muted-foreground mt-0.5">active tasks</p>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-4 pb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Team Members</p>
              <Users className="size-5 text-green-600" />
            </div>
            <p className="text-2xl font-semibold">{project.memberships.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">max {project.max_members}</p>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-4 pb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Deliverables</p>
              <CircleCheck className="size-5 text-purple-600" />
            </div>
            <p className="text-2xl font-semibold">{approvedDeliverables}/{deliverables.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">approved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Main Column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Project Information */}
          <Card className="p-0">
            <CardHeader className="p-6 pb-1">
              <h4 className="text-sm">Project Information</h4>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                <div className="flex gap-3">
                  <span className="text-muted-foreground shrink-0 w-24">Type</span>
                  <span className="font-medium capitalize">
                    {project.project_type === "graduation" ? "Graduation Project" : "Course Project"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground shrink-0 w-24">Methodology</span>
                  <span className="font-medium">{methodologyLabel[project.methodology]}</span>
                </div>
                {project.category && (
                  <div className="flex gap-3">
                    <span className="text-muted-foreground shrink-0 w-24">Category</span>
                    <span className="font-medium">{project.category.name}</span>
                  </div>
                )}
                {project.semester && (
                  <div className="flex gap-3">
                    <span className="text-muted-foreground shrink-0 w-24">Semester</span>
                    <span className="font-medium">{project.semester.name}</span>
                  </div>
                )}
                {project.academic_year && (
                  <div className="flex gap-3">
                    <span className="text-muted-foreground shrink-0 w-24">Academic Year</span>
                    <span className="font-medium">{project.academic_year.name}</span>
                  </div>
                )}
                <div className="flex gap-3">
                  <span className="text-muted-foreground shrink-0 w-24">Created</span>
                  <span className="font-medium">{formatDate(project.created_at)}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground shrink-0 w-24">Visibility</span>
                  <span className="font-medium">{project.is_public ? "Public" : "Private"}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground shrink-0 w-24">Team Size</span>
                  <span className="font-medium">{project.min_members}–{project.max_members} members</span>
                </div>
              </div>

              {project.repository_url && (
                <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm">
                  <ExternalLink className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Repository:</span>
                  <Link
                    href={project.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs"
                  >
                    {project.repository_url.replace(/^https?:\/\//, "")}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <Card className="p-0">
              <CardHeader className="p-6 pb-1">
                <h4 className="text-sm">Technologies</h4>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: Technology) => (
                    <Badge key={tech.id} variant="secondary" className="rounded-full">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Proposal / Abstract */}
          {(project.proposal || project.abstract) && (
            <Card className="p-0">
              <CardHeader className="p-6 pb-1">
                <h4 className="text-sm">Project Proposal</h4>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-2">
                {project.proposal && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.proposal}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Side Column */}
        <div className="space-y-4">

          {/* Supervisors */}
          {project.supervisors?.length > 0 && (
            <Card className="p-0">
              <CardHeader className="p-6 pb-3">
                <h4 className="text-sm">Supervisors</h4>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-3">
                {project.supervisors.map((sup: Supervsiors) => (
                  <div key={sup.id} className="flex items-start gap-3">
                    <div className="size-9 relative flex overflow-hidden rounded-full shrink-0">
                      <div className="flex size-full items-center justify-center rounded-full text-xs bg-primary/10 text-primary">
                        {sup.supervisor_detail?.full_name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{sup.supervisor_detail?.full_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {sup.role} Supervisor
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Team */}
          <Card className="p-0">
            <CardHeader className="p-6 pb-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm">Team</h4>
                <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                  <Link href={`/${role}/projects/${project.id}?tab=team`}>
                    Manage
                    <ChevronRight className="size-3 ml-0.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-2">
              {project.memberships.map((m: Membership) => (
                <div key={m.id} className="flex items-center gap-2">
                  <div className="relative flex size-7 overflow-hidden rounded-full shrink-0">
                    <div className="text-xs bg-muted flex size-full items-center justify-center rounded-full">
                      {m.user_detail?.full_name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{m.user_detail?.full_name}</p>
                  </div>
                  {m.role === "leader" && (
                    <Badge
                      variant="outline"
                      className="text-xs capitalize py-0 border-amber-300 text-amber-700 dark:text-amber-400"
                    >
                      Leader
                    </Badge>
                  )}
                  {m.role === "co_leader" && (
                    <Badge variant="outline" className="text-xs capitalize py-0">
                      Co-Leader
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="p-0">
            <CardHeader className="p-6 pb-3">
              <h4 className="text-sm">Recent Activity</h4>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {activity.length === 0 ? (
                <p className="text-xs text-muted-foreground">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {activity.map((a) => (
                    <div key={a.id} className="flex gap-2 text-xs">
                      <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <span className="font-medium">{a.actor_detail?.full_name}</span>
                        <span className="text-muted-foreground"> {activityMessage(a)}</span>
                        <p className="text-muted-foreground">{timeAgo(a.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}