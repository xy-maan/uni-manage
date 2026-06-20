// import CreateTeam from "@/app/[locale]/_Components/Projects/CreateTeam";
import StudentProjects from "@/app/[locale]/_Components/Projects/StudentProjects/StudentProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Users ,FolderOpen, BookOpen, GraduationCap} from "lucide-react";
import { Metadata } from "next";
import { Link } from '@/i18n/navigation';
import { redirect } from "@/i18n/navigation";

// import { GetAllProjectsAction } from "@/Actions/Project/getAllProjects.action";
// import getAuthData from "@/utilities/getAuthData";
// import CardProject from "@/app/[locale]/_Components/CardProject/CardProject";
import CreateTeamBtn from "@/app/[locale]/_Components/Auth/Forms/CreateTeamBtn/CreateTeamBtn";
import EditInvitationBtn from "@/app/[locale]/_Components/Btns/InvitiationsBtn/InvitationBtn";
import { Separator } from "@/components/ui/separator";
export const metadata: Metadata = {
  title: "Projects",
};
export default async function CreateProjectPage({
  params,
}: {
  params: Promise<{ role: string,locale:string }>;
}) {
  const { role,locale } = await params;
// const {projects}=await GetAllProjectsAction()

  if (role === "supervisor") {
    redirect({ href: `/${role}/SupervisorProjectsPage`, locale });
  }
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <div className="min-w-3xl">
      {/* {projects?.length===0? */}
      {role=="student"&&
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
      }
      {/* {role=="supervisor"&&

        <SupervisorProjectsPage/>
      } */}
    

      </div>
        </div>
    </div>
  );
}
