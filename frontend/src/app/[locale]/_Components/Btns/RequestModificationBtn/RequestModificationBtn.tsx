// Btns/RequestModificationBtn/RequestModificationBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Pen } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RequestModificationSupervisorRequestAction } from "@/Actions/supervisor/supervisorRequests/requestModificationSupervisorRequest.action";

const schema = z.object({
  modification_note: z.string().min(1, "Please add a modification note"),
});
type FormValues = z.infer<typeof schema>;

export default function RequestModificationBtn({
  request_id,
  setRequests,
}: {
  request_id: number;
  setRequests: (requests: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formObj = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { modification_note: "" },
  });

  const { control, handleSubmit, reset } = formObj;

  async function handleRequest(data: FormValues) {
    setLoading(true);
    const { payload, ok } = await RequestModificationSupervisorRequestAction(request_id, data);
    setLoading(false);

    if (ok) {
      setRequests((prev: any) => prev.map((r: any) => (r.id === request_id ? payload : r)));
      toast.success("Modification requested successfully", { position: "top-center", duration: 2000 });
      reset();
      setOpen(false);
    } else {
      toast.error("faild request modification", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1.5">
          <Pen className="size-3.5" />
          Modify
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Request Modification</DialogTitle>
        </DialogHeader>
        <Form {...formObj}>
          <form onSubmit={handleSubmit(handleRequest)}>
            <FormField
              control={control}
              name="modification_note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What needs to change? *</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none" rows={3} placeholder="Please clarify the project scope..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}