// DeliverableFilesSection.tsx
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import UploadDeliverableFileBtn from "../Btns/UploadDeliverableFileBtn/UploadDeliverableFileBtn";
import DeleteDeliverableFileBtn from "../Btns/DeliverablesBtns/DeleteDeliverableFileBtn/DeleteDeliverableFileBtn";
import { GetDeliverableFilesAction } from "@/Actions/Deliverables/getDeliverableFile.action";

export default function DeliverableFilesSection({
  deliverableId,
  isParticipant,
}: {
  deliverableId: number;
  isParticipant: boolean;
}) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFiles() {
    setLoading(true);
    const { ok, payload } = await GetDeliverableFilesAction();
    if (ok) {
      setFiles(payload.filter((f: any) => f.deliverable === deliverableId));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadFiles();
  }, [deliverableId]);

  if (loading) return null;

  return (
    <div className="space-y-1.5">
      {files.map((f) => (
        <div key={f.id} className="flex items-center gap-2 text-xs">
          <a href={f.file} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
            {f.file.split("/").pop()}
          </a>
          {isParticipant && (
            <DeleteDeliverableFileBtn file_id={f.id} setFiles={setFiles} />
          )}
        </div>
      ))}
      {isParticipant && (
        <UploadDeliverableFileBtn
          deliverableId={deliverableId}
          onUploaded={(newFile) => setFiles((prev) => [...prev, newFile])}
        />
      )}
    </div>
  );
}