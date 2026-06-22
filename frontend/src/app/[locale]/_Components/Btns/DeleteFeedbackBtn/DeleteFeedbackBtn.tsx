"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { DeleteFeedbackAction } from "@/Actions/feedback/deleteFeedback.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteFeedbackBtn({
  feedback_id,
  setFeedback,
}: {
  feedback_id: number;
  setFeedback: (feedback: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const { ok } = await DeleteFeedbackAction(feedback_id);
    setLoading(false);

    if (ok) {
      setFeedback((prev: any) => prev.filter((f: any) => f.id !== feedback_id));
      toast.success("Feedback deleted successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("Failed to delete feedback", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={loading}
          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 disabled:opacity-50"
        >
          <Trash2 className="size-3" /> Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this feedback? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-white dark:bg-destructive/60"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}