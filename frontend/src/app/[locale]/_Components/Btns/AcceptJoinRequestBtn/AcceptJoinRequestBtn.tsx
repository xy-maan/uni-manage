// Btns/AcceptJoinRequestBtn/AcceptJoinRequestBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { AcceptJoinRequestAction } from "@/Actions/joinRequests/acceptJoinRequest.action";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { JoinRequest } from "@/types/JoinRequests";
import { Memberships } from "@/types/team";
export default function AcceptJoinRequestBtn({
  join_request_id,
  setJoinRequests,
  setMembers,
}: {
  join_request_id: number;
  // setJoinRequests: (joinRequests: any) => void;
  setMembers: React.Dispatch<React.SetStateAction<Memberships[]>>;
  setJoinRequests: React.Dispatch<React.SetStateAction<JoinRequest[]>>;
  // setMembers: (members: any) => void;
}) {
    const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleAccept() {
    setLoading(true);
    const { payload, ok } = await AcceptJoinRequestAction(join_request_id);

    if (ok) {
      setJoinRequests((prev) => prev.filter((r) => r.id !== join_request_id));
      setMembers((prev) => [...prev, payload]);
      toast.success("Member accepted successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild accept", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  return (
   <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-white bg-primary! hover:text-white  text-xs">
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