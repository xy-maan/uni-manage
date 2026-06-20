// import { Badge } from '@/components/ui/badge'
// import React from 'react'
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import CardsInfoDashboard from '@/app/[locale]/_Components/DashboardComponents/CardsInfoDashboard';
// import { Filter, Search } from 'lucide-react';
// import ProjectCardSupervisor from '@/app/[locale]/_Components/DashboardComponents/SupervisorDashboard/ProjectCardSupervisor';
// import { GetAllProjectsAction } from '@/Actions/Project/getAllProjects.action';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { Supervsiors } from '@/types/team';
// export default async function SupervisorProjectsPage({
//   params,
// }: {
//   params: Promise<{ role: string }>;
// }) {
//   const { role } = await params;
//   // const { payload: projects } = await GetAllProjectsAction();
//     const { payload: allProjects } = await GetAllProjectsAction();
//   const session = await getServerSession(authOptions);
//   const currentUserEmail = session?.user?.email;
//     const supervisedProjects = allProjects?.filter((p: any) =>
//     p.supervisors?.some((s: Supervsiors) => s.email === currentUserEmail)
//   );

//   return (
//        <div className="container mx-auto px-4 lg:px-8 py-8">
//         <div className="flex items-center justify-between mb-4">
//             <div className="">
//                 <h1 className="mb-2">Supervised Projects</h1>
//                 <p className="text-muted-foreground">Monitor and evaluate all projects under your supervision</p>
//             </div>
//             <Badge className='bg-primary/10 text-primary'>Primary Supervisor</Badge>
//         </div>
//      <CardsInfoDashboard variant='projects'/>
//      <Card className="p-0 mb-8">
//         <CardContent className="p-4 pb-6">
//             <div className="flex flex-col sm:flex-row gap-3">

           
//             <form className="flex-1">
//             <label
//               htmlFor="search"
//               className="block mb-2.5 text-sm font-medium text-heading sr-only "
//             >
//               Search
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//                 <Search className=" absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
//               </div>
//               <input
//                 type="search"
//                 id="search"
//                 className=" p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md  px-3 py-1 text-sm bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10"
//                 placeholder="Search projects..."
//                 required
              
//               />
//             </div>
//           </form>
//           <Button variant="outline">
//             <Filter className='size-4 mr-2'/>
//             Filter</Button>
//              </div>
//         </CardContent>
//      </Card>
//       <div className="space-y-4 mt-6">
//         {supervisedProjects?.length === 0 && (
//           <p className="text-sm text-muted-foreground text-center py-12">
//             You're not supervising any projects yet.
//           </p>
//         )}
//         {supervisedProjects?.map((project: any) => (
//           <ProjectCardSupervisor key={project.id} project={project} role={role} />
//         ))}
//       </div>
//        </div>
//   )
// }


import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CardsInfoDashboard from '@/app/[locale]/_Components/DashboardComponents/CardsInfoDashboard';
import { Filter, Search } from 'lucide-react';
import ProjectCardSupervisor from '@/app/[locale]/_Components/DashboardComponents/SupervisorDashboard/ProjectCardSupervisor';
import { GetAllProjectsAction } from '@/Actions/Project/getAllProjects.action';
import { GetAllSupervisorRequestsAction } from '@/Actions/supervisor/supervisorRequests/getAllSupervisorRequests.action';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Supervsiors } from '@/types/team';
import PendingSupervisorRequestsSection from '@/app/[locale]/_Components/PendingSupervisorRequestsSection';

export default async function SupervisorProjectsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const { payload: allProjects } = await GetAllProjectsAction();
  const { payload: allRequests } = await GetAllSupervisorRequestsAction();
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email;
const supervisedProjects = allProjects?.filter((p: any) =>
  p.supervisors?.some((s: any) => s.supervisor_detail?.email === currentUserEmail)
);

  const pendingRequests = allRequests?.filter(
    (r: any) =>
      r.supervisor_detail?.email === currentUserEmail &&
      r.status === "pending"
  );

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="">
          <h1 className="mb-2">Supervised Projects</h1>
          <p className="text-muted-foreground">
            Monitor and evaluate all projects under your supervision
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary">Primary Supervisor</Badge>
      </div>

      <CardsInfoDashboard variant="projects" />

      {/* ✅ Pending Requests Section - Client Component */}
      <PendingSupervisorRequestsSection initialRequests={pendingRequests ?? []} />

      <Card className="p-0 mb-8">
        <CardContent className="p-4 pb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <form className="flex-1">
              <label htmlFor="search" className="block mb-2.5 text-sm font-medium text-heading sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
                <input
                  type="search"
                  id="search"
                  className="p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-sm bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10"
                  placeholder="Search projects..."
                  required
                />
              </div>
            </form>
            <Button variant="outline">
              <Filter className="size-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-6">
        {supervisedProjects?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">
            You're not supervising any projects yet.
          </p>
        )}
        {supervisedProjects?.map((project: any) => (
          <ProjectCardSupervisor key={project.id} project={project} role={role} />
        ))}
      </div>
    </div>
  );
}