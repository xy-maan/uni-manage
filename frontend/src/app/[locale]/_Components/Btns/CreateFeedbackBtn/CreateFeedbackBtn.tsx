// Btns/CreateFeedbackBtn/CreateFeedbackBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateFeedbackAction } from "@/Actions/feedback/createFeedback.action";

export default function CreateFeedbackBtn({
  projectId,
  taskId,
  deliverableId,
  meetingId,
  onCreated,
}: {
  projectId?: number;
  taskId?: number;
  deliverableId?: number;
  meetingId?: number;
  onCreated: (feedback: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  async function handleCreate() {
    if (!content) {
      toast.error("Feedback content is required", { position: "top-center", duration: 2000 });
      return;
    }

    setLoading(true);
    const body: any = { content };
    if (projectId) body.project = projectId;
    if (taskId) body.task = taskId;
    if (deliverableId) body.deliverable = deliverableId;
    if (meetingId) body.meeting = meetingId;

    const { payload, ok } = await CreateFeedbackAction(body);
    setLoading(false);

    if (ok) {
      onCreated(payload);
      toast.success("Feedback added successfully", { position: "top-center", duration: 2000 });
      setContent("");
      setOpen(false);
    } else {
      toast.error("faild add feedback", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Add Feedback</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-2">
          <Label>Content</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="resize-none" rows={3} />
        </div>
        <DialogFooter className="mt-3">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="py-0 h-8" onClick={handleCreate} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}