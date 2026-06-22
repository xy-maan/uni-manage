// import React from "react";
// import ProjectCard from "../../Projects/ProjectCard/ProjectCard";
// import { Calendar, CircleAlert, CircleCheck, Clock, FileText, MessageSquare, Users } from "lucide-react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Link } from '@/i18n/navigation';
// import TasksDashboardStudent from "./TasksDashboardStudent";
// import HeaderDashboard from "../HeaderDashboard";
// import CardsInfoDashboard from "../CardsInfoDashboard";
// import ReviewDashboard from "../ReviewDashboard";
// import QuickAction from "../QuickAction";

// export default function StudentDashboard() {
//   return (
//     <div>
//      <HeaderDashboard variant="student"/>
//  <ProjectCard
//         activeBar="student"
//         title="AI-Powered Study Assistant"
//         subtitle="Supervised by Dr. Abdulrahman"
//         topCard={false}
//         isSkills={false}
//         isDetails={false}
//         variant="dashboard"
//       />
//    <CardsInfoDashboard  variant="student"/>
//       <div className="gap-8 grid lg:grid-cols-3 ">
//         <div className="upcoming lg:col-span-2">
//           <Card className="p-0 ">
//             <CardHeader className=" px-6 pt-6  gap-1.5">
//                 <div className=" flex items-center justify-between">

//                       <div className="flex flex-col">
//                 <h4 className="leading-none font-medium">Upcoming Tasks</h4>
//                 <p className="text-muted-foreground">
//                   Your assigned tasks for this week
//                 </p>
//               </div>
//               <Button className="bg-transparent cursor-pointer hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9">View All</Button>
//                 </div>
            
//             </CardHeader>
//             <CardContent className="pb-6 px-6">
//                     <div className="space-y-4 ">
//        <TasksDashboardStudent/>
//        <TasksDashboardStudent/>
// </div>
//             </CardContent>
//           </Card>
//         </div>
//         <div className="space-y-6">
//          <ReviewDashboard variant="student"/>
           
//                <Card className="p-0">
//                 <CardHeader className="px-6 pt-6 gap-1.5">
//                     <h4 className="leading-none">Quick Actions
// </h4>
//                 </CardHeader>
//                 <CardContent className="pb-6 px-6">
// <QuickAction variant="student"/>
//                 </CardContent>
//             </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
// StudentDashboard.tsx
import { getServerSession } from "next-auth";
import { GetAllProjectsAction } from "@/Actions/Project/getAllProjects.action";

import HeaderDashboard from "../HeaderDashboard";
import CardsInfoDashboard from "../CardsInfoDashboard";
// import ReviewDashboard from "../ReviewDashboard";
import QuickAction from "../QuickAction";
import { authOptions } from "@/lib/auth";
import { GetTasksAction } from "@/Actions/Tasks/tasks/getAllTasks.action";
import { GetTaskActivityListAction } from "@/Actions/Tasks/tasks/getAllTasksActivity.action";
import StudentDashboardClient from "../StudentDashboardClient";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email;

  const { projects: allProjects = [] } = await GetAllProjectsAction();

  const myProjects = allProjects.filter((p: any) =>
    p.memberships?.some((m: any) => m.user_detail?.email === currentUserEmail)
  );

  const activeProject =
    myProjects.find((p: any) => p.status === "active") ?? myProjects[0] ?? null;

  let tasks: any[] = [];
  let activity: any[] = [];

  if (activeProject) {
    const tasksRes = await GetTasksAction(activeProject.id);
    if (tasksRes.ok) tasks = tasksRes.payload;

    const activityRes = await GetTaskActivityListAction();
    if (activityRes.ok && activityRes?.payload) {
      const projectTaskIds = tasks.map((t: any) => t.id);
      activity = activityRes.payload
        .filter((a: any) => projectTaskIds.includes(a.task))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
    }
  }

  const myUpcomingTasks = tasks
    .filter((t: any) => t.assignee_detail?.email === currentUserEmail && t.status !== "done")
    .sort((a: any, b: any) => {
      if (!a.due_at) return 1;
      if (!b.due_at) return -1;
      return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
    })
    .slice(0, 5);

  const completedCount = tasks.filter((t: any) => t.status === "done").length;
  const pendingCount = tasks.filter((t: any) => t.status !== "done").length;

  return (
    <div>
      <HeaderDashboard variant="student" />

      <StudentDashboardClient
        project={activeProject}
        myProjectsCount={myProjects.length}
        tasks={tasks}
        myUpcomingTasks={myUpcomingTasks}
        activity={activity}
        completedCount={completedCount}
        pendingCount={pendingCount}
        teamCount={activeProject?.memberships?.length ?? 0}
      />
    </div>
  );
}