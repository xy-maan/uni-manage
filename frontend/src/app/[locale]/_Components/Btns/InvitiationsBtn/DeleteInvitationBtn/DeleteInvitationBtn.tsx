// Btns/DeleteInvitationBtn/DeleteInvitationBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteInvitationAction } from "@/Actions/invitations/deleteInvitation.action";

export default function DeleteInvitationBtn({
  invitation_id,
  name,
  setInvitations,
}: {
  invitation_id: number;
  name: string;
  setInvitations: (invitations: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDeleteInvitation() {
    setLoading(true);
    const { ok } = await DeleteInvitationAction(invitation_id);

    if (ok) {
      setInvitations((prev: any) => prev.filter((i: any) => i.id !== invitation_id));
      toast.success("Invitation deleted successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Badge variant="outline" className="text-destructive hover:text-destructive text-xs">
          <Trash2 className="size-3" />
          Cancel
        </Badge>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Cancel Invitation</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <p className="text-sm text-muted-foreground">
            Cancel invitation sent to {name}?
          </p>
          <DialogFooter className="mt-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Back
            </Button>
            <Button
              variant="destructive"
              className="py-0 h-8"
              onClick={handleDeleteInvitation}
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Cancel Invitation"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}