// Btns/AcceptSupervisorRequestBtn/AcceptSupervisorRequestBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { AcceptSupervisorRequestAction } from "@/Actions/supervisor/supervisorRequests/acceptSupervisorRequest.action";

export default function AcceptSupervisorRequestBtn({
  request_id,
  setRequests,
}: {
  request_id: number;
  setRequests: (requests: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    const { payload, ok } = await AcceptSupervisorRequestAction(request_id);
    setLoading(false);

    if (ok) {
      setRequests((prev: any) => prev.map((r: any) => (r.id === request_id ? payload : r)));
      toast.success("Request accepted successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild accept", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Button className="gap-1.5" onClick={handleAccept} disabled={loading}>
      <Check className="size-3.5" />
      {loading ? "Accepting..." : "Accept"}
    </Button>
  );
}