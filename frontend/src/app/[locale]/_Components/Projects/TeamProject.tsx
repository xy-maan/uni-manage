"use client"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import InviteTeamBtn from '../Btns/InvitiationsBtn/InviteTeamBtn/InviteTeamBtn'
import { Membership, Memberships, Project, Technology } from '@/types/team'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Mail, X ,Trash2, Pen} from 'lucide-react';
import { RemoveMemberAction } from '@/Actions/Memberships/RemoveMember.action'
import { toast } from 'sonner'
import { ReplaceMembershipAction } from '@/Actions/Memberships/ReplaceMembership.action'
import { GetMembershipsAction } from '@/Actions/Memberships/GetAllMembership.action'
import ReplaceMembershipBtn from '../Btns/ReplaceMembershipBtn/ReplaceMembershipBtn'
import DeleteMembershipBtn from '../Btns/DeleteMemberBtn/DeleteMemberBtn'
import { GetInvitationsAction } from '@/Actions/invitations/getInvitations.action'
import { Invitation } from '@/types/invitations'
import DeleteInvitationBtn from '../Btns/InvitiationsBtn/DeleteInvitationBtn/DeleteInvitationBtn'
import EditInvitationBtn from '../Btns/InvitiationsBtn/EditInvitationBtn/EditInvitationBtn'
import { GetJoinRequestsAction } from '@/Actions/joinRequests/getJoinRequests.action'
import { JoinRequest } from '@/types/JoinRequests'
import AcceptJoinRequestBtn from '../Btns/AcceptJoinRequestBtn/AcceptJoinRequestBtn'
import RejectJoinRequestBtn from '../Btns/RejectJoinRequestBtn/RejectJoinRequestBtn'
import { useSession } from "next-auth/react";

