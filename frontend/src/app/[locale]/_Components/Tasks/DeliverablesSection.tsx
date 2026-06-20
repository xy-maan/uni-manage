// // DeliverablesSection.tsx
// "use client";
// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import DeliverableFilesSection from "./DeliverableFilesSection";
// import SubmitDeliverableBtn from "../Btns/SubmitDeliverableBtn/SubmitDeliverableBtn";
// import ApproveDeliverableBtn from "../Btns/ApproveDeliverableBtn/ApproveDeliverableBtn";
// import RejectDeliverableBtn from "../Btns/RejectDeliverableBtn/RejectDeliverableBtn";
// import DeleteDeliverableBtn from "../Btns/DeleteDeliverableBtn/DeleteDeliverableBtn";
// import RequestRevisionBtn from "../Btns/RequestRevisionBtn/RequestRevisionBtn";
// import CreateDeliverableBtn from "../Btns/CreateDeliverableBtn/CreateDeliverableBtn";
// import { GetDeliverablesAction } from "@/Actions/Deliverables/getDeliverables.action";
// // import { GetDeliverablesAction } from "@/Actions/Deliverables/GetDeliverables.action";
// // import CreateDeliverableBtn from "../Btns/CreateDeliverableBtn/CreateDeliverableBtn";
// // import SubmitDeliverableBtn from "../Btns/SubmitDeliverableBtn/SubmitDeliverableBtn";
// // import ApproveDeliverableBtn from "../Btns/ApproveDeliverableBtn/ApproveDeliverableBtn";
// // import RejectDeliverableBtn from "../Btns/RejectDeliverableBtn/RejectDeliverableBtn";
// // import RequestRevisionBtn from "../Btns/RequestRevisionBtn/RequestRevisionBtn";
// // import DeleteDeliverableBtn from "../Btns/DeleteDeliverableBtn/DeleteDeliverableBtn";
// // import DeliverableFilesSection from "../DeliverableFilesSection/DeliverableFilesSection";

// const statusConfig: Record<string, { label: string; class: string }> = {
//   draft:          { label: "Draft",          class: "bg-gray-500/20 text-gray-500" },
//   pending:        { label: "Pending Review", class: "bg-amber-500/20 text-amber-500" },
//   approved:       { label: "Approved",       class: "bg-green-500/20 text-green-500" },
//   rejected:       { label: "Rejected",       class: "bg-red-500/20 text-red-500" },
//   needs_revision: { label: "Needs Revision", class: "bg-orange-500/20 text-orange-500" },
// };

// export default function DeliverablesSection({
//   projectId,
//   isMember,
//   isSupervisor,
//   isParticipant,
// }: {
//   projectId: number;
//   isMember: boolean;
//   isSupervisor: boolean;
//   isParticipant: boolean;
// }) {
//   const [deliverables, setDeliverables] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function loadDeliverables() {
//     setLoading(true);
//     const { ok, payload } = await GetDeliverablesAction();
//     if (ok) {
//       setDeliverables(payload.filter((d: any) => d.project === projectId));
//     } else {
//       toast.error("Failed to load deliverables", { position: "top-center", duration: 2000 });
//     }
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadDeliverables();
//   }, [projectId]);

//   if (loading) return <p className="text-sm text-muted-foreground">Loading deliverables...</p>;

//   return (
//     <Card className="p-0 mb-5">
//       <CardHeader className="p-6 pb-3 flex items-center justify-between">
//         <h4 className="text-sm">Deliverables ({deliverables.length})</h4>
//         {isParticipant && (
//           <CreateDeliverableBtn
//             projectId={projectId}
//             onCreated={(newDel) => setDeliverables((prev) => [...prev, newDel])}
//           />
//         )}
//       </CardHeader>
//       <CardContent className="px-6 pb-6 space-y-4">
//         {deliverables.length === 0 && (
//           <p className="text-sm text-muted-foreground">No deliverables yet</p>
//         )}
//         {deliverables.map((d) => {
//           const status = statusConfig[d.status] ?? statusConfig.draft;
//           return (
//             <div key={d.id} className="p-3 rounded-lg border space-y-2">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium">{d.title}</p>
//                 <Badge className={`border-0 text-xs ${status.class}`}>{status.label}</Badge>
//               </div>
//               {d.description && <p className="text-xs text-muted-foreground">{d.description}</p>}
//               {d.due_at && (
//                 <p className="text-xs text-muted-foreground">Due {new Date(d.due_at).toLocaleDateString()}</p>
//               )}
//               {d.review_note && (
//                 <p className="text-xs text-orange-500 italic">Note: {d.review_note}</p>
//               )}

//               <DeliverableFilesSection deliverableId={d.id} isParticipant={isParticipant} />

