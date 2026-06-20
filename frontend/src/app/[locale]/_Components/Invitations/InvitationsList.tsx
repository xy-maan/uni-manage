"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Invitation } from "@/types/invitations";
import AcceptInvitationBtn from "../Btns/InvitiationsBtn/AcceptInvitationBtn/AcceptInvitationBtn";
import RejectInvitationBtn from "../Btns/InvitiationsBtn/RejectInvitationBtn/RejectInvitationBtn";

export default function InvitationsList({
  initialInvitations,
}: {
  initialInvitations: Invitation[];
}) {
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);

  if (invitations.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground">No pending invitations</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-2xl">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex items-start gap-3 p-4 rounded-lg border"
        >
          <Mail className="size-4 text-muted-foreground shrink-0 mt-1" />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {/* {invitation.project_detail?.name ?? "Project Invitation"} */}
            </p>
            <p className="text-xs text-muted-foreground">
              Invited by {invitation.invited_by_detail?.full_name}
            </p>
            {invitation.message && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                "{invitation.message}"
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <AcceptInvitationBtn
                invitation_id={invitation.id}
                setInvitations={setInvitations}
              />
              <RejectInvitationBtn
                invitation_id={invitation.id}
                setInvitations={setInvitations}
              />
            </div>
          </div>

          <Badge className="bg-amber-500/20 text-amber-600 border-0 shrink-0">
            Pending
          </Badge>
        </div>
      ))}
    </div>
  );
}