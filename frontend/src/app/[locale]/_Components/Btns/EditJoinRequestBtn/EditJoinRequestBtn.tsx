// Btns/EditJoinRequestBtn/EditJoinRequestBtn.tsx (PATCH — Leader)
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pen } from "lucide-react";
import { toast } from "sonner";
import { UpdateJoinRequestAction } from "@/Actions/joinRequests/updateJoinRequest.action";

export default function EditJoinRequestBtn({
  join_request_id,
  currentMessage,
  setJoinRequests,
}: {
  join_request_id: number;
  currentMessage: string;
  setJoinRequests: (joinRequests: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(currentMessage ?? "");

  async function handleSave() {
    setLoading(true);
    const { payload, ok } = await UpdateJoinRequestAction(join_request_id, { message });

    if (ok) {
      setJoinRequests((prev: any) => prev.map((r: any) => (r.id === join_request_id ? payload : r)));
      toast.success("Join request updated successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild update", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="size-7 shrink-0">
          <Pen className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Edit Join Request</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-2">
          <Label>Message</Label>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="resize-none" rows={3} />
        </div>
        <DialogFooter className="mt-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="py-0 h-8" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}