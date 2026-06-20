"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import Loading from "../CommunityComponent/Loading";
import EditTaskBtn from "../Btns/EditTaskBtn/EditTaskBtn";
import DeleteTaskBtn from "../Btns/DeleteTaskBtn/DeleteTaskBtn";
import CreateTaskBtn from "../Btns/CreateTaskBtn/CreateTaskBtn";
import { GetTasksAction } from "@/Actions/Tasks/tasks/getAllTasks.action";
import { GetTaskAction } from "@/Actions/Tasks/tasks/getTask.action";
import { Membership } from "@/types/team";
import { Task } from "@/types/tasks";

export default function TasksSection({
  projectId,
  members,
  isParticipant,
}: {
  projectId: number;
  members: Membership[];
  isParticipant: boolean;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    setLoading(true);
    const { ok, payload } = await GetTaskAction(projectId);
    if (ok) {
      setTasks(payload);
    } else {
      toast.error("Failed to load tasks", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  if (loading) return<Loading />;

  return (
    <Card className="p-0 mb-5">
      <CardHeader className="p-6 pb-3 flex items-center justify-between">
        <h4 className="text-sm">Tasks ({tasks.length})</h4>
        {isParticipant && (
          <CreateTaskBtn
            projectId={projectId}
            members={members}
            onCreated={(newTask) => setTasks((prev) => [...prev, newTask])}
          />
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-2">
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">No tasks yet</p>
        )}
        {tasks.map((task) => (
          <div key={task.id} className="p-3 rounded-lg border flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium">{task.title}</p>
              {task.assignee_detail && (
                <p className="text-xs text-muted-foreground">
                  {task.assignee_detail.full_name}
                </p>
              )}
            </div>
            {isParticipant && (
              <div className="flex items-center gap-1 shrink-0">
                <EditTaskBtn task={task} members={members} setTasks={setTasks} />
                <DeleteTaskBtn task_id={task.id} title={task.title} setTasks={setTasks} />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}