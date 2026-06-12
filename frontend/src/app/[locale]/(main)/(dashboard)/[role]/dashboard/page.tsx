import StudentDashboard from "@/app/[locale]/_Components/DashboardComponents/StudentDashboard/StudentDashboard";
import { Metadata } from "next";
import ProjectCard from '../../../../_Components/Projects/ProjectCard/ProjectCard';
import { Calendar, CircleAlert, CircleCheck, Clock, FileText, MessageSquare, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from '@/i18n/navigation';
import TasksDashboardStudent from "@/app/[locale]/_Components/DashboardComponents/StudentDashboard/TasksDashboardStudent";
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
