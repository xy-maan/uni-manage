// // Btns/CreateChecklistBtn/CreateChecklistBtn.tsx
// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Plus } from "lucide-react";
// import { toast } from "sonner";
// import { CreateChecklistAction } from "@/Actions/Tasks/checklists/createChecklist.action";

// export default function CreateChecklistBtn({
//   taskId,
//   position,
//   onCreated,
// }: {
//   taskId: number;
//   position: number;
//   onCreated: (checklist: any) => void;
// }) {
//   const [showInput, setShowInput] = useState(false);
//   const [title, setTitle] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleCreate() {
//     if (!title) return;
//     setLoading(true);
//     const { payload, ok } = await CreateChecklistAction({ task: taskId, title, position });
//     setLoading(false);

//     if (ok) {
//       onCreated(payload);
//       toast.success("Checklist created successfully", { position: "top-center", duration: 2000 });
//       setTitle("");
//       setShowInput(false);
//     } else {
//       toast.error("faild create checklist", { position: "top-center", duration: 2000 });
//     }
//   }

//   if (!showInput) {
//     return (
//       <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowInput(true)}>
//         <Plus className="size-3.5" />
//         Add Checklist
//       </Button>
//     );
//   }

//   return (
//     <div className="flex gap-2">
//       <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Checklist title" className="h-8" />
//       <Button size="sm" className="h-8" onClick={handleCreate} disabled={loading || !title}>Add</Button>
//       <Button size="sm" variant="outline" className="h-8" type="button" onClick={() => setShowInput(false)}>Cancel</Button>
//     </div>
//   );
// }
// Btns/CreateChecklistBtn/CreateChecklistBtn.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createChecklistSchema, CreateChecklistValues } from "@/schemas/task.schema";
import { CreateChecklistAction } from "@/Actions/Tasks/checklists/createChecklist.action";

export default function CreateChecklistBtn({
  taskId,
  position,
  onCreated,
}: {
  taskId: number;
  position: number;
  onCreated: (checklist: any) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  const formObj = useForm<CreateChecklistValues>({
    resolver: zodResolver(createChecklistSchema),
    defaultValues: { task: taskId, title: "", position },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

  async function onSubmit(data: CreateChecklistValues) {
    const { payload, ok } = await CreateChecklistAction(data);

    if (ok) {
      onCreated(payload);
      toast.success("Checklist created successfully", { position: "top-center", duration: 2000 });
      reset();
      setShowForm(false);
    } else {
      toast.error("faild create checklist", { position: "top-center", duration: 2000 });
    }
  }

  if (!showForm) {
    return (
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowForm(true)}>
        <Plus className="size-3.5" />
        Add Checklist
      </Button>
    );
  }

  return (
    <Form {...formObj}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <FormField control={control} name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl><Input {...field} placeholder="Checklist title" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" disabled={isSubmitting}>Add</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
      </form>
    </Form>
  );
}