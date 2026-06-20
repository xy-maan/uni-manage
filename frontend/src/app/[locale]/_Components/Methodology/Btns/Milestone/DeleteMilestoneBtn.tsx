// Btns/DeleteMilestoneBtn/DeleteMilestoneBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteMilestoneAction } from "@/Actions/methodology/Milestones/DeleteMilestone.action";

export default function DeleteMilestoneBtn({
  milestone_id,
  name,
  setMilestones,
}: {
  milestone_id: number;
  name: string;
  setMilestones: (milestones: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteMilestoneAction(milestone_id);
    setLoading(false);

    if (ok) {
      setMilestones((prev: any) => prev.filter((m: any) => m.id !== milestone_id));
      toast.success("Milestone deleted successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="size-7 text-destructive hover:text-destructive">
          <Trash2 className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Delete Milestone</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <p className="text-sm text-muted-foreground">Delete "{name}"?</p>
          <DialogFooter className="mt-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="py-0 h-8" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}