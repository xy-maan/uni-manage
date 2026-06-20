// Btns/CreateSupervisorRecordBtn/CreateSupervisorRecordBtn.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";
import { CreateSupervisorAction } from "@/Actions/supervisor/supervisorRequests/createSupervisor.action";

export default function CreateSupervisorRecordBtn({
  projectId,
  supervisorId,
  role,
  setSupervisors,
}: {
  projectId: number;
  supervisorId: number;
  role: "primary" | "secondary";
  setSupervisors: (supervisors: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    const { payload, ok } = await CreateSupervisorAction({
      project: projectId,
      supervisor: supervisorId,
      role,
    });
    setLoading(false);

    if (ok) {
      setSupervisors((prev: any) => [...prev, payload]);
      toast.success("Supervisor added successfully", { position: "top-center", duration: 2000 });
    } else {
      const firstValue = Object.values(payload || {})?.[0];
      const message =
        typeof payload === "object" && payload && "detail" in payload
          ? (payload as any).detail
          : Array.isArray(firstValue)
            ? firstValue[0]
            : "Error occurred";
      toast.error(message);
    }
  }

  return (
    <Button size="sm" className="gap-1.5" onClick={handleCreate} disabled={loading}>
      <UserCheck className="size-3.5" />
      {loading ? "Adding..." : "Confirm"}
    </Button>
  );
}