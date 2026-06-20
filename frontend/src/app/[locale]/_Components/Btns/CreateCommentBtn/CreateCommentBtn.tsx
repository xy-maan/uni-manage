// Btns/CreateCommentBtn/CreateCommentBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateCommentAction } from "@/Actions/createComment.action";

const schema = z.object({ content: z.string().min(1, "Comment cannot be empty") });
type FormValues = z.infer<typeof schema>;

export default function CreateCommentBtn({
  taskId,
  onCreated,
}: {
  taskId: number;
  onCreated: (comment: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  const formObj = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { content: "" },
  });

  const { control, handleSubmit, reset } = formObj;

  async function handleSend(data: FormValues) {
    setLoading(true);
    const { payload, ok } = await CreateCommentAction({ task: taskId, content: data.content });
    setLoading(false);

    if (ok) {
      onCreated(payload);
      reset();
    } else {
      toast.error("faild add comment", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Form {...formObj}>
      <form onSubmit={handleSubmit(handleSend)} className="flex items-end gap-2">
        <FormField control={control} name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea {...field} placeholder="Write a comment..." className="resize-none" rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" className="size-9 shrink-0" disabled={loading}>
          <Send className="size-4" />
        </Button>
      </form>
    </Form>
  );
}