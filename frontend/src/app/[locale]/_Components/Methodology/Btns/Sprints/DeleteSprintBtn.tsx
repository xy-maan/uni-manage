// Btns/DeleteSprintBtn/DeleteSprintBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteSprintAction } from "@/Actions/methodology/Sprints/DeleteSprint.action";

export default function DeleteSprintBtn({
  sprint_id,
  name,
  setSprints,
}: {
  sprint_id: number;
  name: string;
  setSprints: (sprints: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteSprintAction(sprint_id);
    setLoading(false);

    if (ok) {
      setSprints((prev: any) => prev.filter((s: any) => s.id !== sprint_id));
      toast.success("Sprint deleted successfully", { position: "top-center", duration: 2000 });
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
          <DialogTitle>Delete Sprint</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <p className="text-sm text-muted-foreground">Delete "{name}"? This action cannot be undone.</p>
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