//               <div className="flex gap-2 pt-2">
//                 {isMember && d.status === "draft" && (
//                   <SubmitDeliverableBtn deliverable_id={d.id} setDeliverables={setDeliverables} />
//                 )}
//                 {isSupervisor && d.status === "pending" && (
//                   <>
//                     <ApproveDeliverableBtn deliverable_id={d.id} setDeliverables={setDeliverables} />
//                     <RejectDeliverableBtn deliverable_id={d.id} setDeliverables={setDeliverables} />
//                     <RequestRevisionBtn deliverable_id={d.id} setDeliverables={setDeliverables} />
//                   </>
//                 )}
//                 {isParticipant && (
//                   <DeleteDeliverableBtn deliverable_id={d.id} title={d.title} setDeliverables={setDeliverables} />
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </CardContent>
//     </Card>
//   );
// }
// DeliverablesSection.tsx
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, Calendar, Upload, Paperclip, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GetDeliverablesAction } from "@/Actions/Deliverables/getDeliverables.action";
import CreateDeliverableBtn from "../Btns/DeliverablesBtns/CreateDeliverableBtn/CreateDeliverableBtn";
import Loading from "../CommunityComponent/Loading";
import UploadDeliverableFileBtn from "../Btns/UploadDeliverableFileBtn/UploadDeliverableFileBtn";
import SubmitDeliverableBtn from "../Btns/DeliverablesBtns/SubmitDeliverableBtn/SubmitDeliverableBtn";
import ApproveDeliverableBtn from "../Btns/DeliverablesBtns/ApproveDeliverableBtn/ApproveDeliverableBtn";
import RejectDeliverableBtn from "../Btns/DeliverablesBtns/RejectDeliverableBtn/RejectDeliverableBtn";
import RequestRevisionBtn from "../Btns/RequestRevisionBtn/RequestRevisionBtn";


const statusConfig: Record<string, { label: string; class: string }> = {
  draft:          { label: "Draft",          class: "bg-muted text-muted-foreground" },
  pending:        { label: "Pending Review", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  approved:       { label: "Approved",       class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  rejected:       { label: "Rejected",       class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  needs_revision: { label: "Needs Revision", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

const noteConfig: Record<string, string> = {
  approved:       "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  needs_revision: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  rejected:       "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DeliverablesSection({
  projectId,
  isMember,
  isSupervisor,
  isParticipant,
}: {
  projectId: number;
  isMember: boolean;
  isSupervisor: boolean;
  isParticipant: boolean;
}) {
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDeliverables() {
    setLoading(true);
    try {
      const { ok, payload } = await GetDeliverablesAction();
      if (ok) {
        setDeliverables(payload.filter((d: any) => d.project === projectId));
      } else {
        toast.error("Failed to load deliverables", { position: "top-center", duration: 2000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong loading deliverables", { position: "top-center", duration: 2000 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDeliverables();
  }, [projectId]);

  if (loading) return <Loading />;

  const approvedCount = deliverables.filter((d) => d.status === "approved").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {deliverables.length} deliverables · {approvedCount} approved
        </p>
        {isParticipant && (
          <CreateDeliverableBtn
            projectId={projectId}
            onCreated={(newDel) => setDeliverables((prev) => [...prev, newDel])}
          />
        )}
      </div>

      {deliverables.length === 0 && (
        <p className="text-sm text-muted-foreground">No deliverables yet</p>
      )}

      <div className="space-y-3">
        {deliverables.map((d) => {
          const status = statusConfig[d.status] ?? statusConfig.draft;
          const hasReviewNote = d.review_note && ["approved", "rejected", "needs_revision"].includes(d.status);

          return (
            <Card key={d.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm">{d.title}</p>
                      <Badge className={`text-xs shrink-0 border-0 ${status.class}`}>{status.label}</Badge>
                    </div>

                    {d.description && (
                      <p className="text-xs text-muted-foreground mb-2">{d.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                      {d.due_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due {formatDate(d.due_at)}
                        </span>
                      )}
                      {d.submitted_at && (
                        <span className="flex items-center gap-1">
                          <Upload className="h-3 w-3" />
                          Submitted {formatDate(d.submitted_at)}
                        </span>
                      )}
                      {d.files?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          {d.files.length} file{d.files.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {hasReviewNote && (
                      <div className={`text-xs p-2 rounded-md mb-2 ${noteConfig[d.status]}`}>
                        <p className="font-medium mb-0.5">{d.reviewed_by_detail?.full_name ?? "Supervisor"} wrote:</p>
                        <p>{d.review_note}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {d.files?.length > 0 && (
                        <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                          <a href={d.files[0].file} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-1 h-3 w-3" />
                            Download
                          </a>
                        </Button>
                      )}

                      {isParticipant && (d.status === "draft" || d.status === "needs_revision") && (
                        <UploadDeliverableFileBtn
                          deliverableId={d.id}
                          onUploaded={(newFile) =>
                            setDeliverables((prev) =>
                              prev.map((x) => (x.id === d.id ? { ...x, files: [...x.files, newFile] } : x))
                            )
                          }
                        />
                      )}

                      {isMember && d.status === "draft" && (
                        <SubmitDeliverableBtn deliverable_id={d.id} setDeliverables={setDeliverables} />
                      )}

                      {isMember && d.status === "needs_revision" && (
                        <SubmitDeliverableBtn deliverable_id={d.id} setDeliverables={setDeliverables} label="Resubmit" />
                      )}

                      {isSupervisor && d.status === "pending" && (
                        <>
                          <ApproveDeliverableBtn deliverable_id={d.id} setDeliverables={setDeliverables} />
                          <RejectDeliverableBtn deliverable_id={d.id} setDeliverables={setDeliverables} />
                          <RequestRevisionBtn deliverable_id={d.id} setDeliverables={setDeliverables} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}