// Btns/RejectSupervisorRequestBtn/RejectSupervisorRequestBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { RejectSupervisorRequestAction } from "@/Actions/supervisor/supervisorRequests/rejectSupervisorRequest.action";

export default function RejectSupervisorRequestBtn({
  request_id,
  setRequests,
}: {
  request_id: number;
  setRequests: (requests: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleReject() {
    setLoading(true);
    const { payload, ok } = await RejectSupervisorRequestAction(request_id);
    setLoading(false);

    if (ok) {
      setRequests((prev: any) => prev.map((r: any) => (r.id === request_id ? payload : r)));
      toast.success("Request rejected successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild reject", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Button variant="outline" className="gap-1.5" onClick={handleReject} disabled={loading}>
      <X className="size-3.5" />
      {loading ? "Rejecting..." : "Reject"}
    </Button>
  );
}