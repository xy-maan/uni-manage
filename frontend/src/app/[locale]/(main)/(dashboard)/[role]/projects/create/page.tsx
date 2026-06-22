// import CreateTeam from "@/app/[locale]/_Components/Projects/CreateTeam";
import StudentProjects from "@/app/[locale]/_Components/Projects/StudentProjects/StudentProjects";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search,Filter, Users ,FolderOpen, BookOpen, GraduationCap} from "lucide-react";
import { Metadata } from "next";
import { Link } from '@/i18n/navigation';
import { redirect } from "@/i18n/navigation";

// import { GetAllProjectsAction } from "@/Actions/Project/getAllProjects.action";
// import getAuthData from "@/utilities/getAuthData";
// import CardProject from "@/app/[locale]/_Components/CardProject/CardProject";
import CreateTeamBtn from "@/app/[locale]/_Components/Auth/Forms/CreateTeamBtn/CreateTeamBtn";
import EditInvitationBtn from "@/app/[locale]/_Components/Btns/InvitiationsBtn/InvitationBtn";
import { Separator } from "@/components/ui/separator";
import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CardsInfoDashboard from '@/app/[locale]/_Components/CommunityComponent/DashboardComponents/CardsInfoDashboard';
// import { Filter } from 'lucide-react';
import ProjectCardSupervisor from '@/app/[locale]/_Components/CommunityComponent/DashboardComponents/SupervisorDashboard/ProjectCardSupervisor';
import { GetAllProjectsAction } from '@/Actions/Project/getAllProjects.action';
import { GetAllSupervisorRequestsAction } from '@/Actions/supervisor/supervisorRequests/getAllSupervisorRequests.action';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Supervsiors } from '@/types/team';
import PendingSupervisorRequestsSection from '@/app/[locale]/_Components/PendingSupervisorRequestsSection';

export const metadata: Metadata = {
  title: "Projects",
};
export default async function CreateProjectPage({
  params,
}: {
  params: Promise<{ role: string,locale:string }>;
}) {
  const { role,locale } = await params;

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
     <>
     
      {role=="student"&&
    <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <div className="min-w-3xl">
      {/* {projects?.length===0? */}
      <Card className="border-dashed border-2 p-0">
        <CardContent className=" py-16 px-10 pb-6">
          <div className={`flex flex-col max-w-2xl mx-auto items-center justify-center text-center space-y-6`}>
            <div className="size-24 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center border border-primary/20">
              <FolderOpen className="size-12 text-primary "/>
            </div>
                  <div className="">
              <h4 className="mb-3">No Active Project</h4>
              <p className="text-muted-foreground mb-2">
              You're not part of any project yet. Create a new project, browse public projects to join, or check your pending invitations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <CreateTeamBtn role={role}/>
              <Link href={`/${role}/findteam`}>
                {" "}
                <Button className="py-0 h-10" variant={"outline"} >
                  <Search className="size-5  mr-2"/>
              
                  Browse Projects
                </Button>
              </Link>
              <div></div>
               <Link href={`/${role}/projects`}>
                {" "}
                <Button className="py-0 h-10" variant={"outline"} >
                  <Users className="size-5  mr-2"/>
                  My Projects
                </Button>
              </Link>
              <EditInvitationBtn/>
              <div></div>
            </div>
            <Separator/>
       <div className="grid sm:grid-cols-3 gap-4 w-full text-left">
  <Card className="bg-accent/40 border-0 gap-0 p-0">
    <CardContent className="p-4 ">
      <div className="mb-2 flex gap-2 items-center">
        <GraduationCap className="size-5 text-primary" />
      <p className="text-sm font-medium">
        Graduation Project
      </p>
      </div>


      <p className="text-xs text-muted-foreground leading-relaxed">
        Form a team, request a supervisor, and work on your thesis with full
        lifecycle tracking.
      </p>
    </CardContent>
  </Card>

  <Card className="bg-accent/40 border-0 gap-0 p-0">
    <CardContent className="p-4">
      <div className="mb-2 flex items-center gap-2">
        <BookOpen className="size-5 text-primary" />
      <p className="text-sm font-medium">
        Course Project
      </p>
      </div>


      <p className="text-xs text-muted-foreground leading-relaxed">
        Semester-specific deliverable for a course. Invite classmates and track
        tasks together.
      </p>
    </CardContent>
  </Card>

  <Card className="bg-accent/40 border-0 gap-0 p-0">
    <CardContent className="p-4">
      <div className="mb-2 flex items-center gap-2">
        <Users className="size-5 text-primary" />
      <p className="text-sm font-medium">
        Join a Team
      </p>
      </div>


      <p className="text-xs text-muted-foreground leading-relaxed">
        Browse open teams and send a join request, or accept a pending
        invitation.
      </p>
    </CardContent>
  </Card>
</div>
            
          </div>
        </CardContent>
      </Card>
            </div>
        </div>
    </div>
      }
    {role=="supervisor"&&

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
      } 
    
     </>


  );
}
