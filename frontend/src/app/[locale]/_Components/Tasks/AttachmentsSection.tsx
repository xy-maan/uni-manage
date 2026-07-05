"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import { GetAttachmentsAction } from "@/Actions/Tasks/attachments/getAllAttachments.action";
import { UploadAttachmentAction } from "@/Actions/Tasks/attachments/uploadAttachment.action";
import { DeleteAttachmentAction } from "@/Actions/Tasks/attachments/deleteAttachment.action";

export default function AttachmentsSection({
  taskId,
  isParticipant,
}: {
  taskId: number;
  isParticipant: boolean;
}) {
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadAttachments() {
    setLoading(true);
    const { ok, payload } = await GetAttachmentsAction();
    if (ok) setAttachments(payload.filter((a: any) => a.task === taskId));
    setLoading(false);
  }

  useEffect(() => {
    loadAttachments();
  }, [taskId]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("task", String(taskId));
    formData.append("file", file);

    const { payload, ok } = await UploadAttachmentAction(formData);
    setUploading(false);

    if (ok) {
      setAttachments((prev) => [...prev, payload]);
      toast.success("File uploaded successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild upload", { position: "top-center", duration: 2000 });
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleDelete(attachmentId: number) {
    const { ok } = await DeleteAttachmentAction(attachmentId);
    if (ok) {
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    } else {
      toast.error("faild deleted", { position: "top-center", duration: 2000 });
    }
  }

  if (loading) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Attachments ({attachments.length})</p>
      {attachments.map((att) => (
        <div key={att.id} className="flex items-center gap-2 text-xs">
          <a href={att.file} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate flex-1">
            {att.file.split("/").pop()}
          </a>
          {isParticipant && (
            <button onClick={() => handleDelete(att.id)} className="text-muted-foreground hover:text-destructive">×</button>
          )}
        </div>
      ))}
      {isParticipant && (
        <>
          <input ref={inputRef} type="file" hidden onChange={handleFileChange} />
          <Button size="sm" variant="outline" className="gap-1.5 " onClick={() => inputRef.current?.click()} disabled={uploading}>
            <Paperclip className="size-3.5" />
            {uploading ? "Uploading..." : "Attach File"}
          </Button>
        </>
      )}
    </div>
  );
}