// LabelsSection.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { GetAllLabelsAction } from "@/Actions/Tasks/labels/getAllLabels.action";
import CreateLabelBtn from "../Btns/CreateLabelBtn/CreateLabelBtn";
import EditLabelBtn from "../Btns/EditLabelBtn/EditLabelBtn";
import DeleteLabelBtn from "../Btns/DeleteLabelBtn/DeleteLabelBtn";
import { Label } from "@/types/tasks";
import Loading from "../CommunityComponent/Loading";
export default function LabelsSection({
  projectId,
  isParticipant,
}: {
  projectId: number;
  isParticipant: boolean;
}) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLabels() {
    setLoading(true);
    const { ok, payload } = await GetAllLabelsAction();

    if (ok) {
      setLabels(payload.filter((l: Label) => l.project === projectId));
    } else {
      toast.error("Failed to load labels", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadLabels();
  }, [projectId]);

  // if (loading) return <Loading/>;

  return (
    <Card className="p-0 mb-5">
      <CardHeader className="p-6 pb-3 flex items-center justify-between">
        <h4 className="text-sm">Labels ({labels.length})</h4>
        {isParticipant && (
          <CreateLabelBtn
            projectId={projectId}
            onCreated={(newLabel) => setLabels((prev) => [...prev, newLabel])}
          />
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {labels.length === 0 && (
          <p className="text-sm text-muted-foreground">No labels yet</p>
        )}
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <div key={label.id} className="flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ borderColor: label.color }}>
              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
              <span className="text-xs font-medium">{label.name}</span>
              {isParticipant && (
                <>
                  <EditLabelBtn label={label} setLabels={setLabels} />
                  <DeleteLabelBtn label_id={label.id} setLabels={setLabels} />
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}