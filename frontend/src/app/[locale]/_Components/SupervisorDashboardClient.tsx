// SupervisorDashboardClient.tsx (Client Component)
"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import HeaderDashboard from "./CommunityComponent/DashboardComponents/HeaderDashboard";
import CardsInfoDashboard from "./CommunityComponent/DashboardComponents/CardsInfoDashboard";
import TasksDashboardSupervisor from "./CommunityComponent/DashboardComponents/SupervisorDashboard/TasksDashboardSupervisor";
// import ReviewDashboard from "./DashboardComponents/ReviewDashboard";
import QuickAction from "./CommunityComponent/DashboardComponents/QuickAction";

export default function SupervisorDashboardClient({
  projects,
  supervisorRequests,
  completedCount,
  pendingCount,
  teamCount,
  documentsCount,
}: {
  projects: any[];
  supervisorRequests: any[];
  completedCount: number;
  pendingCount: number;
  teamCount: number;
  documentsCount: number;
}) {
    console.log(projects)
  return (
    <div>
      <HeaderDashboard variant="supervisor" />

      <CardsInfoDashboard
        variant="supervisor"
        completedCount={completedCount}
        pendingCount={pendingCount}
        teamCount={teamCount}
        documentsCount={documentsCount}
      />

      <div className="gap-8 grid lg:grid-cols-3">
        {/* Supervised Projects */}
        <div className="upcoming lg:col-span-2">
{projects.length > 0 ? (
  <Card className="p-0">
    <CardHeader className="px-6 pt-6 gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h4 className="leading-none font-medium">
            Supervised Projects
          </h4>
          <p className="text-muted-foreground">
            Overview of all your current projects
          </p>
        </div>

        <Button variant="ghost" asChild>
          <Link href="/supervisor/projects">View All</Link>
        </Button>
      </div>
    </CardHeader>

    <CardContent className="pb-6 px-6">
      <div className="space-y-4">
        {projects.map((project) => (
          <TasksDashboardSupervisor
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </CardContent>
  </Card>
) : (
  <Card className="p-0">
    <CardContent className="py-8">
      <p className="text-sm text-muted-foreground text-center">
        No supervised projects yet
      </p>
    </CardContent>
  </Card>
)}
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* <ReviewDashboard
            variant="supervisor"
            supervisorRequests={supervisorRequests}
          /> */}

          <Card className="p-0">
            <CardHeader className="px-6 pt-6 gap-1.5">
              <h4 className="leading-none">Quick Actions</h4>
            </CardHeader>
            <CardContent className="pb-6 px-6">
              <QuickAction variant="supervisor" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}