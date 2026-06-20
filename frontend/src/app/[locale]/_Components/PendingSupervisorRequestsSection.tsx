// app/[locale]/_Components/DashboardComponents/SupervisorDashboard/PendingSupervisorRequestsSection.tsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { SupervisorRequest } from "@/types/supervisor";
import AcceptSupervisorRequestBtn from "./Btns/AcceptSupervisorRequestBtn/AcceptSupervisorRequestBtn";
import RejectSupervisorRequestBtn from "./Btns/RejectSupervisorRequestBtn/RejectSupervisorRequestBtn";
import RequestModificationBtn from "./Btns/RequestModificationBtn/RequestModificationBtn";

export default function PendingSupervisorRequestsSection({
  initialRequests,
}: {
  initialRequests: SupervisorRequest[];
}) {
  const [requests, setRequests] = useState<SupervisorRequest[]>(initialRequests);

  const pending = requests.filter((r) => r.status === "pending");

  if (pending.length === 0) return null;

  return (
    <Card className="p-0 mb-6">
      <CardHeader className="p-6 pb-3">
        <h3 className="text-sm">Pending Supervision Requests ({pending.length})</h3>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-3">
        {pending.map((req: any) => (
          <Card key={req.id} className="p-0">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {req.project_detail?.name ?? `Project #${req.project}`}
                  </p>
                  <Badge variant="outline" className="text-xs capitalize mt-1">
                    {req.role} Supervisor Request
                  </Badge>
                  {req.message && (
                    <p className="text-xs text-muted-foreground italic mt-2">
                      "{req.message}"
                    </p>
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
  );
}