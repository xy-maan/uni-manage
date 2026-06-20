// Btns/DeleteTaskBtn/DeleteTaskBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteTaskAction } from "@/Actions/Tasks/tasks/deleteTask.action";

export default function DeleteTaskBtn({
  task_id,
  title,
  setTasks,
}: {
  task_id: number;
  title: string;
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteTaskAction(task_id);
    setLoading(false);

    if (ok) {
      setTasks((prev) => prev.filter((t) => t.id !== task_id));
      toast.success("Task deleted successfully", { position: "top-center", duration: 2000 });
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
          <DialogTitle>Delete Task</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <p className="text-sm text-muted-foreground">Delete "{title}"?</p>
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