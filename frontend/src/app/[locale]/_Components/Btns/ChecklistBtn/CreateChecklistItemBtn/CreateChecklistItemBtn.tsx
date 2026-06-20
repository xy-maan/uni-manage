// // Btns/CreateChecklistItemBtn/CreateChecklistItemBtn.tsx
// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Plus } from "lucide-react";
// import { toast } from "sonner";
// import { CreateChecklistItemAction } from "@/Actions/Tasks/checklistItems/createChecklistItem.action";

// export default function CreateChecklistItemBtn({
//   checklistId,
//   position,
//   onCreated,
// }: {
//   checklistId: number;
//   position: number;
//   onCreated: (item: any) => void;
// }) {
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleCreate() {
//     if (!content) return;
//     setLoading(true);
//     const { payload, ok } = await CreateChecklistItemAction({
//       checklist: checklistId,
//       content,
//       is_completed: false,
//       position,
//     });
//     setLoading(false);

//     if (ok) {
//       onCreated(payload);
//       setContent("");
//     } else {
//       toast.error("faild add item", { position: "top-center", duration: 2000 });
//     }
//   }

//   return (
//     <div className="flex gap-2 pl-2">
//       <Input
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Add item..."
//         className="h-7 text-sm"
//         onKeyDown={(e) => e.key === "Enter" && handleCreate()}
//       />
//       <Button size="sm" className="h-7 py-0" onClick={handleCreate} disabled={loading || !content}>
//         <Plus className="size-3" />
//       </Button>
//     </div>
//   );
// }
// Btns/CreateChecklistItemBtn/CreateChecklistItemBtn.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createChecklistItemSchema, CreateChecklistItemValues } from "@/schemas/task.schema";
import { CreateChecklistItemAction } from "@/Actions/Tasks/checklistItems/createChecklistItem.action";

export default function CreateChecklistItemBtn({
  checklistId,
  position,
  onCreated,
}: {
  checklistId: number;
  position: number;
  onCreated: (item: any) => void;
}) {
  const formObj = useForm<CreateChecklistItemValues>({
    resolver: zodResolver(createChecklistItemSchema),
    defaultValues: { checklist: checklistId, content: "", is_completed: false, position },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

  async function onSubmit(data: CreateChecklistItemValues) {
    const { payload, ok } = await CreateChecklistItemAction(data);

    if (ok) {
      onCreated(payload);
      reset({ checklist: checklistId, content: "", is_completed: false, position: position + 1 });
    } else {
      toast.error("faild add item", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Form {...formObj}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <FormField control={control} name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl><Input {...field} placeholder="Add item..." className="h-7 text-sm" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" className="h-7 py-0" disabled={isSubmitting}>
          <Plus className="size-3" />
        </Button>
      </form>
    </Form>
  );
}