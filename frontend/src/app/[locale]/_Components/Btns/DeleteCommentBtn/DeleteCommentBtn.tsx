// Btns/DeleteCommentBtn/DeleteCommentBtn.tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { DeleteCommentAction } from "@/Actions/Tasks/comments/deleteComment.action";

export default function DeleteCommentBtn({
  comment_id,
  setComments,
}: {
  comment_id: number;
  setComments: (comments: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteCommentAction(comment_id);
    setLoading(false);

    if (ok) {
      setComments((prev: any) => prev.filter((c: any) => c.id !== comment_id));
      toast.success("Comment deleted successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50">
      <Trash2 className="size-3.5" />
    </button>
  );
}