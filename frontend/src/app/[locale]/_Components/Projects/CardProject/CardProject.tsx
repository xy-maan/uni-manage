// app/[role]/projects/_components/ProjectCard.tsx
"use client"
import { Button } from "@/components/ui/button";
import { Users, Crown, ArrowRight, GitBranch, Zap, Flag, LayoutGrid, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Project,Technology } from "@/types/team";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Link } from '@/i18n/navigation';

const statusConfig: Record<string, { label: string; class: string }> = {
  forming:      { label: "Forming",      class: "text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  active:       { label: "Active",       class: "bg-green-500/10 text-green-500 border-green-500/20" },
  under_review: { label: "Under Review", class: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  submitted:    { label: "Submitted",    class: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  archived:     { label: "Archived",     class: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
};



export default function CardProject({ project }: { project: Project }) {
  const status = statusConfig[project.status] ?? statusConfig.forming;


  return (

  <Card className="p-0 hover:border-primary/50 transition-all hover:shadow-sm group cursor-pointer ">
    <CardContent className="p-5 pb-6">
<div className="flex items-start justify-between gap-2 mb-2">
  <div className="flex-1">
    <p className="font-medium text-sm capitalize">{project.name}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{project.project_type} Project</p>
  </div>
  <Badge className={`bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize ${status.class}`}>
  <Users className="size-3 "/>
   {status.label}</Badge>  
</div>

<p className="text-xs text-muted-foreground line-clamp-2 mb-3">
  {project.description || "No description provided."}
</p>
<div className="flex flex-wrap gap-1.5 mb-3">
  <Badge className="bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 text-xs">
    {project.methodology=="sprint"&&<Zap className="size-3 mt-.5"/>}
    {project.methodology=="milestone"&&<Flag className="size-3"/>}
    {project.methodology=="kanban"&&<LayoutGrid className="size-3"/>}
  {project.methodology}

  </Badge>
 {project.category && (
  <Badge variant="outline">
    {project.category.name}
  </Badge>
)}
</div>
       {project.technologies?.length > 0 && (
         <div className="flex flex-wrap gap-1">
           {project.technologies.slice(0, 3).map((tech: Technology) => (
             <Badge key={tech.id}  variant="outline" className="text-xs ">
               {tech.name}
             </Badge>
           ))}
           {project.technologies.length > 3 && (
             <Badge variant="outline" className="text-xs">
               +{project.technologies.length - 3}
             </Badge>
           )}
         </div>
       )}
 <Field className="w-full gap-0 mb-2">
                <FieldLabel htmlFor="progress-upload" className="mb-2">
                  <span className="text-sm font-medium">
                    Profile Completion
                  </span>
                  <span className="ml-auto text-sm text-muted-foreground">
                    0%
                  </span>
                </FieldLabel>
                <Progress
                  value={0}
                  id="progress-upload"
                  className="h-2 bg-primary/20 [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none"
                />
              </Field>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="size-3.5"/>
                     <span>{project.memberships.length} / {project.max_members}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600 capitalize">
                    <Star className="size-3.5 fill-amber-500"/>
                   {project?.memberships?.map((member) => member.role)}
                  </div>
                </div>
<Link href={`projects/${project.id}`}>
    <span className="text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      Open
      <ArrowRight className="size-3" />
    </span>
  </Link>
              </div>
    </CardContent>
</Card>
  );
}