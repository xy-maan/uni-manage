"use client"
import { Project } from '@/types/team'
import { getSingleProjectAction } from '@/Actions/Project/getSingletProject.action';
import { Button } from '@/components/ui/button'
import { Archive, ArrowLeft, BookOpen, Calendar, Check, ChevronRight, CircleCheck, Flag, Globe, GraduationCap, LayoutGrid, Lock, Pen, Trash2, Users, Zap } from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
// import EditBtn from '../../Btns/EditBtn/EditBtn';
import { OptionsPayload } from '@/types/skills';
import ProjectActionBtns from '../../Btns/ProjectActionBtns';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
const statusConfig: Record<string, { label: string; class: string }> = {
  forming:      { label: "Forming",      class: "text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  active:       { label: "Active",       class: "bg-green-500/10 text-green-500 border-green-500/20" },
  under_review: { label: "Under Review", class: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  submitted:    { label: "Submitted",    class: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  archived:     { label: "Archived",     class: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
};
export default function HeaderProject({project}:{project:Project}) {
      const status = statusConfig[project.status] ?? statusConfig.forming;
const [currentProject, setCurrentProject] = useState(project);
 const { data: session } = useSession();
  const currentUserEmail = session?.user?.email;


 function formatDueDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
  // const isLeader = currentProject.memberships.some((m: any) => m.role === "leader");
  const myMembership = currentProject.memberships.find(
    (m: any) => m.user_detail?.email === currentUserEmail
  );
  const isLeader = myMembership?.role === "leader";
  // const isLeader = myMembership?.role === "leader";

  const isSupervisor = currentProject.supervisors?.some(
    (s: any) => s.supervisor_detail?.email === currentUserEmail
  );

  (project);
  return (
   <div className="mb-6">

<div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-4">
  <div className="flex-1 ">
    <div className="flex flex-wrap items-center gap-2 mb-1">
      <h1 className="text-xl font-semibold capitalize">
        {currentProject?.name}
      </h1>
      <Badge className={`bg-blue-100 text-blue-700 capitalize ${status.class}`}>
   {status.label}</Badge>  
      <Badge >
        {currentProject?.project_type=="graduation"?<GraduationCap className='size-3'/>:<BookOpen className='size-3'/>}
        
        {currentProject?.project_type}</Badge>
               <Badge className="bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 text-xs">
    {currentProject.methodology=="sprint"&&<Zap className="size-3 mt-px"/>}
    {currentProject.methodology=="milestone"&&<Flag className="size-3 mt-px"/>}
    {currentProject.methodology=="kanban"&&<LayoutGrid className="size-3 mt-px"/>}
  {currentProject.methodology}

  </Badge>


    </div>
    <p className="text-sm text-muted-foreground mb-2 max-w-2xl leading-relaxed">  {currentProject.description || "No description provided."}
</p>
     {currentProject.archive_tags?.length > 0 && (
         <div className="flex flex-wrap gap-1 my-2">
           {currentProject.archive_tags.map((tag: OptionsPayload) => (
             <Badge key={tag.id}  variant="outline" className="text-xs ">
               {tag.name}
             </Badge>
           ))}
           {currentProject.archive_tags.length > 3 && (
             <Badge variant="outline" className="text-xs">
               +{currentProject.archive_tags.length - 3}
             </Badge>
           )}
         </div>
       )}
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">

         <div className="flex items-center gap-1">
                    <Users className="size-3.5"/>
                     <span>{currentProject.memberships.length}/{currentProject.max_members} members</span>
                  </div>
                    <div className="flex items-center gap-1">
                    <Calendar className="size-3.5"/>
                     <span>Due {formatDueDate(currentProject.created_at)}</span>
                  </div>
                      <div className="flex items-center gap-1">
                    <BookOpen className="size-3.5"/>
                     <span>
  {currentProject.semester?.name} Semester {currentProject.academic_year?.name}
</span>
                  </div>
                   <div className="flex items-center gap-1">
                    {currentProject.is_public==true ?    <Globe className="size-3.5"/>:    <Lock className="size-3.5"/>}
                
                     <span>{currentProject.is_public==true ?"Public":"Private"}</span>
                  </div>

    </div>
  </div>
 {/* {isLeader&&

          <ProjectActionBtns
            projectId={currentProject.id}
            project={currentProject}
            onProjectChange={(updatedProject) =>
              setCurrentProject((prev) => ({ ...prev, ...updatedProject }))
            }
          />
        
  } */}
 {isLeader && (
          <ProjectActionBtns
            projectId={currentProject.id}
            project={currentProject}
            isLeader={isLeader}
            isSupervisor={isSupervisor}
            onProjectChange={(updatedProject) =>
              setCurrentProject((prev) => ({ ...prev, ...updatedProject }))
            }
          />
        )}
</div>
 {/* <Card className="p-0 ">
    <CardContent className=" px-5 py-3 pb-6 flex gap-3 items-center">
    <span className="text-xs text-muted-foreground shrink-0">
     Overall Progress
    </span>
         
                <Progress
                  value={0}
                  id="progress-upload"
                  className="h-2 bg-primary/20 [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none"
                />
                <span className="ml-auto text-sm ">
                  0%
                </span>
                <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">3/11 tasks done</span>
    </CardContent>
</Card> */}
 {/* <ProjectProgress tasks={tasks} /> */}
</div>

  )
}
