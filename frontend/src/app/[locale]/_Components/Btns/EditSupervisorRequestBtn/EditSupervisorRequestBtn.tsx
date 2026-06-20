// Btns/EditSupervisorRequestBtn/EditSupervisorRequestBtn.tsx
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
import { UpdateSupervisorRequestAction } from "@/Actions/supervisor/supervisorRequests/updateSupervisorRequest.action";

const schema = z.object({
  message: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EditSupervisorRequestBtn({
  request_id,
  currentMessage,
  setRequests,
}: {
  request_id: number;
  currentMessage: string;
  setRequests: (requests: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formObj = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { message: currentMessage ?? "" },
  });

  const { control, handleSubmit } = formObj;

  async function handleSave(data: FormValues) {
    setLoading(true);
    const { payload, ok } = await UpdateSupervisorRequestAction(request_id, data);
    setLoading(false);

    if (ok) {
      setRequests((prev: any) => prev.map((r: any) => (r.id === request_id ? payload : r)));
      toast.success("Request updated successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild update", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pen className="size-3.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Edit Request</DialogTitle>
        </DialogHeader>
        <Form {...formObj}>
          <form onSubmit={handleSubmit(handleSave)}>
            <FormField
              control={control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}