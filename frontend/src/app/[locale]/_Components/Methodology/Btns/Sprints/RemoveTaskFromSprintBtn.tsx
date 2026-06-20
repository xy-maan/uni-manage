// Btns/RemoveTaskFromSprintBtn/RemoveTaskFromSprintBtn.tsx
"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { RemoveTaskFromSprintAction } from "@/Actions/methodology/SprintTasks/RemoveTaskFromSprint.action";

export default function RemoveTaskFromSprintBtn({
  sprint_task_id,
  setSprintTasks,
}: {
  sprint_task_id: number;
  setSprintTasks: (sprintTasks: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setLoading(true);
    const { ok } = await RemoveTaskFromSprintAction(sprint_task_id);
    setLoading(false);

    if (ok) {
      setSprintTasks((prev: any) => prev.filter((st: any) => st.id !== sprint_task_id));
    } else {
      toast.error("faild remove task", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <button onClick={handleRemove} disabled={loading} className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50">
      <X className="size-4" />
    </button>
  );
}