"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateColumnAction } from "@/Actions/methodology/BoardColumns/CreateColumn.action";
import LabelTooltip from "../../../UtilitiesComponents/LabelTooltip";

const schema = z.object({
  project: z.number(),
  name: z.string().min(1, "Name is required").max(100),
  position: z.number().int().optional(),
  wip_limit: z.number().int().positive().optional(),
});
export type FormValues = z.infer<typeof schema>;

export default function CreateColumnBtn({
  projectId,
  position,
  onCreated,
}: {
  projectId: number;
  position: number;
  onCreated: (column: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const formObj = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { project: projectId, name: "", position },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

  async function onSubmit(data: FormValues) {
    (data)
    const { payload, ok } = await CreateColumnAction(data);
    if (ok) {
      onCreated(payload);
      toast.success("Column created successfully", { position: "top-center", duration: 2000 });
      reset();
      setOpen(false);
    } else {
      toast.error("faild create column", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="size-3.5" />
          New Column
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Create Column</DialogTitle>
        </DialogHeader>
        <Form {...formObj}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField control={control} name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl><Input {...field} placeholder="In Review" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={control} name="wip_limit"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>WIP Limit</FormLabel>
                     */}
                     <FormLabel className="flex items-center gap-2">
  WIP Limit
  <LabelTooltip />
</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}