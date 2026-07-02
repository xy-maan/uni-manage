"use client"
import React from 'react'
import { Membership, Project } from '@/types/team'
import { getSingleProjectAction } from '@/Actions/Project/getSingletProject.action';
import { Button } from '@/components/ui/button'
import { Archive, ArrowLeft, BookOpen, Calendar, Check, ChevronRight, CircleCheck, Flag, Globe, GraduationCap, LayoutGrid, Lock, Pen, Trash2, Users, Zap } from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import EditBtn from '../../Btns/EditBtn/EditBtn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamProject from '../TeamProject';
import OverviewProject from '../OverviewProject';
import SupervisorProject from '../../Supervisor/SupervisorProject';
import TasksTab from '../../Tasks/TasksTab';
import { useSession } from 'next-auth/react';
import FeedBackTab from '../../FeedBackTab/FeedBackTab';
import MeetingsSection from '../../Tasks/MeetingsSection';
import DeliverablesSection from '../../Tasks/DeliverablesSection';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from "next/navigation";

export default function BodyProject({project,role}:{project:Project;role:string}) {
  const {data}=useSession();
  const currentUserEmail = data?.user?.email;
    const isLeader = project.memberships.some((m: Membership) => m.role === "leader");
      const isParticipant = project.memberships.some((m: Membership) => m.user_detail.email ===currentUserEmail );
const isMember = project.memberships.some(
  (m: Membership) => m.user_detail.email === currentUserEmail
);
const isSupervisor = project.supervisors?.some(
  (s: any) => s.supervisor_detail?.email === currentUserEmail
);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "overview";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tab);

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
<Tabs    value={currentTab}
className="w-full space-y-6" onValueChange={handleTabChange}>
  <TabsList>
    <TabsTrigger  value="overview" className='transition-all border'>Overview</TabsTrigger>
    <TabsTrigger value="team"  className='transition-all border'>Team</TabsTrigger>
    <TabsTrigger value="tasks"  className='transition-all border'>Tasks</TabsTrigger>
    <TabsTrigger value="deliverables"  className='transition-all border'>Deliverables</TabsTrigger>
    <TabsTrigger value="meetings"  className='transition-all border'>Meetings</TabsTrigger>
    <TabsTrigger value="feedback"  className='transition-all border'>Feedback</TabsTrigger>
    {/* {role=="student"&& */}
    
    <TabsTrigger value="supervision"  className='transition-all border'>Supervision</TabsTrigger>
    {/* } */}
  </TabsList>

  <TabsContent value="overview" ><OverviewProject project={project} role={role}/></TabsContent>
  <TabsContent value="team" className='space-y-5'><TeamProject role={role} project={project}/></TabsContent>
  <TabsContent value="tasks"><TasksTab project={project} isParticipant={isParticipant} members={project.memberships} currentUserEmail={currentUserEmail!}/></TabsContent>
  <TabsContent value="deliverables"><DeliverablesSection isSupervisor={isSupervisor} projectId={project.id} isParticipant={isParticipant}  isMember={isMember} /></TabsContent>
  <TabsContent value="meetings"><MeetingsSection projectId={project.id} isParticipant={isParticipant}  members={project.memberships}/></TabsContent>
  <TabsContent value="feedback"><FeedBackTab projectId={project.id} isSupervisor={isSupervisor} currentUserEmail={currentUserEmail!}/></TabsContent>
     {/* {role=="student"&& */}

  <TabsContent value="supervision"><SupervisorProject projectId={project.id} role={role}  project={project}/></TabsContent>
{/* } */}
</Tabs>
  )
}
