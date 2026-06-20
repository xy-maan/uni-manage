// Btns/ApproveDeliverableBtn/ApproveDeliverableBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { ApproveDeliverableAction } from "@/Actions/Deliverables/approveDeliverable.action";

export default function ApproveDeliverableBtn({
  deliverable_id,
  setDeliverables,
}: {
  deliverable_id: number;
  setDeliverables: (deliverables: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    const { payload, ok } = await ApproveDeliverableAction(deliverable_id);
    setLoading(false);

    if (ok) {
      setDeliverables((prev: any) => prev.map((d: any) => (d.id === deliverable_id ? payload : d)));
      toast.success("Deliverable approved", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild approve deliverable", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={handleApprove} disabled={loading}>
      <Check className="size-3" />
      {loading ? "Approving..." : "Approve"}
    </Button>
  );
}