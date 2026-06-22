// // _Components/Projects/ProjectProgress/ProjectProgress.tsx
// "use client";
// import { Progress } from "@/components/ui/progress";
// import { Task } from "@/types/tasks";
// import { calculateTaskProgress } from "./UtilitiesComponents/calculateTaskProgress";

// export default function ProjectProgress({ tasks }: { tasks: Task[] }) {
//   const { percent, completed, total } = calculateTaskProgress(tasks);

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between text-sm">
//         <span className="text-muted-foreground">Project Progress</span>
//         <span className="font-medium">{percent}%</span>
//       </div>
//       <Progress value={percent} className="h-2" />
//       <p className="text-xs text-muted-foreground">
//         {completed} of {total} tasks completed
//       </p>
//     </div>
//   );
// }