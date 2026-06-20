// // TaskDetailDialog.tsx
// "use client";
// import { useState } from "react";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import EditTaskBtn from "../Btns/EditTaskBtn/EditTaskBtn";
// import DeleteTaskBtn from "../Btns/DeleteTaskBtn/DeleteTaskBtn";
// import ChecklistsSection from "./ChecklistsSection";
// import AttachmentsSection from "./AttachmentsSection";
// import CommentsSection from "./CommentsSection";

// export default function TaskDetailDialog({
//   open,
//   onClose,
//   task: initialTask,
//   members,
//   isParticipant,
//   currentUserEmail, // ✅ بدل currentUserId
//   setTasks,
// }: {
//   open: boolean;
//   onClose: () => void;
//   task: any;
//   members: any[];
//   isParticipant: boolean;
//   currentUserEmail: string; // ✅
//   setTasks: React.Dispatch<React.SetStateAction<any[]>>;
// }) {
//   const [task, setTask] = useState(initialTask);

//   function handleTaskUpdated(updatedTask: any) {
//     setTask(updatedTask);
//     setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
//         <DialogHeader>
//           <div className="flex items-start justify-between gap-3">
//             <DialogTitle className="flex-1">{task.title}</DialogTitle>
//             {isParticipant && (
//               <div className="flex items-center gap-1 shrink-0">
//                 <EditTaskBtn task={task} members={members} onUpdated={handleTaskUpdated} />
//                 <DeleteTaskBtn task_id={task.id} title={task.title} setTasks={setTasks} />
//               </div>
//             )}
//           </div>
//         </DialogHeader>

//         <div className="space-y-5">
//           {task.description && (
//             <p className="text-sm text-muted-foreground">{task.description}</p>
//           )}

//           <ChecklistsSection taskId={task.id} isParticipant={isParticipant} />
//           <AttachmentsSection taskId={task.id} isParticipant={isParticipant} />
//           <CommentsSection taskId={task.id} currentUserEmail={currentUserEmail} />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
// TaskDetailDialog.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import EditTaskBtn from "../Btns/EditTaskBtn/EditTaskBtn";
import DeleteTaskBtn from "../Btns/DeleteTaskBtn/DeleteTaskBtn";
import { GetAllLabelsAction } from "@/Actions/Tasks/labels/getAllLabels.action";
import ChecklistsSection from "./ChecklistsSection";
import AttachmentsSection from "./AttachmentsSection";
import CommentsSection from "./CommentsSection";


export default function TaskDetailDialog({
  open,
  onClose,
  task: initialTask,
  members,
  projectId,
  isParticipant,
  currentUserEmail,
  setTasks,
}: {
  open: boolean;
  onClose: () => void;
  task: any;
  members: any[];
  projectId: number;
  isParticipant: boolean;
  currentUserEmail: string;
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [task, setTask] = useState(initialTask);
  const [labels, setLabels] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;
    GetAllLabelsAction().then(({ ok, payload }) => {
      if (ok) setLabels(payload.filter((l: any) => l.project === projectId));
    });
  }, [open, projectId]);

  function handleTaskUpdated(updatedTask: any) {
    setTask(updatedTask);
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="flex-1">{task.title}</DialogTitle>
            {isParticipant && (
              <div className="flex items-center gap-1 shrink-0">
                <EditTaskBtn
                  task={task}
                  members={members}
                  labels={labels}
                  onUpdated={handleTaskUpdated}
                />
                <DeleteTaskBtn task_id={task.id} title={task.title} setTasks={setTasks} />
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}

          <ChecklistsSection taskId={task.id} isParticipant={isParticipant} />
          <AttachmentsSection taskId={task.id} isParticipant={isParticipant} />
          <CommentsSection taskId={task.id} currentUserEmail={currentUserEmail} />
        </div>
      </DialogContent>
    </Dialog>
  );
}