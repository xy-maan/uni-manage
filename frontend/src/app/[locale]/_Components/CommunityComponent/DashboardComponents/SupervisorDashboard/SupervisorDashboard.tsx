// SupervisorDashboardServer.tsx (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GetSupervisorAction } from "@/Actions/supervisor/getSupervisor.action";
import { GetAllSupervisorAction } from "@/Actions/supervisor/getAllSupervisor.action";
import { GetSupervisorRequestAction } from "@/Actions/supervisor/supervisorRequests/getSupervisorRequest.action";
import { GetAllSupervisorRequestsAction } from "@/Actions/supervisor/supervisorRequests/getAllSupervisorRequests.action";
import SupervisorDashboardClient from "../../../SupervisorDashboardClient";
import { GetDeliverablesAction } from "@/Actions/Deliverables/getDeliverables.action";

// export default async function SupervisorDashboard() {
//   const session = await getServerSession(authOptions);
//   const currentUseremail = session?.user?.email;

//   const [projectsRes, deliverablesRes, requestsRes] = await Promise.all([
//     GetAllSupervisorAction(),
//     GetDeliverablesAction(),
//     GetAllSupervisorRequestsAction(),
//   ]);
// const pendingDeliverables = deliverables.filter(
//   (d: any) => d.status === "pending"
// );

// const approvedDeliverables = deliverables.filter(
//   (d: any) => d.status === "approved"
// );

//   const projects = projectsRes.ok ? projectsRes.payload : [];
//   const deliverables = deliverablesRes.ok ? deliverablesRes.payload : [];
//   const supervisorRequests = requestsRes.ok ? requestsRes.payload : [];

//   // حساب الـ stats
//   // const pendingDeliverables = deliverables.filter((d: any) => d.status === "pending");
//   // const approvedDeliverables = deliverables.filter((d: any) => d.status === "approved");
//   const totalStudents = projects.reduce(
//     (acc: number, p: any) => acc + (p.memberships?.length ?? 0),
//     0,
//   );

//   return (
//     <SupervisorDashboardClient
//       projects={projects.slice(0, 4)}
//       supervisorRequests={supervisorRequests}
//       completedCount={approvedDeliverables.length}
//       pendingCount={pendingDeliverables.length}
//       teamCount={totalStudents}
//       documentsCount={deliverables.length}
//     />
//   );
// }
export default async function SupervisorDashboard() {
  const session = await getServerSession(authOptions);

  const [projectsRes, deliverablesRes, requestsRes] = await Promise.all([
    GetAllSupervisorAction(),
    GetDeliverablesAction(),
    GetAllSupervisorRequestsAction(),
  ]);

  const projects = projectsRes.ok ? projectsRes.payload : [];
  const deliverables = deliverablesRes.ok ? deliverablesRes.payload : [];
  const supervisorRequests = requestsRes.ok ? requestsRes.payload : [];

  const pendingDeliverables = deliverables.filter(
    (d: any) => d.status === "pending"
  );

  const approvedDeliverables = deliverables.filter(
    (d: any) => d.status === "approved"
  );

  const totalStudents = projects.reduce(
    (acc: number, p: any) => acc + (p.memberships?.length ?? 0),
    0
  );
const currentEmail = session?.user?.email;

const allProjects = projectsRes.ok ? projectsRes.payload : [];

const supervisorProjects = allProjects.filter(
  (project: any) =>
    project.supervisor?.email === currentEmail
);
  return (
    <SupervisorDashboardClient
        projects={supervisorProjects}
      supervisorRequests={supervisorRequests}
      completedCount={approvedDeliverables.length}
      pendingCount={pendingDeliverables.length}
      teamCount={totalStudents}
      documentsCount={deliverables.length}
    />
  );
}

// import React from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Link } from '@/i18n/navigation';
// import HeaderDashboard from "../HeaderDashboard";
// import CardsInfoDashboard from "../CardsInfoDashboard";
// import TasksDashboardSupervisor from "./TasksDashboardSupervisor";
// // import ReviewDashboard from "../ReviewDashboard";
// import QuickAction from "../QuickAction";
// import { GetAllProjectsAction } from "@/Actions/Project/getAllProjects.action";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export default async function SupervisorDashboard() {
//   const { payload: allProjects } = await GetAllProjectsAction();
//   const session = await getServerSession(authOptions);
//   const currentUserEmail = session?.user?.email;

//   const supervisedProjects = allProjects?.filter((p: any) =>
//     p.supervisors?.some((s: any) => s.supervisor_detail?.email === currentUserEmail)
//   ) ?? [];

//   return (
//     <div>
//       <HeaderDashboard variant="supervisor" />
//       <CardsInfoDashboard variant="supervisor" />

//       <div className="gap-8 grid lg:grid-cols-3">
//         <div className="upcoming lg:col-span-2">
//           <Card className="p-0">
//             <CardHeader className="px-6 pt-6 gap-1.5">
//               <div className="flex items-center justify-between">
//                 <div className="flex flex-col">
//                   <h4 className="leading-none font-medium">Supervised Projects</h4>
//                   <p className="text-muted-foreground">
//                     Overview of all your current projects
//                   </p>
//                 </div>
//                 <Link href="/projects">
//                   <Button className="bg-transparent cursor-pointer hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9">
//                     View All
//                   </Button>
//                 </Link>
//               </div>
//             </CardHeader>
//             <CardContent className="pb-6 px-6">
//               <div className="space-y-4">
//                 {supervisedProjects.length === 0 ? (
//                   <p className="text-sm text-muted-foreground text-center py-8">
//                     You're not supervising any projects yet.
//                   </p>
//                 ) : (
//                   supervisedProjects
//                     .slice(0, 4)
//                     .map((project: any) => (
//                       <TasksDashboardSupervisor key={project.id} project={project} />
//                     ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="space-y-6">
//           <ReviewDashboard variant="supervisor" />
//           <Card className="p-0">
//             <CardHeader className="px-6 pt-6 gap-1.5">
//               <h4 className="leading-none">Quick Actions</h4>
//             </CardHeader>
//             <CardContent className="pb-6 px-6">
//               <QuickAction variant="supervisor" />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }