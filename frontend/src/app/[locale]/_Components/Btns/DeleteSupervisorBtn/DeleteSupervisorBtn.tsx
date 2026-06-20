// Btns/DeleteSupervisorBtn/DeleteSupervisorBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteSupervisorAction } from "@/Actions/supervisor/deleteSupervisor.action";

export default function DeleteSupervisorBtn({
  supervisor_id,
  name,
  setSupervisors,
}: {
  supervisor_id: number;
  name: string;
  setSupervisors: (supervisors: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteSupervisorAction(supervisor_id);
    setLoading(false);

    if (ok) {
      setSupervisors((prev: any) => prev.filter((s: any) => s.id !== supervisor_id));
      toast.success("Supervisor removed successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild remove", { position: "top-center", duration: 2000 });
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
          <DialogTitle>Remove Supervisor</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <p className="text-sm text-muted-foreground">Remove {name} from supervising this project?</p>
          <DialogFooter className="mt-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="py-0 h-8" onClick={handleDelete} disabled={loading}>
              {loading ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}