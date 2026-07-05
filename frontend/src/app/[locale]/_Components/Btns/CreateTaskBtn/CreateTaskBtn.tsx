// // Btns/CreateTaskBtn/CreateTaskBtn.tsx
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
// import { Plus } from "lucide-react";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { CreateTaskAction } from "@/Actions/Tasks/tasks/createTask.action";
// import { createTaskSchema } from "@/schemas/task.schema";
// import { CreateTaskValues } from "@/types/schema";

// export default function CreateTaskBtn({
//   projectId,
//   boardColumnId,
//   members,
//   onCreated,
// }: {
//   projectId: number;
//   boardColumnId?: number;
//   members: any[];
//   onCreated: (task: any) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const formObj = useForm<CreateTaskValues>({
//   resolver: zodResolver(createTaskSchema),
//   defaultValues: {
//     title: "",
//     description: "",
//     status: "todo",
//     priority: "medium",
//     assignee: undefined,
//     labels: [],
//     board_column: boardColumnId,
//     due_at: "",
//     estimated_hours: "",
//     actual_hours: null,
//     story_points: undefined,
//     position: 0,
//   },
// });
//   const { control, handleSubmit, reset } = formObj;

//   async function handleCreate(data: CreateTaskValues) {
//     setLoading(true);
//     const body: CreateTaskValues = {
//     project: projectId,
//     title: data.title,
//     description: data.description,
//     priority: data.priority,
//     status: "todo",
//     position: 0,
//   };
//   if (boardColumnId) body.board_column = boardColumnId;
//   if (data.assignee) body.assignee = data.assignee;
//   if (data.due_at) body.due_at = data.due_at;
//   if (data.labels?.length) body.labels = data.labels;
  
//     const { payload, ok } = await CreateTaskAction(body);
//     setLoading(false);

//     if (ok) {
//       onCreated(payload);
//       toast.success("Task created successfully", { position: "top-center", duration: 2000 });
//       reset();
//       setOpen(false);
//     } else {
//       const firstValue = Object.values(payload || {})?.[0];
//       const message =
//         typeof payload === "object" && payload && "detail" in payload
//           ? (payload as any).detail
//           : Array.isArray(firstValue) ? firstValue[0] : "Error occurred";
//       toast.error(message);
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="sm" variant="outline" className="gap-1.5">
//           <Plus className="size-3.5" />
//           Add Task
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
//         <DialogHeader>
//           <DialogTitle>Create Task</DialogTitle>
//         </DialogHeader>
//         <Form {...formObj}>
//           <form onSubmit={handleSubmit(handleCreate)}>
//             <div className="space-y-4">
//               <FormField
//                 control={control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Title *</FormLabel>
//                     <FormControl>
//                       <Input {...field} placeholder="Build attendance API" />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl>
//                       <Textarea {...field} className="resize-none" rows={3} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={control}
//                 name="priority"
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
//               <FormField
//                 control={control}
//                 name="assignee"
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
//               <FormField
//                 control={control}
//                 name="due_at"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Due Date</FormLabel>
//                     <FormControl>
//                       <Input type="date" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <DialogFooter className="mt-4">
//               <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? "Creating..." : "Create Task"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
// Btns/CreateTaskBtn/CreateTaskBtn.tsx
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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createTaskSchema, CreateTaskValues } from "@/schemas/task.schema";
import { CreateTaskAction } from "@/Actions/Tasks/tasks/createTask.action";
import StoryPointsTooltip from "../../UtilitiesComponents/StoryPointsTooltip";

export default function CreateTaskBtn({
  projectId,
  boardColumnId,
  members,
  onCreated,
}: {
  projectId: number;
  boardColumnId?: number;
  members: any[];
  onCreated: (task: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const formObj = useForm<CreateTaskValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      project: projectId,
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      board_column: boardColumnId,
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = formObj;

  async function onSubmit(data: CreateTaskValues) {
      const body: CreateTaskValues = { ...data };
      if (body.due_at) {
    body.due_at = new Date(body.due_at).toISOString();
  }
    const { payload, ok } = await CreateTaskAction(body);
    if (ok) {
      onCreated(payload);
      toast.success("Task created successfully", { position: "top-center", duration: 2000 });
      reset();
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
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <Form {...formObj}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField control={control} name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl><Input {...field} placeholder="Build attendance API" /></FormControl>
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
                    <FormControl>   <Input
          type="date"
          value={field.value ?? ""} 
          onChange={field.onChange}
          onBlur={field.onBlur}
        /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={control} name="story_points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <StoryPointsTooltip />
                      Story Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}