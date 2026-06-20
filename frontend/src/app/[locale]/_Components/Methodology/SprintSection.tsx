"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import StartSprintBtn from "./Btns/Sprints/StartSprintBtn";
import CompleteSprintBtn from "./Btns/Sprints/CompleteSprintBtn";
import CreateSprintBtn from "./Btns/Sprints/CreateSprintBtn";
import DeleteSprintBtn from "./Btns/Sprints/DeleteSprintBtn";
import { GetSprintsAction } from "@/Actions/methodology/Sprints/GetSprints.action";
import { Sprint } from "@/types/methodology";
const statusConfig: Record<string, { label: string; class: string }> = {
  planned:   { label: "Planned",   class: "bg-gray-500/20 text-gray-500" },
  active:    { label: "Active",    class: "bg-green-500/20 text-green-500" },
  completed: { label: "Completed", class: "bg-blue-500/20 text-blue-500" },
};

export default function SprintsSection({
  projectId,
  isParticipant,
}: {
  projectId: number;
  isParticipant: boolean;
}) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSprints() {
    setLoading(true);
    try {
      const { ok, payload } = await GetSprintsAction();
      console.log(payload)
      if (ok) {
        setSprints(payload.filter((s: Sprint) => s.project === projectId));
      } else {
        toast.error("Failed to load sprints", { position: "top-center", duration: 2000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong loading sprints", { position: "top-center", duration: 2000 });
    } finally {
      setLoading(false); 
    }
  }

  useEffect(() => {
    loadSprints();
  }, [projectId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading sprints...</p>;

  return (
    <Card className="p-0 mb-5">
      <CardHeader className="p-6 pb-3 flex items-center justify-between">
        <h4 className="text-sm">Sprints ({sprints.length})</h4>
        {isParticipant && (
          <CreateSprintBtn
            projectId={projectId}
            onCreated={(newSprint) => setSprints((prev) => [...prev, newSprint])}
          />
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-3">
        {sprints.length === 0 && (
          <p className="text-sm text-muted-foreground">No sprints yet</p>
        )}
        {sprints.map((sprint) => {
          const status = statusConfig[sprint.status] ?? statusConfig.planned;
          return (
            <div key={sprint.id} className="p-3 rounded-lg border">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{sprint.name}</p>
                <Badge className={`border-0 text-xs ${status.class}`}>{status.label}</Badge>
              </div>
              {sprint.goal && (
                <p className="text-xs text-muted-foreground mt-1">{sprint.goal}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(sprint.starts_at).toLocaleDateString()} → {new Date(sprint.ends_at).toLocaleDateString()}
              </p>

              {isParticipant && (
                <div className="flex gap-2 mt-3">
                  {sprint.status === "planned" && (
                    <StartSprintBtn sprint_id={sprint.id} setSprints={setSprints} />
                  )}
                  {sprint.status === "active" && (
                    <CompleteSprintBtn sprint_id={sprint.id} setSprints={setSprints} />
                  )}
                  <DeleteSprintBtn sprint_id={sprint.id} name={sprint.name} setSprints={setSprints} />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}