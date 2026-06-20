// Btns/EditColumnBtn/EditColumnBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pen } from "lucide-react";
import { toast } from "sonner";
import { UpdateColumnAction } from "@/Actions/methodology/BoardColumns/UpdateColumn.action";

export default function EditColumnBtn({
  column,
  setColumns,
}: {
  column: any;
  setColumns: (columns: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(column.name);
  const [wipLimit, setWipLimit] = useState(column.wip_limit ? String(column.wip_limit) : "");

  async function handleSave() {
    setLoading(true);
    const body: any = { name };
    body.wip_limit = wipLimit ? Number(wipLimit) : null;

    const { payload, ok } = await UpdateColumnAction(column.id, body);
    setLoading(false);

    if (ok) {
      setColumns((prev: any) => prev.map((c: any) => (c.id === column.id ? payload : c)));
      toast.success("Column updated successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild update column", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Pen className="size-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Edit Column</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>WIP Limit</Label>
            <Input type="number" value={wipLimit} onChange={(e) => setWipLimit(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="mt-3">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="py-0 h-8" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}