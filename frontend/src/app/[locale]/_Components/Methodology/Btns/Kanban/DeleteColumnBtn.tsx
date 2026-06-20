// Btns/DeleteColumnBtn/DeleteColumnBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteColumnAction } from "@/Actions/methodology/BoardColumns/DeleteColumn.action";

export default function DeleteColumnBtn({
  column_id,
  name,
  setColumns,
}: {
  column_id: number;
  name: string;
  setColumns: (columns: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteColumnAction(column_id);
    setLoading(false);

    if (ok) {
      setColumns((prev: any) => prev.filter((c: any) => c.id !== column_id));
      toast.success("Column deleted successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="size-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Delete Column</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <p className="text-sm text-muted-foreground">Delete "{name}" column? Tasks inside will need to be moved first.</p>
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