export default function TeamProject({project:initialProject,role}:{project:Project,role:string}) {
  const [project, setProject] = useState(initialProject);
  // (project);
    const [members, setMembers] = useState<Memberships[]>(initialProject.memberships);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [requestsJoin, setRequestsJoin] = useState<JoinRequest[]>([]);
  const { data: session } = useSession();
    const currentUserEmail = session?.user?.email;

  const myMembership = project.memberships.find(
    (m: any) => m.user_detail?.email === currentUserEmail
  );

  const isLeader = myMembership?.role === "leader";

 function formatDueDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
 async function getAllInvitations(){
  const {payload,ok}=await GetInvitationsAction()
  if (ok) {
    setInvitations(payload);
  }
}
async function getAllRequestsJoin(){
  const {payload,ok}=await GetJoinRequestsAction()
  if (ok) {
    setRequestsJoin(payload);
  }
}
       useEffect(() => {
    getAllInvitations();
    getAllRequestsJoin()
  }, []);
  return (
    <div className="">

      <Card className="p-0 mb-5">
  <CardHeader className='p-6 pb-3 flex items-center justify-between '>
    <h4 className="text-sm">( {project.memberships.length}/{project.max_members} members )</h4>
    {role=="student" && isLeader&&
    <InviteTeamBtn
    className="w-fit"
    projectId={project.id}
  onInvited={(newInvitation) => {
    setInvitations((prev) => [...prev, newInvitation]); 
  }}/>
    }
  </CardHeader>
    <CardContent className="px-6 pb-6">
{members.map((member:Memberships)=>
<div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/30 transition-colors mb-2" key={member.id}>
<div className="relative flex overflow-hidden rounded-full size-9 shrink-0">
<span className="flex size-full items-center justify-center rounded-full text-xs bg-primary/10 text-primary">
mh
</span>
</div>
<div className="flex-1">
  <div className="flex items-center gap-2">
    <p className="text-sm font-medium">{member?.user_detail?.full_name}</p>
    <Badge className={`capitalize py-0 ${isLeader?" bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400":" bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90"}`}>
{member?.role}
    </Badge>

  </div>
  <p className="text-xs text-muted-foreground">{member?.user_detail?.email} . Joined  {formatDueDate(member?.joined_at)}</p>
   {project.technologies?.length > 0 && (
         <div className="flex flex-wrap gap-1 mt-1">
           {project?.technologies.slice(0, 3).map((tech: Technology) => (
             <Badge key={tech.id}  variant="outline" className="text-xs ">
               {tech.name}
             </Badge>
           ))}
           {project?.technologies.length > 3 && (
             <Badge variant="outline" className="text-xs">
               +{project?.technologies.length - 3}
             </Badge>
           )}
         </div>
       )}
</div>

    {role=="student" && isLeader && member.role !== "leader" && (
      <div className="flex items-center gap-1.5">
<DeleteMembershipBtn membership_id={member.id}  name={member.user_detail.full_name??""} setMembers={setMembers}/>

        <ReplaceMembershipBtn
          membershipId={member.id}
          membershipRole={member.role}
          project={member.project}
          name={member.user_detail.full_name??""}
          setMembers={setMembers}
        />
      </div>
    )} 
  </div>
)}
    </CardContent>
</Card>
{/* invitations */}
{role=="student" &&


<Card className="p-0 mb-5">
  <CardHeader className="p-6 pb-3">
    <h4 className="text-sm">
      Sent Invitations ({invitations.length})
    </h4>
  </CardHeader>

  <CardContent className="px-6 pb-6">
    {invitations.length === 0 ? (
      <p className="text-sm text-muted-foreground">
        No invitations found
      </p>
    ) : (
      invitations.map((invitation:Invitation) => (
        <div
          key={invitation.id}
          className="flex items-center gap-3 p-3 rounded-lg border mb-3"
        >
          <Mail className="size-4 text-muted-foreground shrink-0" />

          <div className="flex-1">
            <p className="text-sm font-medium">
              {invitation.invitee_detail.email}
            </p>

            <p className="text-xs text-muted-foreground">
              {invitation.invitee_detail.full_name}
            </p>
          </div>

          {/* Pending */}
          {invitation.status === "pending" && isLeader && (
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-500 border-0">
                Pending
              </Badge>

                <EditInvitationBtn
      invitation_id={invitation.id}
      currentMessage={invitation.message}
      setInvitations={setInvitations}
    />


                <DeleteInvitationBtn     invitation_id={invitation.id}
  name={invitation.invitee_detail.full_name}
  setInvitations={setInvitations}/>
              
            </div>
          )}

          {/* Accepted */}
          {invitation.status === "accepted" && (
            <Badge className="bg-green-500/20 text-green-500 border-0">
              Accepted
            </Badge>
          )}

          {/* Rejected */}
          {invitation.status === "rejected" && (
            <Badge variant="destructive">
              Rejected
            </Badge>
          )}
        </div>
      ))
    )}
  </CardContent>
</Card>
}
{role=="student" && 

<Card className="p-0">
  <CardHeader className="p-6 pb-3">
    <h4 className="text-sm">
      Join Requests ({requestsJoin.length})
    </h4>
  </CardHeader>

  <CardContent className="px-6 pb-6">
    {requestsJoin.length === 0 ? (
      <p className="text-sm text-muted-foreground">
        No join requests found
      </p>
    ) : (
      requestsJoin.map((request) => (
        <div
          key={request.id}
          className="p-3 rounded-lg border mb-3"
        >
          <div className="flex items-start gap-3">
            <div className="relative flex overflow-hidden rounded-full size-9 shrink-0">
              <span className="bg-muted flex size-full items-center justify-center rounded-full text-xs">
                {request.user_detail.full_name
                  ?.split(" ")
                  .map((n:string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {request.user_detail.full_name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {new Date(
                    request.created_at
                  ).toLocaleDateString()}
                </p>
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                {request.user_detail.email}
              </p>

              <p className="text-xs text-muted-foreground italic mt-2">
                "{request.message}"
              </p>
            </div>
          </div>

          {request.status === "pending" && isLeader && (
            <div className="grid lg:grid-cols-2 gap-2 mt-3">
             <AcceptJoinRequestBtn
  join_request_id={request.id}
  setJoinRequests={setRequestsJoin}
  setMembers={setMembers}
/>

<RejectJoinRequestBtn
  join_request_id={request.id}
  setJoinRequests={setRequestsJoin}
/>
            </div>
          )}

          {request.status === "accepted" && (
            <Badge className="mt-3 bg-green-500/20 text-green-600">
              Accepted
            </Badge>
          )}

          {request.status === "rejected" && (
            <Badge
              variant="destructive"
              className="mt-3"
            >
              Rejected
            </Badge>
          )}
        </div>
      ))
    )}
  </CardContent>
</Card>
}
    </div>
  )
}
