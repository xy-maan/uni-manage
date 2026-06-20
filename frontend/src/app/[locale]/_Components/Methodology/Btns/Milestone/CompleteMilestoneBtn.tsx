// Btns/CompleteMilestoneBtn/CompleteMilestoneBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { UpdateMilestoneAction } from "@/Actions/methodology/Milestones/UpdateMilestone.action";

export default function CompleteMilestoneBtn({
  milestone_id,
  setMilestones,
}: {
  milestone_id: number;
  setMilestones: (milestones: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    const { payload, ok } = await UpdateMilestoneAction(milestone_id, { status: "completed" });
    setLoading(false);

    if (ok) {
      setMilestones((prev: any) => prev.map((m: any) => (m.id === milestone_id ? payload : m)));
      toast.success("Milestone completed successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild complete milestone", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Button size="sm" className="gap-1.5" onClick={handleComplete} disabled={loading}>
      <CheckCircle className="size-3.5" />
      {loading ? "Completing..." : "Mark Complete"}
    </Button>
  );
}