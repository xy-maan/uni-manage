"use client";
import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {  File } from "lucide-react";
import { Link } from '@/i18n/navigation';
export default function AttachmentViewer({ attachments }: { attachments: { id: number; file: string }[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {attachments.map((item) => {
          const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(item.file);

          return (
            <div key={item.id}>
              {isImage &&
                  <Image
              width={450}
              height={450}
                src={item.file}
                alt="attachment"
                className="size-40 object-cover rounded-md my-2 cursor-pointer"
                  onClick={() => setSelectedImage(item.file)}
                unoptimized 
              />}
{!isImage&&
                 <Link
                   href={item.file}
                   target="_blank"
                   className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg text-sm w-fit my-4"
                 >
                   <File className="text-foreground size-4"/>
                     {item.file.split("/").pop()}
                 </Link>
}
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className='max-w-3xl p-2 bg-black/90 border-none  **:data-[slot="dialog-close"]:text-black  **:data-[slot="dialog-close"]:text-lg' >
          {selectedImage && (
             <Image
              width={450}
              height={450}
                  src={selectedImage}
                alt="attachment"
                className="w-full h-full object-contain max-h-[80vh] rounded-md"
                unoptimized 
              />
           
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}