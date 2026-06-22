import { Mail } from "lucide-react";
import { GetInvitationsAction } from "@/Actions/invitations/getInvitations.action";
import InvitationsList from "@/app/[locale]/_Components/Invitations/InvitationsList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitations",
};
export default async function InvitationsPage() {
  const { ok, payload } = await GetInvitationsAction();
  const invitations = ok
    ? payload.filter((inv: any) => inv.status === "pending")
    : [];
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center border border-primary/20">
          <Mail className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-medium">Team Invitations</h2>
          <p className="text-sm text-muted-foreground">
            {invitations.length} pending invitation{invitations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <InvitationsList initialInvitations={invitations} />
    </div>
  );
}