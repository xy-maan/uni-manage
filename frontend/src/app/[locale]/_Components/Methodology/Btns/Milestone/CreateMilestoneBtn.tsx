// Btns/CreateMilestoneBtn/CreateMilestoneBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateMilestoneAction } from "@/Actions/methodology/Milestones/CreateMilestone.action";

export default function CreateMilestoneBtn({
  projectId,
  position,
  onCreated,
}: {
  projectId: number;
  position: number;
  onCreated: (milestone: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");

  async function handleCreate() {
    if (!name || !dueAt) {
      toast.error("Name and due date are required", { position: "top-center", duration: 2000 });
      return;
    }

    setLoading(true);
    const { payload, ok } = await CreateMilestoneAction({
      project: projectId,
      name,
      description,
      due_at: dueAt,
      status: "planned",
      position,
    });
    setLoading(false);

    if (ok) {
      onCreated(payload);
      toast.success("Milestone created successfully", { position: "top-center", duration: 2000 });
      setName("");
      setDescription("");
      setDueAt("");
      setOpen(false);
    } else {
      toast.error("faild create milestone", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          New Milestone
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Create Milestone</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Prototype Review" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none" rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="mt-3">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="py-0 h-8" onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create Milestone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}