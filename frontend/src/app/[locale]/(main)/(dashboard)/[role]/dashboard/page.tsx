import StudentDashboard from "@/app/[locale]/_Components/DashboardComponents/StudentDashboard/StudentDashboard";
import { Metadata } from "next";

import SupervisorDashboard from "@/app/[locale]/_Components/DashboardComponents/SupervisorDashboard/SupervisorDashboard";
 export const metadata: Metadata = {
   title: "Dashboard",
 };
export default async function DashboardUser({
  params,
}:{
  params: Promise< { role: string }>;
}) {
  const { role } = await params;
  return (
 <div className="container mx-auto px-4 lg:px-8 py-8">
  
      {role=="student"&&<StudentDashboard/>}
      {role=="supervisor"&&<SupervisorDashboard/>}
 </div>
  );
}
