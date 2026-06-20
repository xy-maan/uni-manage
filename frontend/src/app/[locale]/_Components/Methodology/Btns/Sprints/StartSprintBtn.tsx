// Btns/StartSprintBtn/StartSprintBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { UpdateSprintAction } from "@/Actions/methodology/Sprints/UpdateSprint.action";

export default function StartSprintBtn({
  sprint_id,
  setSprints,
}: {
  sprint_id: number;
  setSprints: (sprints: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    const { payload, ok } = await UpdateSprintAction(sprint_id, { status: "active" });
    setLoading(false);

    if (ok) {
      setSprints((prev: any) => prev.map((s: any) => (s.id === sprint_id ? payload : s)));
      toast.success("Sprint started successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild start sprint", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Button size="sm" className="gap-1.5" onClick={handleStart} disabled={loading}>
      <Play className="size-3.5" />
      {loading ? "Starting..." : "Start"}
    </Button>
  );
}