// Btns/AssignTaskToMilestoneBtn/AssignTaskToMilestoneBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AssignTaskToMilestoneAction } from "@/Actions/methodology/MilestoneTasks/AssignTaskToMilestone.action";

export default function AssignTaskToMilestoneBtn({
  milestoneId,
  availableTasks,
  onAssigned,
}: {
  milestoneId: number;
  availableTasks: any[];
  onAssigned: (assignment: any) => void;
}) {
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!taskId) return;
    setLoading(true);
    const { payload, ok } = await AssignTaskToMilestoneAction({
      milestone: milestoneId,
      task: Number(taskId),
    });
    setLoading(false);

    if (ok) {
      onAssigned(payload);
      toast.success("Task assigned to milestone", { position: "top-center", duration: 2000 });
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