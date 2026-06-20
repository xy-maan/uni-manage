// Btns/RejectDeliverableBtn/RejectDeliverableBtn.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { toast } from "sonner";
import { reviewDeliverableSchema, ReviewDeliverableValues } from "@/schemas/deliverable.schema";
import { RejectDeliverableAction } from "@/Actions/Deliverables/rejectDeliverable.action";

export default function RejectDeliverableBtn({
  deliverable_id,
  setDeliverables,
}: {
  deliverable_id: number;
  setDeliverables: (deliverables: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const formObj = useForm<ReviewDeliverableValues>({
    resolver: zodResolver(reviewDeliverableSchema),
    defaultValues: { note: "" },
  });
  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

  async function onSubmit(data: ReviewDeliverableValues) {
    const { payload, ok } = await RejectDeliverableAction(deliverable_id, data);

    if (ok) {
      setDeliverables((prev: any) => prev.map((d: any) => (d.id === deliverable_id ? payload : d)));
      toast.success("Deliverable rejected", { position: "top-center", duration: 2000 });
      reset();
      setOpen(false);
    } else {
      toast.error("faild reject deliverable", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive">
          <X className="size-3" />
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Reject Deliverable</DialogTitle>
        </DialogHeader>
        <Form {...formObj}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField control={control} name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl><Textarea {...field} className="resize-none" rows={3} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="destructive" disabled={isSubmitting}>
                {isSubmitting ? "Rejecting..." : "Reject"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}