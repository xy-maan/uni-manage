// // Btns/EditTaskBtn/EditTaskBtn.tsx
// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
// } from "@/components/ui/dialog";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// import { Pen } from "lucide-react";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { UpdateTaskAction } from "@/Actions/Tasks/tasks/replaceTask.action";
// import { Task } from "@/types/task";

// const schema = z.object({
//   title: z.string().min(1, "Title is required").max(255),
//   description: z.string().optional(),
//   priority: z.enum(["low", "medium", "high", "urgent"]),
//   status: z.enum(["todo", "in_progress", "review", "done"]),
//   assignee: z.number().optional(),
//   due_at: z.string().optional(),
// });
// type FormValues = z.infer<typeof schema>;

// export default function EditTaskBtn({
//   task,
//   members,
//   setTasks,
// }: {
//   task: Task;
//   members: any[];
//   setTasks: (tasks: any) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const formObj = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       status: "",
//       position:
//       board_column:
//     },
//   });

//   const { control, handleSubmit } = formObj;

//   async function handleSave(data: FormValues) {
//     setLoading(true);
//     const body: any = { ...data };
//     const { payload, ok } = await UpdateTaskAction(task.id, body);
//     setLoading(false);

//     if (ok) {
//       setTasks((prev: any) => prev.map((t: any) => (t.id === task.id ? payload : t)));
//       toast.success("Task updated successfully", { position: "top-center", duration: 2000 });
//       setOpen(false);
//     } else {
//       toast.error("faild update", { position: "top-center", duration: 2000 });
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="icon" variant="ghost" className="size-7">
//           <Pen className="size-3.5" />
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
//         <DialogHeader>
//           <DialogTitle>Edit Task</DialogTitle>
//         </DialogHeader>
//         <Form {...formObj}>
//           <form onSubmit={handleSubmit(handleSave)}>
//             <div className="space-y-4">
//               <FormField control={control} name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Title *</FormLabel>
//                     <FormControl><Input {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField control={control} name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl><Textarea {...field} className="resize-none" rows={3} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField control={control} name="status"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Status</FormLabel>
//                     <FormControl>
//                       <Select value={field.value} onValueChange={field.onChange}>
//                         <SelectTrigger><SelectValue /></SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="todo">To Do</SelectItem>
//                           <SelectItem value="in_progress">In Progress</SelectItem>
//                           <SelectItem value="review">Review</SelectItem>
//                           <SelectItem value="done">Done</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField control={control} name="priority"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Priority</FormLabel>
//                     <FormControl>
//                       <Select value={field.value} onValueChange={field.onChange}>
//                         <SelectTrigger><SelectValue /></SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="low">Low</SelectItem>
//                           <SelectItem value="medium">Medium</SelectItem>
//                           <SelectItem value="high">High</SelectItem>
//                           <SelectItem value="urgent">Urgent</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField control={control} name="assignee"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Assignee</FormLabel>
//                     <FormControl>
//                       <Select
//                         value={field.value ? String(field.value) : ""}
//                         onValueChange={(v) => field.onChange(Number(v))}
//                       >
//                         <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
//                         <SelectContent>
//                           {members.map((m: any) => (
//                             <SelectItem key={m.user} value={String(m.user)}>
//                               {m.user_detail?.full_name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField control={control} name="due_at"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Due Date</FormLabel>
//                     <FormControl><Input type="date" {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <DialogFooter className="mt-4">
//               <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? "Saving..." : "Save"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
// Btns/EditTaskBtn/EditTaskBtn.tsx
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pen } from "lucide-react";
import { toast } from "sonner";
import { updateTaskSchema, UpdateTaskValues } from "@/schemas/task.schema";
import { UpdateTaskAction } from "@/Actions/Tasks/tasks/replaceTask.action";

export default function EditTaskBtn({
  task,
  members,
  labels,
  onUpdated,
}: {
  task: any;
  members: any[];
  labels: any[];
  onUpdated: (task: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const formObj = useForm<UpdateTaskValues>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      status: task.status,
      assignee: task.assignee ?? undefined,
      due_at: task.due_at ? task.due_at.slice(0, 16) : "",
      story_points: task.story_points ?? undefined,
      labels: task.labels ?? [],
    },
  });

  const { control, handleSubmit, formState: { isSubmitting } } = formObj;

  async function onSubmit(data: UpdateTaskValues) {
    const body: any = { ...data };
    if (!body.assignee) delete body.assignee;
    if (!body.due_at) delete body.due_at;

    const { payload, ok } = await UpdateTaskAction(task.id, body);

    if (ok) {
      onUpdated(payload);
      toast.success("Task updated successfully", { position: "top-center", duration: 2000 });
      setOpen(false);
    } else {
      toast.error("faild update task", { position: "top-center", duration: 2000 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="size-7">
          <Pen className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...formObj}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField control={control} name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={control} name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} className="resize-none" rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={control} name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={control} name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={control} name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                        <SelectContent>
                          {members.map((m: any) => (
                            <SelectItem key={m.user} value={String(m.user)}>
                              {m.user_detail?.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}