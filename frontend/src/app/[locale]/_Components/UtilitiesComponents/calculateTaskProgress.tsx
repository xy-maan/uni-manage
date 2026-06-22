// // utilities/calculateTaskProgress.ts
// import { Task } from "@/types/tasks";

// export function calculateTaskProgress(tasks: Task[]) {
//   if (tasks.length === 0) {
//     return { percent: 0, completed: 0, total: 0 };
//   }

//   const completed = tasks.filter((t) => t.status === "done").length;
//   const percent = Math.round((completed / tasks.length) * 100);

//   return { percent, completed, total: tasks.length };
// }