// Btns/DeleteDeliverableFileBtn/DeleteDeliverableFileBtn.tsx
"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { DeleteDeliverableFileAction } from "@/Actions/Deliverables/deleteDeliverableFile.action";

export default function DeleteDeliverableFileBtn({
  file_id,
  setFiles,
}: {
  file_id: number;
  setFiles: (files: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteDeliverableFileAction(file_id);
    setLoading(false);

    if (ok) {
      setFiles((prev: any) => prev.filter((f: any) => f.id !== file_id));
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50">
      <X className="size-3" />
    </button>
  );
}