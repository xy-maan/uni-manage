// Btns/EditFeedbackBtn/EditFeedbackBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pen } from "lucide-react";
import { toast } from "sonner";
import { UpdateFeedbackAction } from "@/Actions/feedback/updateFeedback.action";

export default function EditFeedbackBtn({
  feedback_id,
  currentContent,
  setFeedback,
}: {
  feedback_id: number;
  currentContent: string;
  setFeedback: (feedback: any) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(currentContent);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    const { payload, ok } = await UpdateFeedbackAction(feedback_id, { content });
    setLoading(false);

    if (ok) {
      setFeedback((prev: any) => prev.map((f: any) => (f.id === feedback_id ? payload : f)));
      setEditing(false);
    } else {
      toast.error("faild update", { position: "top-center", duration: 2000 });
    }
  }

  if (editing) {
    return (
      <div className="flex items-end gap-2">
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="resize-none" rows={2} />
        <Button size="sm" className="h-7 py-0" onClick={handleSave} disabled={loading}>Save</Button>
        <Button size="sm" variant="outline" className="h-7 py-0" onClick={() => setEditing(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <button onClick={() => setEditing(true)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
      <Pen className="size-3" /> Edit
    </button>
  );
}