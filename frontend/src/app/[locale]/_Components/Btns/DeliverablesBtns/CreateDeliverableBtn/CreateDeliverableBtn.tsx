// // Btns/CreateDeliverableBtn/CreateDeliverableBtn.tsx
// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Plus } from "lucide-react";
// import { toast } from "sonner";
// import { CreateDeliverableAction } from "@/Actions/Deliverables/CreateDeliverable.action";

// export default function CreateDeliverableBtn({
//   projectId,
//   onCreated,
// }: {
//   projectId: number;
//   onCreated: (deliverable: any) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dueAt, setDueAt] = useState("");

//   async function handleCreate() {
//     if (!title) {
//       toast.error("Title is required", { position: "top-center", duration: 2000 });
//       return;
//     }

//     setLoading(true);
//     const body: any = { project: projectId, title, description };
//     if (dueAt) body.due_at = dueAt;

//     const { payload, ok } = await CreateDeliverableAction(body);
//     setLoading(false);

//     if (ok) {
//       onCreated(payload);
//       toast.success("Deliverable created successfully", { position: "top-center", duration: 2000 });
//       setTitle("");
//       setDescription("");
//       setDueAt("");
//       setOpen(false);
//     } else {
//       toast.error("faild create deliverable", { position: "top-center", duration: 2000 });
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="sm" className="gap-1.5">
//           <Plus className="size-3.5" />
//           New Deliverable
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
//         <DialogHeader>
//           <DialogTitle>Create Deliverable</DialogTitle>
//         </DialogHeader>
//         <div className="w-full space-y-3">
//           <div className="space-y-2">
//             <Label>Title</Label>
//             <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Final Report" />
//           </div>
//           <div className="space-y-2">
//             <Label>Description</Label>
//             <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none" rows={2} />
//           </div>
//           <div className="space-y-2">
//             <Label>Due Date</Label>
//             <Input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
//           </div>
//         </div>
//         <DialogFooter className="mt-3">
//           <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
//           <Button className="py-0 h-8" onClick={handleCreate} disabled={loading}>
//             {loading ? "Creating..." : "Create"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
// Btns/CreateDeliverableBtn/CreateDeliverableBtn.tsx
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
import { CreateDeliverableAction } from "@/Actions/Deliverables/createDeliverable.action";
import { createDeliverableSchema, CreateDeliverableValues } from "@/schemas/deliverable.schema";


export default function CreateDeliverableBtn({
  projectId,
  onCreated,
}: {
  projectId: number;
  onCreated: (deliverable: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const formObj = useForm<CreateDeliverableValues>({
    resolver: zodResolver(createDeliverableSchema),
    defaultValues: { project: projectId, title: "", description: "", due_at: "" },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

  async function onSubmit(data: CreateDeliverableValues) {
    const body: any = { project: data.project, title: data.title };
    if (data.description) body.description = data.description;
    if (data.due_at) body.due_at = data.due_at;

    const { payload, ok } = await CreateDeliverableAction(body);

    if (ok) {
      onCreated(payload);
      toast.success("Deliverable created successfully", { position: "top-center", duration: 2000 });
      reset({ project: projectId, title: "", description: "", due_at: "" });
      setOpen(false);
    } else {
      toast.error("faild create deliverable", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 h-8">
          <Plus className="size-3.5" />
          New Deliverable
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Create Deliverable</DialogTitle>
        </DialogHeader>
        <Form {...formObj}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <FormField control={control} name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl><Input {...field} placeholder="Final Report" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={control} name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} className="resize-none" rows={2} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={control} name="due_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
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