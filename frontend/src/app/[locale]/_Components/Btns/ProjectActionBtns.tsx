// {isLeader&&
//   <div className="flex flex-wrap gap-2 shrink-0">

//     <Button>
//         <ChevronRight className="size-3.5"/>
//          Submit for Review
//     </Button>
//      <Button variant={'outline'}>
//         <Archive className="size-3.5"/>
//          Archive
//     </Button>
    
// <EditBtn id={project.id}/>
//      <Button  variant={'outline'} className='text-destructive hover:text-destructive'>
//         <Trash2 className="size-3.5"/>
//           Delete
//     </Button>
//      <Button  variant={'outline'}>
//         <CircleCheck className="size-3.5 text-success"/>
//         Approve 
//     </Button>
//        <Button  variant={'outline'}>
//         <Check className="size-3.5 text-success"/>
//         Activate 
//     </Button>
//   </div>
  
  
//   }
// Btns.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, Archive, Trash2, CircleCheck, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { activateProjectAction } from "@/Actions/Project/activateProject.action";
import { submitProjectAction } from "@/Actions/Project/submitProject.action";
import { approveProjectAction } from "@/Actions/Project/approveProject.action";
import { archiveProjectAction } from "@/Actions/Project/archiveProject.action";
import { DeleteProjectAction } from "@/Actions/Project/deleteProject.action";
import EditBtn from "./EditBtn/EditBtn";

type ConfirmAction = "activate" | "submit" | "approve" | "archive" | "delete" | null;

const ACTION_CONFIG: Record<
  Exclude<ConfirmAction, null>,
  {
    label: string;
    description: string;
    variant?: "destructive";
  }
> =  {
  activate: { label: "Activate",          description: "Are you sure you want to activate this project?" },
  submit:   { label: "Submit for Review", description: "Are you sure you want to submit this project for review?" },
  approve:  { label: "Approve",           description: "Are you sure you want to approve this submission?" },
  archive:  { label: "Archive",           description: "Are you sure you want to archive this project?" },
  delete:   { label: "Delete",            description: "Are you sure you want to delete this project? This action cannot be undone.", variant: "destructive" },
};


export default function ProjectActionBtns({
  projectId,
  project,
  onProjectChange,
  isLeader,
  isSupervisor,
}: {
  projectId: number;
  project: any;
  isLeader: boolean;
  isSupervisor: boolean;
  onProjectChange?: (updated: any) => void;
}) {
  console.log("project status:", project.status);
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<ConfirmAction>(null);
  const [loading, setLoading] = useState(false);

  const canActivate = isLeader && project.status === "forming";
  const canSubmit = isLeader && project.status === "active";
  const canArchive = isLeader && project.status === "submitted";
  const canApprove = (isLeader || isSupervisor) && project.status === "under_review";

  async function handleConfirm() {
    if (!pendingAction) return;
    setLoading(true);

    const actions: Record<Exclude<ConfirmAction, null>, () => Promise<{ ok: boolean; payload: any }>> = {
      activate: () => activateProjectAction(projectId),
      submit:   () => submitProjectAction(projectId),
      approve:  () => approveProjectAction(projectId),
      archive:  () => archiveProjectAction(projectId),
      delete:   () => DeleteProjectAction(projectId),
    };

    const { ok, payload } = await actions[pendingAction]();

    if (ok) {
      toast.success(`${ACTION_CONFIG[pendingAction].label} successful`, { position: "top-center", duration: 2000 });
      if (pendingAction === "delete") {
        router.push("/student/projects");
      } else {
        onProjectChange?.({ status: payload?.status ?? pendingAction });
      }
    } else {
      const message = payload?.detail ?? Object.values(payload || {})?.[0] ?? "Something went wrong";
      toast.error(String(message), { position: "top-center", duration: 3000 });
    }

    setLoading(false);
    setPendingAction(null);
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 shrink-0">

        {canSubmit && (
          <Button onClick={() => setPendingAction("submit")}>
            <ChevronRight className="size-3.5" />
            Submit for Review
          </Button>
        )}

        {isLeader && (
          <>
            {canArchive && (
              <Button variant="outline" onClick={() => setPendingAction("archive")}>
                <Archive className="size-3.5" />
                Archive
              </Button>
            )}

            <EditBtn
              id={projectId}
              project={project}
              onEdited={(payload) => onProjectChange?.(payload)}
            />

            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setPendingAction("delete")}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </>
        )}

        {/* ✅ leader أو supervisor — approve */}
        {canApprove && (
          <Button variant="outline" onClick={() => setPendingAction("approve")}>
            <CircleCheck className="size-3.5 text-success" />
            Approve
          </Button>
        )}

        {/* ✅ leader فقط — activate */}
        {canActivate && (
          <Button variant="outline" onClick={() => setPendingAction("activate")}>
            <Check className="size-3.5 text-success" />
            Activate
          </Button>
        )}
      </div>

      <Dialog open={!!pendingAction} onOpenChange={(o) => !o && setPendingAction(null)}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader>
            <DialogTitle>{pendingAction ? ACTION_CONFIG[pendingAction].label : ""}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {pendingAction ? ACTION_CONFIG[pendingAction].description : ""}
          </p>
          <DialogFooter className="mt-3">
            <Button variant="outline" onClick={() => setPendingAction(null)}>Cancel</Button>
            <Button
              variant={pendingAction ? ACTION_CONFIG[pendingAction].variant ?? "default" : "default"}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Loading..." : pendingAction ? ACTION_CONFIG[pendingAction].label : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}