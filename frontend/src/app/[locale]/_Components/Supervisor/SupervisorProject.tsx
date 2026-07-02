"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ProjectSupervisor, SupervisorRequest } from "@/types/supervisor";
import { GetAllSupervisorRequestsAction } from "@/Actions/supervisor/supervisorRequests/getAllSupervisorRequests.action";
import RequestSupervisorBtn from "../Btns/RequestSupervisorBtn/RequestSupervisorBtn";
import { GetAllSupervisorsAction } from "@/Actions/supervisor/getAllSupervisors.action";
import CreateSupervisorRecordBtn from "../Btns/CreateSupervisorRecordBtn/CreateSupervisorRecordBtn";
import EditSupervisorBtn from "../Btns/EditSupervisorBtnv/EditSupervisorBtn";
import EditSupervisorRequestBtn from "../Btns/EditSupervisorRequestBtn/EditSupervisorRequestBtn";
import DeleteSupervisorRequestBtn from "../Btns/DeleteSupervisorRequestBtn/DeleteSupervisorRequestBtn";
import AcceptSupervisorRequestBtn from "../Btns/AcceptSupervisorRequestBtn/AcceptSupervisorRequestBtn";
import RejectSupervisorRequestBtn from "../Btns/RejectSupervisorRequestBtn/RejectSupervisorRequestBtn";
import RequestModificationBtn from "../Btns/RequestModificationBtn/RequestModificationBtn";
import { useSession } from "next-auth/react";
import Loading from "../CommunityComponent/Loading";
import CurrentSupervisorsSection from "../Projects/CurrentSupervisorsSection";
import DeleteSupervisorBtn from "../Btns/DeleteSupervisorBtn/DeleteSupervisorBtn";
import { Mail } from "lucide-react";

const statusConfig: Record<string, { label: string; class: string }> = {
  pending:            { label: "Pending",            class: "bg-amber-500/20 text-amber-500" },
  accepted:           { label: "Accepted",           class: "bg-green-500/20 text-green-500" },
  rejected:           { label: "Rejected",           class: "bg-red-500/20 text-red-500" },
  needs_modification: { label: "Needs Modification", class: "bg-orange-500/20 text-orange-500" },
};

