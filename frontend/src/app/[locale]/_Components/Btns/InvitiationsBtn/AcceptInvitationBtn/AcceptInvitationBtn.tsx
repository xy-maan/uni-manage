// Btns/AcceptInvitationBtn/AcceptInvitationBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { AcceptInvitationAction } from "@/Actions/invitations/acceptInvitation.action";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Invitation } from "@/types/invitations";
import { Membership } from "@/types/team";
export default function AcceptInvitationBtn({
  invitation_id,
  setInvitations,
  onAccepted,
}: {
  invitation_id: number;
  setInvitations: React.Dispatch<React.SetStateAction<Invitation[]>>;
  // setInvitations: (invitations: any) => void;
  // onAccepted?: (membership: any) => void;
  onAccepted?: (membership: Membership) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  async function handleAccept() {
    setLoading(true);
    const { payload, ok } = await AcceptInvitationAction(invitation_id);

    if (ok) {
      setInvitations((prev) => prev.filter((i) => i.id !== invitation_id));
      onAccepted?.(payload);
      toast.success("Invitation accepted successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild accept invitation", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  return (
      <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-destructive hover:text-destructive text-xs">
              <Check className="size-3" />
              Accept
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
            <DialogHeader>
              <DialogTitle>Accept Response</DialogTitle>
            </DialogHeader>
            <div className="w-full">
              <p className="text-sm text-muted-foreground">
                Accept Request Join?
              </p>
              <DialogFooter className="mt-3">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Back
                </Button>
                <Button
                  variant="destructive"
                  className="py-0 h-8"
                  onClick={handleAccept}
                  disabled={loading}
                >
                  {loading ? "Accepting..." : "Accept"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

  );
}