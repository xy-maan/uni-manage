// Btns/CompleteSprintBtn/CompleteSprintBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { UpdateSprintAction } from "@/Actions/methodology/Sprints/UpdateSprint.action";

export default function CompleteSprintBtn({
  sprint_id,
  setSprints,
}: {
  sprint_id: number;
  setSprints: (sprints: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    const { payload, ok } = await UpdateSprintAction(sprint_id, { status: "completed" });
    setLoading(false);

    if (ok) {
      setSprints((prev: any) => prev.map((s: any) => (s.id === sprint_id ? payload : s)));
      toast.success("Sprint completed successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild complete sprint", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Button size="sm" variant="outline" className="gap-1.5" onClick={handleComplete} disabled={loading}>
      <CheckCircle className="size-3.5" />
      {loading ? "Completing..." : "Complete"}
    </Button>
  );
}