"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateFeedbackAction } from "@/Actions/feedback/createFeedback.action";
import { FeedbackValue } from "@/types/schema";
import { createFeedbackSchema } from "@/schemas/feedback.schema";

export default function CreateFeedbackBtn({
  projectId,
  taskId,
  deliverableId,
  meetingId,
  onCreated,
}: {
  projectId?: number;
  taskId?: number;
  deliverableId?: number;
  meetingId?: number;
  onCreated: (feedback: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const formObj = useForm<FeedbackValue>({
    resolver: zodResolver(createFeedbackSchema),
    defaultValues: {
      project: projectId,
      task: taskId,
      deliverable: deliverableId,
      meeting: meetingId,
      content: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = formObj;

  async function onSubmit(data: FeedbackValue) {
    const { payload, ok } = await CreateFeedbackAction(data);

    if (ok) {
      onCreated(payload);
      toast.success("Feedback added successfully", {
        position: "top-center",
        duration: 2000,
      });
      reset({
        project: projectId,
        task: taskId,
        deliverable: deliverableId,
        meeting: meetingId,
        content: "",
      });
      setOpen(false);
    } else {
      toast.error("Failed to add feedback", {
        position: "top-center",
        duration: 2000,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Add Feedback</DialogTitle>
        </DialogHeader>

        <Form {...formObj}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="content *"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-none"
                      rows={3}
                      placeholder="The scope is acceptable; focus on measurable evaluation."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="py-0 h-8" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}