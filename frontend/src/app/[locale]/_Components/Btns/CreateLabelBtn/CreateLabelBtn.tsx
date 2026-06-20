// Btns/CreateLabelBtn/CreateLabelBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateLabelAction } from "@/Actions/Tasks/labels/createLabel.action";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
});
type FormValues = z.infer<typeof schema>;

export default function CreateLabelBtn({
  projectId,
  onCreated,
}: {
  projectId: number;
  onCreated: (label: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formObj = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", color: "#2563eb" },
  });

  const { control, handleSubmit, reset } = formObj;

  async function handleCreate(data: FormValues) {
    setLoading(true);
    const { payload, ok } = await CreateLabelAction({ ...data, project: projectId });
    setLoading(false);

    if (ok) {
      onCreated(payload);
      toast.success("Label created successfully", { position: "top-center", duration: 2000 });
      reset();
      setOpen(false);
    } else {
      toast.error("faild create label", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="size-3.5" />
          New Label
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Create Label</DialogTitle>
        </DialogHeader>
        <Form {...formObj}>
          <form onSubmit={handleSubmit(handleCreate)}>
            <div className="space-y-4">
              <FormField control={control} name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl><Input {...field} placeholder="Backend" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={control} name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color *</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input type="color" {...field} className="h-10 w-16 p-1" />
                        <Input {...field} placeholder="#2563eb" className="flex-1" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}