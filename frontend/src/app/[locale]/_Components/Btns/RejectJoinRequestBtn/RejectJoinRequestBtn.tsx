// Btns/RejectJoinRequestBtn/RejectJoinRequestBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { RejectJoinRequestAction } from "@/Actions/joinRequests/rejectJoinRequest.action";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { JoinRequest } from "@/types/JoinRequests";
export default function RejectJoinRequestBtn({
  join_request_id,
  setJoinRequests,
}: {
  join_request_id: number;
  setJoinRequests: React.Dispatch<React.SetStateAction<JoinRequest[]>>;
}) {


  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  async function handleReject() {
    setLoading(true);
    const { ok } = await RejectJoinRequestAction(join_request_id);

    if (ok) {
      setJoinRequests((prev) => prev.filter((r) => r.id !== join_request_id));
      toast.success("Request rejected successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild reject", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  return (
        <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-destructive hover:text-destructive text-xs">
          <X className="size-3" />
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Reject Response</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <p className="text-sm text-muted-foreground">
            Delete Request Join?
          </p>
          <DialogFooter className="mt-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Back
            </Button>
            <Button
              variant="destructive"
              className="py-0 h-8"
              onClick={handleReject}
              disabled={loading}
            >
              {loading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
    // <Button variant="outline" className="flex-1 py-0 gap-1.5" onClick={handleReject} disabled={loading}>
    //   <X className="mr-1 size-4" />
    //   {loading ? "Rejecting..." : "Reject"}
    // </Button>
  );
}