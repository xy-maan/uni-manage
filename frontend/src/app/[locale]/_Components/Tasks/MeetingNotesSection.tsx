// // MeetingNotesSection.tsx
// "use client";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";

// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Pen, Trash2, Send } from "lucide-react";
// import { CreateMeetingNoteAction } from "@/Actions/Meetings/createMeetingNote.action";
// import { GetMeetingNotesAction } from "@/Actions/Meetings/getMeetingNote.action";
// import { UpdateMeetingNoteAction } from "@/Actions/Meetings/updateMeetingNote.action";
// import { DeleteMeetingNoteAction } from "@/Actions/Meetings/deleteMeetingNote.action";
// import { MeetingNote } from "@/types/meeting";

// export default function MeetingNotesSection({
//   meetingId,
//   isParticipant,
//   currentUserEmail,
// }: {
//   meetingId: number;
//   isParticipant: boolean;
//   currentUserEmail: string;
// }) {
//   const [notes, setNotes] = useState<MeetingNote[]>([]);
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editContent, setEditContent] = useState("");

//   async function loadNotes() {
//     setLoading(true);
//     const { ok, payload } = await GetMeetingNotesAction();
//     if (ok) {
//       setNotes(payload.filter((n: MeetingNote) => n.meeting === meetingId));
//     }
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadNotes();
//   }, [meetingId]);

//   async function handleAdd() {
//     if (!content) return;
//     setSending(true);
//     const { payload, ok } = await CreateMeetingNoteAction({ meeting: meetingId, content });
//     setSending(false);

//     if (ok) {
//       setNotes((prev) => [...prev, payload]);
//       setContent("");
//     } else {
//       toast.error("faild add note", { position: "top-center", duration: 2000 });
//     }
//   }

//   async function handleSaveEdit(noteId: number) {
//     const { payload, ok } = await UpdateMeetingNoteAction(noteId, { content: editContent });
//     if (ok) {
//       setNotes((prev) => prev.map((n) => (n.id === noteId ? payload : n)));
//       setEditingId(null);
//     } else {
//       toast.error("faild update note", { position: "top-center", duration: 2000 });
//     }
//   }

//   async function handleDelete(noteId: number) {
//     const { ok } = await DeleteMeetingNoteAction(noteId);
//     if (ok) {
//       setNotes((prev) => prev.filter((n) => n.id !== noteId));
//     } else {
//       toast.error("faild deleted", { position: "top-center", duration: 2000 });
//     }
//   }

//   if (loading) return null;

//   return (
//     <div className="space-y-2">
//       <p className="text-xs font-medium text-muted-foreground">Notes</p>
//       {notes.map((note) => (
//         <div key={note.id} className="text-xs p-2 rounded bg-muted/50">
//           {editingId === note.id ? (
//             <div className="flex items-end gap-1">
//               <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="resize-none text-xs" rows={2} />
//               <Button size="sm" className="h-6 py-0" onClick={() => handleSaveEdit(note.id)}>Save</Button>
//             </div>
//           ) : (
//             <div className="flex items-start justify-between gap-2">
//               <div>
//                 <span className="font-medium">{note.author_detail?.full_name}: </span>
//                 {note.content}
//               </div>
//               {note.author_detail.email === currentUserEmail && (
//                 <div className="flex gap-1 shrink-0">
//                   <button onClick={() => { setEditingId(note.id); setEditContent(note.content); }}>
//                     <Pen className="size-3" />
//                   </button>
//                   <button onClick={() => handleDelete(note.id)}>
//                     <Trash2 className="size-3" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//       {isParticipant && (
//         <div className="flex items-end gap-2">
//           <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Add a note..." className="resize-none text-xs" rows={2} />
//           <Button size="icon" className="size-7 shrink-0" onClick={handleAdd} disabled={sending}>
//             <Send className="size-3" />
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
// MeetingNotesSection.tsx
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Send, Pen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useSession } from "next-auth/react";
import { GetMeetingNotesAction } from "@/Actions/Meetings/getMeetingNote.action";
import { CreateMeetingNoteAction } from "@/Actions/Meetings/createMeetingNote.action";
import { UpdateMeetingNoteAction } from "@/Actions/Meetings/updateMeetingNote.action";
import { DeleteMeetingNoteAction } from "@/Actions/Meetings/deleteMeetingNote.action";

const schema = z.object({ meeting: z.number(), content: z.string().min(1, "Note cannot be empty") });
type FormValues = z.infer<typeof schema>;

export default function MeetingNotesSection({
  meetingId,
  isParticipant,
}: {
  meetingId: number;
  isParticipant: boolean;
}) {
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email;

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const formObj = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { meeting: meetingId, content: "" },
  });
  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

  async function loadNotes() {
    setLoading(true);
    const { ok, payload } = await GetMeetingNotesAction();
    if (ok) setNotes(payload.filter((n: any) => n.meeting === meetingId));
    setLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, [meetingId]);

  async function onSubmit(data: FormValues) {
    const { payload, ok } = await CreateMeetingNoteAction(data);
    if (ok) {
      setNotes((prev) => [...prev, payload]);
      reset({ meeting: meetingId, content: "" });
    } else {
      toast.error("faild add note", { position: "top-center", duration: 2000 });
    }
  }

  async function handleSaveEdit(noteId: number) {
    const { payload, ok } = await UpdateMeetingNoteAction(noteId, { content: editContent });
    if (ok) {
      setNotes((prev) => prev.map((n) => (n.id === noteId ? payload : n)));
      setEditingId(null);
    } else {
      toast.error("faild update note", { position: "top-center", duration: 2000 });
    }
  }

  async function handleDelete(noteId: number) {
    const { ok } = await DeleteMeetingNoteAction(noteId);
    if (ok) setNotes((prev) => prev.filter((n) => n.id !== noteId));
    else toast.error("faild deleted", { position: "top-center", duration: 2000 });
  }

  if (loading) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Notes</p>
      {notes.map((note) => (
        <div key={note.id} className="text-xs p-2 rounded bg-muted/50">
          {editingId === note.id ? (
            <div className="flex items-end gap-1">
              <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="resize-none text-xs" rows={2} />
              <Button size="sm" className="h-6 py-0" onClick={() => handleSaveEdit(note.id)}>Save</Button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-medium">{note.author_detail?.full_name}: </span>
                {note.content}
              </div>
              {note.author_detail?.email === currentUserEmail && (
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setEditingId(note.id); setEditContent(note.content); }}>
                    <Pen className="size-3" />
                  </button>
                  <button onClick={() => handleDelete(note.id)}>
                    <Trash2 className="size-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {isParticipant && (
        <Form {...formObj}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
            <FormField control={control} name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea {...field} placeholder="Add a note..." className="resize-none text-xs" rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" className="size-7 shrink-0" disabled={isSubmitting}>
              <Send className="size-3" />
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}