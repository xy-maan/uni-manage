// Btns/SubmitDeliverableBtn/SubmitDeliverableBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { SubmitDeliverableAction } from "@/Actions/Deliverables/submitDeliverable.action";

export default function SubmitDeliverableBtn({
  deliverable_id,
  setDeliverables,
  label = "Submit",
}: {
  deliverable_id: number;
  setDeliverables: (deliverables: any) => void;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const { payload, ok } = await SubmitDeliverableAction(deliverable_id);
    setLoading(false);

    if (ok) {
      setDeliverables((prev: any) => prev.map((d: any) => (d.id === deliverable_id ? payload : d)));
      toast.success("Deliverable submitted successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild submit deliverable", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Button size="sm" className="h-7 text-xs gap-1.5" onClick={handleSubmit} disabled={loading}>
      <Upload className="size-3" />
      {loading ? "Submitting..." : label}
    </Button>
  );
}