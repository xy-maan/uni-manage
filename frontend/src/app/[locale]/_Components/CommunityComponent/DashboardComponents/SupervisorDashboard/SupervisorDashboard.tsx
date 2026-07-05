// SupervisorDashboardServer.tsx (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GetSupervisorAction } from "@/Actions/supervisor/getSupervisor.action";
import { GetAllSupervisorAction } from "@/Actions/supervisor/getAllSupervisor.action";
import { GetSupervisorRequestAction } from "@/Actions/supervisor/supervisorRequests/getSupervisorRequest.action";
import { GetAllSupervisorRequestsAction } from "@/Actions/supervisor/supervisorRequests/getAllSupervisorRequests.action";
import SupervisorDashboardClient from "../../../SupervisorDashboardClient";
import { GetDeliverablesAction } from "@/Actions/Deliverables/getDeliverables.action";
import { GetAllProjectsAction } from "@/Actions/Project/getAllProjects.action";
export default async function SupervisorDashboard() {
  const session = await getServerSession(authOptions);

  const [projectsRes, deliverablesRes, requestsRes] = await Promise.all([
    // GetAllSupervisorAction(),
     GetAllProjectsAction(), 
    GetDeliverablesAction(),
    GetAllSupervisorRequestsAction(),
  ]);

  const projects = projectsRes.ok ? projectsRes.payload : [];
  const deliverables = deliverablesRes.ok ? deliverablesRes.payload : [];
  const supervisorRequests = requestsRes.ok ? requestsRes.payload : [];

  // const pendingDeliverables = deliverables.filter(
  //   (d: any) => d.status === "pending"
  // );

  // const approvedDeliverables = deliverables.filter(
  //   (d: any) => d.status === "approved"
  // );
  

  // const totalStudents = projects.reduce(
  //   (acc: number, p: any) => acc + (p.memberships?.length ?? 0),
  //   0
  // );

const currentEmail = session?.user?.email;

const allProjects = projectsRes.ok ? projectsRes.payload : [];

const supervisorProjects = allProjects?.filter((project: any) =>
  project.supervisors?.some(
    (s: any) => s.supervisor_detail?.email === currentEmail
  )
);
const supervisorProjectIds = supervisorProjects?.map((p: any) => p.id);

const pendingDeliverables = deliverables.filter(
  (d: any) =>
    d.status === "pending" &&
    supervisorProjectIds.includes(d.project) 
);

const approvedDeliverables = deliverables.filter(
  (d: any) =>
    d.status === "approved" &&
    supervisorProjectIds.includes(d.project)
);
  const totalStudents = supervisorProjects?.reduce(
  (acc: number, p: any) => {
    const studentMembers = p.memberships?.filter(
      (m: any) => m.user_detail?.role === "STUDENT"
    ) ?? [];
    return acc + studentMembers.length;
  },
  0
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
