"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, UserPlus } from "lucide-react";
import RequestJoinBtn from "../Btns/RequestJoinBtn/RequestJoinBtn";
import InviteTeamBtn from "../Btns/InvitiationsBtn/InviteTeamBtn/InviteTeamBtn";
import { Project, Technology } from "@/types/team";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { GetJoinRequestsAction } from "@/Actions/joinRequests/getJoinRequests.action";
import { JoinRequest } from "@/types/JoinRequests";
import { toast } from "sonner";
export default function FindTeamCard({ project: initialProject, student,currentProjectId }:any) {
  const isTeamCard = !!initialProject;
  const isStudentCard = !!student;
  const [project, setProject] = useState(initialProject);
  console.log(project)
  const [requestsJoin, setRequestsJoin] = useState<JoinRequest[]>([]);
    const [loading, setLoading] = useState(true);
   async function getAllRequestsJoin() {
    setLoading(true);
    try {
      const { ok, payload } = await GetJoinRequestsAction();
      if (ok) {
        setRequestsJoin(payload);
      } else {
        toast.error("Failed to load join requests", { position: "top-center", duration: 2000 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllRequestsJoin();
  }, []);
  return (
     <>
     
        {isTeamCard && project && 
<Card className="p-0 border-2 hover:border-primary/50 transition-all gap-4">
        <CardHeader className="p-6 pb-0 gap-1">
<div className="flex items-center justify-between">
            <h4 className="capitalize font-medium">{project.name}</h4>
          <Badge variant="outline" className="capitalize">
            {project.project_type}
          </Badge>
</div>
          <p className="text-sm text-muted-foreground">
            {project.abstract || "No abstract provided"}
          </p>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-3">

          {project.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 3).map((tech: Technology) => (
                <Badge
                  key={tech.id}
                  variant="outline"
                  className="text-xs bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90"
                >
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

          <div className="text-xs text-muted-foreground">
            Members: {project.memberships?.length || 0} / {project.max_members}
          </div>

          {!loading && (
            <RequestJoinBtn
              projectId={project.id}
              leaderEmail={project.creator_detail.email}
              existingRequests={requestsJoin}
              onRequest={(newRequest) => {
                setRequestsJoin((prev) => [...prev, newRequest]);
              }}
            />
          )}
        </CardContent>
      </Card>   
        }
{isStudentCard && student && (
  <Card className="border-2 hover:border-primary/50 transition-all p-0">
    <CardContent className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex h-14 w-14 shrink-0 rounded-full overflow-hidden">
          <span className="bg-muted flex size-full items-center justify-center rounded-full text-lg font-medium capitalize">
            {student.username?.charAt(0)}
          </span>
        </div>

        <div>
          <h3 className="font-semibold">
            {student.username}
          </h3>

          <p className="text-sm text-muted-foreground">
            {student.department?.name}
          </p>

          <p className="text-xs text-muted-foreground">
            GPA: {student.gpa}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {student.description || "No bio provided"}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {student.tags?.slice(0, 4).map((tag: any) => (
          <Badge key={tag.id} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>

      {currentProjectId && (
       <div className="w-full">

         <InviteTeamBtn
          className="w-full"
          projectId={currentProjectId}
          onInvited={(newMember) => {
            setProject((prev: any) => ({
              ...prev,
              memberships: [...prev.memberships, newMember],
            }));
          }}
        />
       </div>
      )}
    </CardContent>
  </Card>
)}
     </>
  );
}