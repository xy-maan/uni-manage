import CreateTeam from "@/app/[locale]/_Components/Projects/CreateTeam";
import StudentProjects from "@/app/[locale]/_Components/Projects/StudentProjects/StudentProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Metadata } from "next";
import { Link } from '@/i18n/navigation';
export const metadata: Metadata = {
  title: "Projects",
};
export default async function projectsUser({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <Card className="border hover:border-primary/50 transition-all py-0">
        <CardContent className="px-6  py-20 pb-6">
          <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6">
            <div className="size-20 rounded-2xl bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <Users className="size-10 text-primary "/>
      
            </div>
            <div className="">
              <h4 className="mb-3">No Active Project</h4>
              <p className="text-muted-foreground mb-2">
                You're not currently part of any project team. Create a new team
                to get started or wait for an invitation to join an existing
                team.
              </p>
              <p className=" text-sm text-muted-foreground">
                Once you create or join a team, your project dashboard will
                appear here.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <CreateTeam/>
             
              <Link href={`/${role}/findteam`}>
                {" "}
                <Button className="py-0 h-10" variant={"outline"}>
                  <Users className="size-5  mr-2"/>
              
                  Find a Team
                </Button>
              </Link>
              <div></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 w-full mt-8">
              <Card className="text-card-foreground border bg-primary/5 border-primary/20 py-0">
                <CardContent className=" p-4 text-left pb-6">
                  <h4 className="mb-2 text-sm">Create Your Own Team</h4>
                  <p className=" text-xs text-muted-foreground">
                    Start fresh with your own project team. Choose your
                    methodology and invite members.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-card-foreground border  bg-secondary/5 border-secondary/20 py-0">
                <CardContent className=" p-4 text-left pb-6">
                  <h4 className="mb-2 text-sm">Join an Existing Team</h4>
                  <p className=" text-xs text-muted-foreground">
                    Browse available teams and find one that matches your skills
                    and interests.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
