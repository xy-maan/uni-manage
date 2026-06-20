// CurrentSupervisorsSection.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import DeleteSupervisorBtn from "../Btns/DeleteSupervisorBtn/DeleteSupervisorBtn";
import CreateSupervisorRecordBtn from "../Btns/CreateSupervisorRecordBtn/CreateSupervisorRecordBtn";
import { GetAllSupervisorsAction } from "@/Actions/supervisor/getAllSupervisors.action";
import EditSupervisorBtn from "../Btns/EditSupervisorBtnv/EditSupervisorBtn";
import Loading from "../CommunityComponent/Loading";

export default function CurrentSupervisorsSection({
  projectId,
  isLeader,
  acceptedRequests,
}: {
  projectId: number;
  isLeader: boolean;
  acceptedRequests: any[]; // الـ requests اللي status === "accepted" عشان تعرض زرار الـ create
}) {
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSupervisors() {
    setLoading(true);
    const { ok, payload } = await GetAllSupervisorsAction();
    if (ok) {
      setSupervisors(payload.filter((s: any) => s.project === projectId));
    } else {
      toast.error("Failed to load supervisors", { position: "top-center", duration: 2000 });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadSupervisors();
  }, [projectId]);

  if (loading) return <Loading />;

  // ✅ الـ accepted requests اللي مش عندها supervisor record لسه
  const pendingConfirmation = acceptedRequests.filter(
    (req) => !supervisors.some((s) => s.supervisor === req.supervisor && s.role === req.role)
  );

  return (
    <Card className="p-0 mb-5">
      <CardHeader className="p-6 pb-3">
        <h4 className="text-sm">Supervisors ({supervisors.length})</h4>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-3">

        {isLeader && pendingConfirmation.length > 0 && (
          <div className="space-y-2 pb-3 border-b border-border">
            <p className="text-xs text-muted-foreground">Awaiting confirmation:</p>
            {pendingConfirmation.map((req) => (
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

        {supervisors.length === 0 && (
          <p className="text-sm text-muted-foreground">No supervisors assigned yet</p>
        )}

        {supervisors.map((sup) => (
          <div key={sup.id} className="flex items-center gap-3 p-2.5 rounded-lg border">
            <div className="relative flex overflow-hidden rounded-full size-9 shrink-0">
              <span className="flex size-full items-center justify-center rounded-full text-xs bg-primary/10 text-primary">
                {sup.supervisor_detail?.full_name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{sup.supervisor_detail?.full_name}</p>
              <p className="text-xs text-muted-foreground">{sup.supervisor_detail?.email}</p>
            </div>
            <Badge className="capitalize text-xs">{sup.role}</Badge>
            {isLeader && (
              <div className="flex items-center gap-1">
                <EditSupervisorBtn supervisor_id={sup.id} currentRole={sup.role} setSupervisors={setSupervisors} />
                <DeleteSupervisorBtn supervisor_id={sup.id} name={sup.supervisor_detail?.full_name} setSupervisors={setSupervisors} />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}