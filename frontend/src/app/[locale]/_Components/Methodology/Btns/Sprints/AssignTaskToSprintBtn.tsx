// Btns/AssignTaskToSprintBtn/AssignTaskToSprintBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AssignTaskToSprintAction } from "@/Actions/methodology/SprintTasks/AssignTaskToSprint.action";

export default function AssignTaskToSprintBtn({
  sprintId,
  availableTasks,
  onAssigned,
}: {
  sprintId: number;
  availableTasks: any[];
  onAssigned: (assignment: any) => void;
}) {
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!taskId) return;
    setLoading(true);
    const { payload, ok } = await AssignTaskToSprintAction({
      sprint: sprintId,
      task: Number(taskId),
    });
    setLoading(false);

    if (ok) {
      onAssigned(payload);
      toast.success("Task assigned to sprint", { position: "top-center", duration: 2000 });
      setTaskId("");
    } else {
      toast.error("faild assign task", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <div className="flex gap-2">
      <Select value={taskId} onValueChange={setTaskId}>
        <SelectTrigger className="h-8 flex-1">
          <SelectValue placeholder="Select a task" />
        </SelectTrigger>
        <SelectContent>
          {availableTasks.map((t) => (
            <SelectItem key={t.id} value={String(t.id)}>{t.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" className="h-8" onClick={handleAssign} disabled={loading || !taskId}>
        Assign
      </Button>
    </div>
  );
}