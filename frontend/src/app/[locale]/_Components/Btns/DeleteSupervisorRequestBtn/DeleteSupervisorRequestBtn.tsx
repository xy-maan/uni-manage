// Btns/DeleteSupervisorRequestBtn/DeleteSupervisorRequestBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteSupervisorRequestAction } from "@/Actions/supervisor/supervisorRequests/deleteSupervisorRequest.action";
import { SupervisorRequest } from "@/types/supervisor";

export default function DeleteSupervisorRequestBtn({
  request_id,
  name,
  setRequests,
}: {
  request_id: number;
  name: string;
  setRequests: (requests: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteSupervisorRequestAction(request_id);
    setLoading(false);

    if (ok) {
      setRequests((prev: any) => prev.filter((r: any) => r.id !== request_id));
      toast.success("Request cancelled successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild cancel", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Badge variant="outline" className="text-destructive hover:text-destructive text-xs cursor-pointer">
          <Trash2 className="size-3" />
          Cancel
        </Badge>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Cancel Supervisor Request</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <p className="text-sm text-muted-foreground">Cancel the request sent to {name}?</p>
          <DialogFooter className="mt-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Back</Button>
            <Button variant="destructive" className="py-0 h-8" onClick={handleDelete} disabled={loading}>
              {loading ? "Cancelling..." : "Cancel Request"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}