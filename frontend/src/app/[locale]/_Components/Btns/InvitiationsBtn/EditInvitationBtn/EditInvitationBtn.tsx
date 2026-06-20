// Btns/EditInvitationBtn/EditInvitationBtn.tsx
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
import { UpdateInvitationAction } from "@/Actions/invitations/updateInvitation.action";
import { Badge } from "@/components/ui/badge";


export default function EditInvitationBtn({
  invitation_id,
  currentMessage,
  setInvitations,
}: {
  invitation_id: number;
  currentMessage: string;
  setInvitations: (invitations: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(currentMessage);

  async function handleSave() {
    setLoading(true);
    const { payload, ok } = await UpdateInvitationAction(invitation_id, { message });

    if (ok) {
      setInvitations((prev: any) => prev.map((i: any) => (i.id === invitation_id ? payload : i)));
      toast.success("Invitation updated successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild update invitation", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Badge variant="outline" className="bg-primary! px-3 text-xs">
            <Pen className="size-3.5" />
          Edit
        </Badge>
      
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Edit Invitation</DialogTitle>
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