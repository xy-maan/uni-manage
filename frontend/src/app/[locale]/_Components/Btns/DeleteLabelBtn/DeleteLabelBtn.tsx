// Btns/DeleteLabelBtn/DeleteLabelBtn.tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { DeleteLabelAction } from "@/Actions/Tasks/labels/deleteLabel.action";

export default function DeleteLabelBtn({
  label_id,
  setLabels,
}: {
  label_id: number;
  setLabels: (labels: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteLabelAction(label_id);
    setLoading(false);

    if (ok) {
      setLabels((prev: any) => prev.filter((l: any) => l.id !== label_id));
      toast.success("Label deleted successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
    >
      <X className="size-3" />
    </button>
  );
}