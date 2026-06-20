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

export default function BodyProject({project,role}:{project:Project;role:string}) {
  const {data}=useSession();
  const currentUserEmail = data?.user?.email;
    const isLeader = project.memberships.some((m: Membership) => m.role === "leader");
      const isParticipant = project.memberships.some((m: Membership) => m.user_detail.email ===currentUserEmail );
const isMember = project.memberships.some(
  (m: Membership) => m.user_detail.email === currentUserEmail
);
  const isSupervisor = project.supervisors?.some(
    (s: any) => s.supervisor === currentUserEmail
  );
  return (
<Tabs defaultValue="overview" className="w-full space-y-6">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="team">Team</TabsTrigger>
    <TabsTrigger value="tasks">Tasks</TabsTrigger>
    <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
    <TabsTrigger value="meetings">Meetings</TabsTrigger>
    <TabsTrigger value="feedback">Feedback</TabsTrigger>
    <TabsTrigger value="supervision">Supervision</TabsTrigger>
  </TabsList>

  <TabsContent value="overview" ><OverviewProject project={project} role={role}/></TabsContent>
  <TabsContent value="team" className='space-y-5'><TeamProject project={project}/></TabsContent>
  <TabsContent value="tasks"><TasksTab project={project} isParticipant={isParticipant} members={project.memberships} currentUserEmail={currentUserEmail!}/></TabsContent>
  <TabsContent value="deliverables"><DeliverablesSection isSupervisor={isSupervisor} projectId={project.id} isParticipant={isParticipant}  isMember={isMember} /></TabsContent>
  <TabsContent value="meetings"><MeetingsSection projectId={project.id} isParticipant={isParticipant}  members={project.memberships}/></TabsContent>
  <TabsContent value="feedback"><FeedBackTab projectId={project.id} isSupervisor={isSupervisor} currentUserEmail={currentUserEmail!}/></TabsContent>
  <TabsContent value="supervision"><SupervisorProject projectId={project.id}  project={project}/></TabsContent>
</Tabs>
  )
}
