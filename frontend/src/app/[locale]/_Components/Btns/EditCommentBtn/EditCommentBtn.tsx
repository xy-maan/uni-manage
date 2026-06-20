// Btns/EditCommentBtn/EditCommentBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Pen } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UpdateCommentAction } from "@/Actions/Tasks/comments/replaceComment.action";

const schema = z.object({ content: z.string().min(1) });
type FormValues = z.infer<typeof schema>;

export default function EditCommentBtn({
  comment_id,
  currentContent,
  setComments,
}: {
  comment_id: number;
  currentContent: string;
  setComments: (comments: any) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const formObj = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { content: currentContent },
  });

  const { control, handleSubmit } = formObj;

  async function handleSave(data: FormValues) {
    setLoading(true);
    const { payload, ok } = await UpdateCommentAction(comment_id, data);
    setLoading(false);

    if (ok) {
      setComments((prev: any) => prev.map((c: any) => (c.id === comment_id ? payload : c)));
      setEditing(false);
    } else {
      toast.error("faild update", { position: "top-center", duration: 2000 });
    }
  }

  if (editing) {
    return (
      <Form {...formObj}>
        <form onSubmit={handleSubmit(handleSave)} className="flex items-end gap-2 mt-2">
          <FormField control={control} name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-1">
            <Button type="submit" size="sm" className="h-7 py-0" disabled={loading}>Save</Button>
            <Button type="button" size="sm" variant="outline" className="h-7 py-0" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground transition-colors">
      <Pen className="size-3.5" />
    </button>
  );
}