import React from 'react'
import { GetAllProjectsAction } from "@/Actions/Project/getAllProjects.action";
import CardProject from '@/app/[locale]/_Components/Projects/CardProject/CardProject';
import { Project } from '@/types/team';
import CreateTeamBtn from '@/app/[locale]/_Components/Auth/Forms/CreateTeamBtn/CreateTeamBtn';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Field } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import FilteringProjects from '@/app/[locale]/_Components/Projects/FilteringProjects';
import EditInvitationBtn from '@/app/[locale]/_Components/Btns/InvitiationsBtn/InvitationBtn';
import { Metadata } from "next";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GetAllSupervisorRequestsAction } from '@/Actions/supervisor/supervisorRequests/getAllSupervisorRequests.action';
import ProjectCardSupervisor from '@/app/[locale]/_Components/CommunityComponent/DashboardComponents/SupervisorDashboard/ProjectCardSupervisor';
import CardsInfoDashboard from '@/app/[locale]/_Components/CommunityComponent/DashboardComponents/CardsInfoDashboard';
import PendingSupervisorRequestsSection from '@/app/[locale]/_Components/PendingSupervisorRequestsSection';

 export const metadata: Metadata = {
   title: "Create Project",
 };
export default async function Projects({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  
const {projects= []}=await GetAllProjectsAction()
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
    <div className="container mx-auto px-4 lg:px-8 py-8 ">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="">
            <h1 className="">{role=="student"?"My Projects":"Supervised Projects"}</h1>
          <div className="text-sm text-muted-foreground mt-0.5">{projects.length} project</div>
          </div>
          <div className="flex gap-2">
            {role === "student" &&
            <EditInvitationBtn/>
            
}
                {role === "student" && <CreateTeamBtn role={role} />}
          </div>
        </div>
     {/* <FilteringProjects projects={projects}/> */}
<FilteringProjects
  projects={role === "supervisor" ? supervisedProjects ?? [] : projects}
  role={role}
/>
{role == "supervisor" && (
  <>
    <CardsInfoDashboard variant="projects" />

    <PendingSupervisorRequestsSection
      initialRequests={pendingRequests ?? []}
    />

    {/* <FilteringProjects
      projects={supervisedProjects ?? []}
      role={role}
    /> */}
  </>
)}
   
      </div>
    </div>
  )
}
