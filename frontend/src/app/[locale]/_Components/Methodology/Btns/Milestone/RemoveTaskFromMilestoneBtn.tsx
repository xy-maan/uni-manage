// Btns/RemoveTaskFromMilestoneBtn/RemoveTaskFromMilestoneBtn.tsx
"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { RemoveTaskFromMilestoneAction } from "@/Actions/methodology/MilestoneTasks/RemoveTaskFromMilestone.action";

export default function RemoveTaskFromMilestoneBtn({
  milestone_task_id,
  setMilestoneTasks,
}: {
  milestone_task_id: number;
  setMilestoneTasks: (milestoneTasks: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setLoading(true);
    const { ok } = await RemoveTaskFromMilestoneAction(milestone_task_id);
    setLoading(false);

    if (ok) {
      setMilestoneTasks((prev: any) => prev.filter((mt: any) => mt.id !== milestone_task_id));
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