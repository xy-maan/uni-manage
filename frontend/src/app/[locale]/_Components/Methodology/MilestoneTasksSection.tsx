// // MilestoneTasksSection.tsx
// "use client";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import AssignTaskToMilestoneBtn from "./Btns/AssignTaskToMilestoneBtn";
// import RemoveTaskFromMilestoneBtn from "./Btns/RemoveTaskFromMilestoneBtn";


// export default function MilestoneTasksSection({
//   milestoneId,
//   projectTasks,
// }: {
//   milestoneId: number;
//   projectTasks: any[];
// }) {
//   const [milestoneTasks, setMilestoneTasks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function loadMilestoneTasks() {
//     setLoading(true);
//     const { ok, payload } = await GetMilestoneTasksAction();
//     if (ok) {
//       setMilestoneTasks(payload.filter((mt: any) => mt.milestone === milestoneId));
//     } else {
//       toast.error("Failed to load milestone tasks", { position: "top-center", duration: 2000 });
//     }
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadMilestoneTasks();
//   }, [milestoneId]);

//   if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;

//   const assignedTaskIds = milestoneTasks.map((mt) => mt.task);
//   const availableTasks = projectTasks.filter((t) => !assignedTaskIds.includes(t.id));

//   return (
//     <div className="space-y-2">
//       <AssignTaskToMilestoneBtn
//         milestoneId={milestoneId}
//         availableTasks={availableTasks}
//         onAssigned={(newAssignment) => setMilestoneTasks((prev) => [...prev, newAssignment])}
//       />
//       {milestoneTasks.map((mt) => {
//         const task = projectTasks.find((t) => t.id === mt.task);
//         return (
//           <div key={mt.id} className="flex items-center justify-between p-2 rounded-lg border">
//             <span className="text-sm">{task?.title ?? `Task #${mt.task}`}</span>
//             <RemoveTaskFromMilestoneBtn milestone_task_id={mt.id} setMilestoneTasks={setMilestoneTasks} />
//           </div>
//         );
//       })}
//     </div>
//   );
// }