export default function SupervisorProject({
  projectId,
  project,
  role
}: {
  projectId: number;
  project: any;
  role:string
}) {
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email;
  const [requests, setRequests] = useState<SupervisorRequest[]>([]);
  const [supervisors, setSupervisors] = useState<ProjectSupervisor[]>([]);
  const [loading, setLoading] = useState(true);

  const myMembership = project.memberships.find(
    (m: any) => m.user_detail?.email === currentUserEmail
  );
  const isLeader = myMembership?.role === "leader";

  async function handleGetAllRequests() {
    setLoading(true);
    const { ok, payload } = await GetAllSupervisorRequestsAction();
    if (ok) {
      setRequests(payload.filter((r: SupervisorRequest) => r.project === projectId));
    } else {
      toast.error("Failed to load supervisor requests", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  async function handleGetSupervisor() {
    setLoading(true);
    const { ok, payload } = await GetAllSupervisorsAction();
    if (ok) {
      setSupervisors(payload.filter((s: ProjectSupervisor) => s.project === projectId));
    } else {
      toast.error("Failed to load supervisors", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  useEffect(() => {
    handleGetAllRequests();
    handleGetSupervisor();
  }, [projectId]);

  if (loading) return <Loading />;

  const pendingConfirmation = requests.filter(
    (req) =>
      req.status === "approved" &&
      !supervisors.some((s) => s.supervisor === req.supervisor && s.role === req.role)
  );
  const acceptedRequests = requests.filter((r) => r.status === "approved");

  const myPendingRequests = requests.filter(
    (req: any) =>
      req.supervisor_detail?.email === currentUserEmail &&
      req.status === "pending"
  );

  return (
    <div className="space-y-5">

{role=="student" &&

<>
      {myPendingRequests.length > 0 && (
        <Card className="p-0 border-amber-300 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-900/10">
          <CardHeader className="p-6 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-amber-600" />
              <h3 className="text-sm">You have {myPendingRequests.length} pending supervision request(s)</h3>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-3">
            {myPendingRequests.map((req: any) => (
              <Card key={req.id} className="p-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{project.name}</p>
                      <Badge variant="outline" className="text-xs capitalize mt-1">
                        {req.role} Supervisor Request
                      </Badge>
                      {req.message && (
                        <p className="text-xs text-muted-foreground italic mt-2">"{req.message}"</p>
                      )}
                      {req.proposal && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <span className="font-medium">Proposal:</span> {req.proposal}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                    <AcceptSupervisorRequestBtn request_id={req.id} setRequests={setRequests} />
                    <RejectSupervisorRequestBtn request_id={req.id} setRequests={setRequests} />
                    <RequestModificationBtn request_id={req.id} setRequests={setRequests} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
</>
    }
      <CurrentSupervisorsSection
        projectId={projectId}
        isLeader={isLeader}
        acceptedRequests={acceptedRequests}
        role={role}
      />
{role=="student"&&


      <Card className="p-0">
        <CardHeader className="p-6 pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm">Assigned Supervisors ({supervisors.length})</h3>
            {isLeader && (
              <div className="flex gap-2">
                <RequestSupervisorBtn
                  projectId={projectId}
                  role="primary"
                  onRequested={(newReq) => setRequests((prev) => [...prev, newReq])}
                />
                <RequestSupervisorBtn
                  projectId={projectId}
                  role="secondary"
                  onRequested={(newReq) => setRequests((prev) => [...prev, newReq])}
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-3">
          {isLeader && pendingConfirmation.length > 0 && (
            <div className="space-y-2 pb-3 border-b border-border">
              <p className="text-xs text-muted-foreground">Awaiting confirmation:</p>
              {pendingConfirmation.map((req: any) => (
                <div key={req.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{req.supervisor_detail?.full_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{req.role}</p>
                  </div>
                  <CreateSupervisorRecordBtn
                    projectId={projectId}
                    supervisorId={req.supervisor}
                    role={req.role}
                    setSupervisors={setSupervisors}
                  />
                </div>
              ))}
            </div>
          )}

          {supervisors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No supervisors assigned yet</p>
          ) : (
            supervisors.map((sup) => (
              <Card key={sup.id} className="p-0">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 relative flex overflow-hidden rounded-full shrink-0">
                      <div className="flex size-full items-center justify-center rounded-full text-xs bg-primary/10 text-primary">
                        {sup.supervisor_detail?.full_name?.[0]?.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{sup.supervisor_detail?.full_name}</p>
                        <Badge variant="outline" className="text-xs capitalize">{sup.role}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{sup.supervisor_detail?.email}</p>
                    </div>
                    {isLeader && (
                      <div className="flex items-center gap-1 shrink-0">
                        <EditSupervisorBtn
                          supervisor_id={sup.id}
                          currentRole={sup.role}
                          setSupervisors={setSupervisors}
                        />
                        <DeleteSupervisorBtn
                          supervisor_id={sup.id}
                          name={sup.supervisor_detail?.full_name}
                          setSupervisors={setSupervisors}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
}

{role=="student"&&

      <Card className="p-0">
        <CardHeader className="p-6 pb-3">
          <h3 className="text-sm">Supervisor Requests ({requests.length})</h3>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-3">
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No supervisor requests yet</p>
          ) : (
            requests.map((req: any) => {
              const status = statusConfig[req.status] ?? statusConfig.pending;
              const isRequestedSupervisor = req.supervisor_detail.email === currentUserEmail;

              return (
                <Card key={req.id} className="p-0">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="size-9 relative flex overflow-hidden rounded-full shrink-0">
                        <div className="bg-muted flex size-full items-center justify-center rounded-full text-xs">
                          {req.supervisor_detail?.full_name?.[0]?.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{req.supervisor_detail?.full_name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {req.role} Supervisor Request · {new Date(req.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`border-0 text-xs ${status.class}`}>{status.label}</Badge>
                        </div>

                        {req.message && (
                          <p className="text-xs text-muted-foreground mt-1.5 italic">"{req.message}"</p>
                        )}

                        {req.modification_note && (
                          <p className="text-xs text-orange-500 mt-1">Note: {req.modification_note}</p>
                        )}
                      </div>
                    </div>

                    {isLeader && req.status === "pending" && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                        <EditSupervisorRequestBtn
                          request_id={req.id}
                          currentMessage={req.message}
                          setRequests={setRequests}
                        />
                        <DeleteSupervisorRequestBtn
                          request_id={req.id}
                          name={req.supervisor_detail?.full_name}
                          setRequests={setRequests}
                        />
                      </div>
                    )}

                    {isRequestedSupervisor && req.status === "pending" && (
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                        <AcceptSupervisorRequestBtn request_id={req.id} setRequests={setRequests} />
                        <RejectSupervisorRequestBtn request_id={req.id} setRequests={setRequests} />
                        <RequestModificationBtn request_id={req.id} setRequests={setRequests} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>

}
    </div>
  );
}