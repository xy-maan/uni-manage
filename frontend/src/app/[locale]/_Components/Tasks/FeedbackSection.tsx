// FeedbackSection.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import EditFeedbackBtn from "../Btns/EditFeedbackBtn/EditFeedbackBtn";
import DeleteFeedbackBtn from "../Btns/DeleteFeedbackBtn/DeleteFeedbackBtn";
import CreateFeedbackBtn from "../Btns/CreateFeedbackBtn/CreateFeedbackBtn";
import Loading from "../CommunityComponent/Loading";
import { Feedback } from "@/types/feedback";
import { GetFeedbackAction } from "@/Actions/feedback/getFeedback.action";
import { GetAllFeedbackAction } from "@/Actions/feedback/getAllFeedback.action";
export default function FeedbackSection({
  projectId,
  isSupervisor,
  currentUserEmail,
}: {
  projectId: number;
  isSupervisor: boolean;
  currentUserEmail: string;
}) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
console.log("currentUserEmail",currentUserEmail)
  async function loadFeedback() {
    setLoading(true);
    const { ok, payload } = await GetAllFeedbackAction();
    if (ok) {
      console.log("feed",feedback)
      setFeedback(payload.filter((f: Feedback) => f.project === projectId));
    } else {
      toast.error("Failed to load feedback", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadFeedback();
  }, [projectId]);

   if (loading) return <Loading/>;

  return (
    <Card className="p-0 mb-5">
      <CardHeader className="p-6 pb-3 flex items-center justify-between">
        <h4 className="text-sm">Feedback ({feedback.length})</h4>
        {isSupervisor && (
          <CreateFeedbackBtn
            projectId={projectId}
            onCreated={(newFeedback) => setFeedback((prev) => [...prev, newFeedback])}
          />
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-3">
        {feedback.length === 0 && (
          <p className="text-sm text-muted-foreground">No feedback yet</p>
        )}
        {feedback.map((f) => (
          <div key={f.id} className="p-3 rounded-lg border">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">{f.author_detail?.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(f.created_at).toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{f.content}</p>
            {f.author_detail.email === currentUserEmail && (
              <div className="flex gap-2 mt-2">
                <EditFeedbackBtn feedback_id={f.id} currentContent={f.content} setFeedback={setFeedback} />
                <DeleteFeedbackBtn feedback_id={f.id} setFeedback={setFeedback} />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}