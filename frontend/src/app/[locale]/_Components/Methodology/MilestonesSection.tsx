// MilestonesSection.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CompleteMilestoneBtn from "./Btns/Milestone/CompleteMilestoneBtn";
import DeleteMilestoneBtn from "./Btns/Milestone/DeleteMilestoneBtn";


const statusConfig: Record<string, { label: string; class: string }> = {
  planned:     { label: "Planned",     class: "bg-gray-500/20 text-gray-500" },
  in_progress: { label: "In Progress", class: "bg-amber-500/20 text-amber-500" },
  completed:   { label: "Completed",   class: "bg-green-500/20 text-green-500" },
};

export default function MilestonesSection({
  projectId,
  isParticipant,
}: {
  projectId: number;
  isParticipant: boolean;
}) {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMilestones() {
    setLoading(true);
    const { ok, payload } = await GetMilestonesAction();
    if (ok) {
      setMilestones(
        payload
          .filter((m: any) => m.project === projectId)
          .sort((a: any, b: any) => a.position - b.position)
      );
    } else {
      toast.error("Failed to load milestones", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading milestones...</p>;

  return (
    <Card className="p-0 mb-5">
      <CardHeader className="p-6 pb-3 flex items-center justify-between">
        <h4 className="text-sm">Milestones ({milestones.length})</h4>
        {isParticipant && (
          <CreateMilestoneBtn
            projectId={projectId}
            position={milestones.length + 1}
            onCreated={(newMilestone) => setMilestones((prev) => [...prev, newMilestone])}
          />
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-3">
        {milestones.length === 0 && (
          <p className="text-sm text-muted-foreground">No milestones yet</p>
        )}
        {milestones.map((m) => {
          const status = statusConfig[m.status] ?? statusConfig.planned;
          return (
            <div key={m.id} className="p-3 rounded-lg border">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{m.name}</p>
                <Badge className={`border-0 text-xs ${status.class}`}>{status.label}</Badge>
              </div>
              {m.description && (
                <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
              )}
              {m.due_at && (
                <p className="text-xs text-muted-foreground mt-1">
                  Due {new Date(m.due_at).toLocaleDateString()}
                </p>
              )}

              {isParticipant && (
                <div className="flex gap-2 mt-3">
                  {m.status !== "completed" && (
                    <CompleteMilestoneBtn milestone_id={m.id} setMilestones={setMilestones} />
                  )}
                  <DeleteMilestoneBtn milestone_id={m.id} name={m.name} setMilestones={setMilestones} />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}