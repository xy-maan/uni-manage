// Btns/CreateSprintBtn/CreateSprintBtn.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createSprintSchema, CreateSprintValues } from "@/schemas/sprint.schema";
import { CreateSprintAction } from "@/Actions/methodology/Sprints/CreateSprint.action";

export default function CreateSprintBtn({
  projectId,
  onCreated,
}: {
  projectId: number;
  onCreated: (sprint: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const formObj = useForm<CreateSprintValues>({
    resolver: zodResolver(createSprintSchema),
    defaultValues: {
      project: projectId,
      name: "",
      goal: "",
      starts_at: "",
      ends_at: "",
      status: "planned",
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

  async function onSubmit(data: CreateSprintValues) {
      const body = {
    ...data,
    starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : "",
    ends_at: data.ends_at ? new Date(data.ends_at).toISOString() : "",
  };
    const { payload, ok } = await CreateSprintAction(body);

    if (ok) {
      onCreated(payload);
      toast.success("Sprint created successfully", { position: "top-center", duration: 2000 });
      reset({ project: projectId, name: "", goal: "", starts_at: "", ends_at: "", status: "planned" });
      setOpen(false);
    } else {
      const firstValue = Object.values(payload || {})?.[0];
      const message =
        typeof payload === "object" && payload && "detail" in payload
          ? (payload as any).detail
          : Array.isArray(firstValue) ? firstValue[0] : "Error occurred";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          New Sprint
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Create Sprint</DialogTitle>
        </DialogHeader>

        <Form {...formObj}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Sprint 1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={control}
                  name="starts_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input  type="date"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="ends_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date *</FormLabel>
                      <FormControl>
                        <Input  type="date"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Sprint"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}