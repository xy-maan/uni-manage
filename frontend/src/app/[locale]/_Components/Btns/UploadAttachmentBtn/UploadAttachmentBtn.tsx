// Btns/UploadAttachmentBtn/UploadAttachmentBtn.tsx
"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import { UploadAttachmentAction } from "@/Actions/Tasks/attachments/uploadAttachment.action";

export default function UploadAttachmentBtn({
  taskId,
  onUploaded,
}: {
  taskId: number;
  onUploaded: (attachment: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("task", String(taskId));
    formData.append("file", file);

    const { payload, ok } = await UploadAttachmentAction(formData);
    setLoading(false);

    if (ok) {
      onUploaded(payload);
      toast.success("File uploaded successfully", { position: "top-center", duration: 2000 });
    } else {
      toast.error("faild upload", { position: "top-center", duration: 2000 });
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <input ref={inputRef} type="file" hidden onChange={handleFileChange}  className="w-full"/>
      <Button size="sm" variant="outline" className="gap-1.5 " onClick={() => inputRef.current?.click()} disabled={loading}>
        <Paperclip className="size-3.5" />
        {loading ? "Uploading..." : "Attach File"}
      </Button>
    </>
  );
}