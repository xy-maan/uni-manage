// Btns/DeleteAttachmentBtn/DeleteAttachmentBtn.tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { DeleteAttachmentAction } from "@/Actions/Tasks/attachments/deleteAttachment.action";

export default function DeleteAttachmentBtn({
  attachment_id,
  setAttachments,
}: {
  attachment_id: number;
  setAttachments: (attachments: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteAttachmentAction(attachment_id);
    setLoading(false);

    if (ok) {
      setAttachments((prev: any) => prev.filter((a: any) => a.id !== attachment_id));
      toast.success("Attachment deleted successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 shrink-0">
      <Trash2 className="size-4" />
    </button>
  );
}