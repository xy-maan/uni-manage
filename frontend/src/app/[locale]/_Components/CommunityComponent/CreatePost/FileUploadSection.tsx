"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useRef, useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateTextPostValues } from "@/types/schema";
import { AtSign, Paperclip } from "lucide-react";
import Image from "next/image";

export default function FileUploadSection({
  control,
}: {
  control: Control<CreateTextPostValues>;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>

      <div className="flex items-center justify-center w-full border-2 border-dashed rounded-lg p-6 text-center my-3 transition-colors border-muted-foreground/25">
        <Controller
          control={control}
          name="file"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                // onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full rounded-base cursor-pointer"
              >
                {field.value ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    {/* if image */}
                    {field.value?.type.startsWith("image/") && preview ? (
                        <Image
                                      width={450}
                                      height={450}
                                         src={preview}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-lg"
                                        unoptimized 
                                      />
                   
                    ) : (
                      //  if file
                      <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="text-muted-foreground"
                        >
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        </svg>
                        <span className="text-sm">
                          {field.value?.name ?? ""}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(null);
                        setPreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  // if not upload
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                      <Paperclip className="size-6 text-muted-foreground"/>
                    </div>
                    <div>
                      <p className="mb-2 text-sm">
                        Drop files here or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports: Images (JPG, PNG), Documents (PDF, DOCX, PPTX)
                      </p>
                    </div>
                  </div>
                )}
                <Input
                  type="file"
                  id="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    field.onChange(file);

                    if (file.type.startsWith("image/")) {
                      const url = URL.createObjectURL(file);
                      setPreview(url);
                    } else {
                      setPreview(null);
                    }
                  }}
                />
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </>
  );
}
