// Btns/RejectInvitationBtn/RejectInvitationBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { RejectInvitationAction } from "@/Actions/invitations/rejectInvitation.action";

export default function RejectInvitationBtn({
  invitation_id,
  setInvitations,
}: {
  invitation_id: number;
  setInvitations: (invitations: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleReject() {
    setLoading(true);
    const { ok } = await RejectInvitationAction(invitation_id);

    if (ok) {
      setInvitations((prev: any) => prev.filter((i: any) => i.id !== invitation_id));
      toast.success("Invitation rejected successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild reject invitation", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  return (
    <Button variant="outline" className="flex-1 py-0 gap-1.5" onClick={handleReject} disabled={loading}>
      <X className="mr-1 size-4" />
      {loading ? "Rejecting..." : "Reject"}
    </Button>
  );
}