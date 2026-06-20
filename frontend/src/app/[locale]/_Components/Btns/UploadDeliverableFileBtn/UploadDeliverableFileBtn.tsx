// Btns/UploadDeliverableFileBtn/UploadDeliverableFileBtn.tsx
"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { UploadDeliverableFileAction } from "@/Actions/Deliverables/uploadDeliverableFile.action";

export default function UploadDeliverableFileBtn({
  deliverableId,
  onUploaded,
}: {
  deliverableId: number;
  onUploaded: (file: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    // formData.append("deliverable", String(deliverableId));
    formData.append("file", file);

    const { payload, ok } = await UploadDeliverableFileAction(deliverableId,file);
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
      <input ref={inputRef} type="file" hidden onChange={handleFileChange} />
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs gap-1.5"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        <Upload className="size-3" />
        {loading ? "Uploading..." : "Upload File"}
      </Button>
    </>
  );
}