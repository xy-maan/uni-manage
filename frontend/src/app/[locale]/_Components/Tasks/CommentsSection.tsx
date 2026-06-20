// "use client";
// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
// import { Send, Pen, Trash2 } from "lucide-react";
// import { toast } from "sonner";
// import { createCommentSchema, CreateCommentValues } from "@/schemas/task.schema";
// import { UpdateCommentAction } from "@/Actions/Tasks/comments/replaceComment.action";
// import { CreateCommentAction } from "@/Actions/Tasks/comments/createComment.action";
// import { DeleteCommentAction } from "@/Actions/Tasks/comments/deleteComment.action";
// import { GetCommentsAction } from "@/Actions/Tasks/comments/getAllComments.action";

// export default function CommentsSection({
//   taskId,
//   currentUserId,
// }: {
//   taskId: number;
//   currentUserId: number;
// }) {
//   const [comments, setComments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editContent, setEditContent] = useState("");

//   const formObj = useForm<CreateCommentValues>({
//     resolver: zodResolver(createCommentSchema),
//     defaultValues: { task: taskId, content: "" },
//   });
//   const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

//   async function loadComments() {
//     setLoading(true);
//     const { ok, payload } = await GetCommentsAction();
//     if (ok) setComments(payload.filter((c: any) => c.task === taskId));
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadComments();
//   }, [taskId]);

//   async function onSubmit(data: CreateCommentValues) {
//     const { payload, ok } = await CreateCommentAction(data);
//     if (ok) {
//       setComments((prev) => [...prev, payload]);
//       reset({ task: taskId, content: "" });
//     } else {
//       toast.error("faild add comment", { position: "top-center", duration: 2000 });
//     }
//   }

//   async function handleSaveEdit(commentId: number) {
//     const { payload, ok } = await UpdateCommentAction(commentId, { task: taskId, content: editContent });
//     if (ok) {
//       setComments((prev) => prev.map((c) => (c.id === commentId ? payload : c)));
//       setEditingId(null);
//     } else {
//       toast.error("faild update comment", { position: "top-center", duration: 2000 });
//     }
//   }

//   async function handleDelete(commentId: number) {
//     const { ok } = await DeleteCommentAction(commentId);
//     if (ok) {
//       setComments((prev) => prev.filter((c) => c.id !== commentId));
//     } else {
//       toast.error("faild deleted", { position: "top-center", duration: 2000 });
//     }
//   }

//   if (loading) return null;

//   return (
//     <div className="space-y-3">
//       <p className="text-sm font-medium">Comments ({comments.length})</p>

//       {comments.map((c) => (
//         <div key={c.id} className="p-2.5 rounded-lg border text-xs">
//           <div className="flex items-center justify-between mb-1">
//             <span className="font-medium">{c.author_detail?.full_name}</span>
//             <span className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
//           </div>

//           {editingId === c.id ? (
//             <div className="flex items-end gap-2 mt-1">
//               <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="resize-none text-xs" rows={2} />
//               <Button size="sm" className="h-7" onClick={() => handleSaveEdit(c.id)}>Save</Button>
//             </div>
//           ) : (
//             <div className="flex items-start justify-between gap-2">
//               <p className="text-muted-foreground flex-1">{c.content}</p>
//               {c.author === currentUserId && (
//                 <div className="flex gap-1 shrink-0">
//                   <button onClick={() => { setEditingId(c.id); setEditContent(c.content); }}>
//                     <Pen className="size-3" />
//                   </button>
//                   <button onClick={() => handleDelete(c.id)}>
//                     <Trash2 className="size-3" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ))}

//       <Form {...formObj}>
//         <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
//           <FormField control={control} name="content"
//             render={({ field }) => (
//               <FormItem className="flex-1">
//                 <FormControl>
//                   <Textarea {...field} placeholder="Write a comment..." className="resize-none" rows={2} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit" size="icon" className="size-9 shrink-0" disabled={isSubmitting}>
//             <Send className="size-4" />
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// }
// CommentsSection.tsx — كاملة بعد التعديل
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Send, Pen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCommentSchema, CreateCommentValues } from "@/schemas/task.schema";
import { UpdateCommentAction } from "@/Actions/Tasks/comments/replaceComment.action";
import { CreateCommentAction } from "@/Actions/Tasks/comments/createComment.action";
import { DeleteCommentAction } from "@/Actions/Tasks/comments/deleteComment.action";
import { GetCommentsAction } from "@/Actions/Tasks/comments/getAllComments.action";


export default function CommentsSection({
  taskId,
  currentUserEmail,
}: {
  taskId: number;
  currentUserEmail: string;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const formObj = useForm<CreateCommentValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { task: taskId, content: "" },
  });
  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

  async function loadComments() {
    setLoading(true);
    const { ok, payload } = await GetCommentsAction();
    if (ok) setComments(payload.filter((c: any) => c.task === taskId));
    setLoading(false);
  }

  useEffect(() => {
    loadComments();
  }, [taskId]);

  async function onSubmit(data: CreateCommentValues) {
    const { payload, ok } = await CreateCommentAction(data);
    if (ok) {
      setComments((prev) => [...prev, payload]);
      reset({ task: taskId, content: "" });
    } else {
      toast.error("faild add comment", { position: "top-center", duration: 2000 });
    }
  }

  async function handleSaveEdit(commentId: number) {
    const { payload, ok } = await UpdateCommentAction(commentId, { task: taskId, content: editContent });
    if (ok) {
      setComments((prev) => prev.map((c) => (c.id === commentId ? payload : c)));
      setEditingId(null);
    } else {
      toast.error("faild update comment", { position: "top-center", duration: 2000 });
    }
  }

  async function handleDelete(commentId: number) {
    const { ok } = await DeleteCommentAction(commentId);
    if (ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  if (loading) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Comments ({comments.length})</p>

      {comments.map((c) => (
        <div key={c.id} className="p-2.5 rounded-lg border text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{c.author_detail?.full_name}</span>
            <span className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
          </div>

          {editingId === c.id ? (
            <div className="flex items-end gap-2 mt-1">
              <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="resize-none text-xs" rows={2} />
              <Button size="sm" className="h-7" onClick={() => handleSaveEdit(c.id)}>Save</Button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <p className="text-muted-foreground flex-1">{c.content}</p>
              {c.author_detail?.email === currentUserEmail && (
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setEditingId(c.id); setEditContent(c.content); }}>
                    <Pen className="size-3" />
                  </button>
                  <button onClick={() => handleDelete(c.id)}>
                    <Trash2 className="size-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <Form {...formObj}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
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
          <Button type="submit" size="icon" className="size-9 shrink-0" disabled={isSubmitting}>
            <Send className="size-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
}