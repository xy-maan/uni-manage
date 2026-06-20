"use client";
import { useContext, useState, useEffect } from "react";
import { Bell, Mail } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { NotificationCountContext } from "@/app/Providers/NotificationCountProvider";
import { GetInvitationsAction } from "@/Actions/invitations/getInvitations.action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Invitation } from "@/types/invitations";

import { Badge } from "@/components/ui/badge";
import AcceptInvitationBtn from "./AcceptInvitationBtn/AcceptInvitationBtn";
import RejectInvitationBtn from "./RejectInvitationBtn/RejectInvitationBtn";

export default function EditInvitationBtn() {
  const context = useContext(NotificationCountContext);
  if (!context) {
    throw new Error("Not Exit");
  }
  const { invitationCount, setInvitationCount } = context;

  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  const [open, setOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(false);

  async function loadInvitations() {
    setLoading(true);
    const { ok, payload } = await GetInvitationsAction();
    if (ok) {
      const pending = payload.filter((inv: Invitation) => inv.status === "pending");
      setTotalPending(pending.length);
      setInvitations(pending.slice(0, 3));
    }
    setLoading(false);
  }

  useEffect(() => {
    if (open) {
      loadInvitations();
    }
  }, [open]);

  useEffect(() => {
    setInvitationCount(totalPending);
  }, [totalPending]);

  function handleViewAll() {
    setOpen(false);
    router.push(`/${role}/invitations`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-10 rounded-md px-6 flex-1 relative"
      >
        <Bell className="mr-2 h-5 w-5" />
        Invitations
        {invitationCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
            {invitationCount}
          </span>
        )}
      </button>

      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle className="flex gap-3 items-center">
            <Mail className="size-5" />
            Team Invitations
          </DialogTitle>
          <DialogDescription>
            Review and respond to your pending project invitations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {loading && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Loading invitations...
            </p>
          )}

          {!loading && invitations.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No pending invitations
            </p>
          )}

          {!loading &&
            invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-start gap-3 p-3 rounded-lg border"
              >
                <Mail className="size-4 text-muted-foreground shrink-0 mt-1" />

                <div className="flex-1 min-w-0">
                  {/* <p className="text-sm font-medium truncate">
                    {invitation.project_detail?.name ?? "Project Invitation"}
                  </p> */}
                  <p className="text-xs text-muted-foreground">
                    Invited by {invitation.invited_by_detail?.full_name}
                  </p>
                  {invitation.message && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      "{invitation.message}"
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
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

        {!loading && totalPending > 0 && (
          <Button variant="outline" className="w-full" onClick={handleViewAll}>
            View All ({totalPending})
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}