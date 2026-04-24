"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
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

export default function FileUploadSection({
  control,
}: {
  control: Control<CreateTextPostValues>;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <>
      <div className="my-3">
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem className="my-2 w-full">
              <div className="gap-2">
                <FormLabel> Content *</FormLabel>
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Share an update, ask a question, or start a discussion... (Use @ to mention users or projects)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-xs text-muted-foreground flex items-center gap-1 my-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-at-sign h-3 w-3"
          >
            <circle cx={12} cy={12} r={4} />
            <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
          </svg>
          Type @ to mention users or projects
        </div>
      </div>
      <div className="flex items-center justify-center w-full border-2 border-dashed rounded-lg p-6 text-center my-3 transition-colors border-muted-foreground/25">
        <Controller
          control={control}
          name="file"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full rounded-base cursor-pointer"
              >
                {field.value ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    {/* if image */}
                    {field.value?.type.startsWith("image/") && preview ? (
                      <img
                        src={preview}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-lg"
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="lucide lucide-paperclip h-6 w-6 text-muted-foreground"
                      >
                        <path d="M13.234 20.252 21 12.3" />
                        <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" />
                      </svg>
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
                  onChange={(e) => {
                     const file = e.target.files?.[0]
                    field.onChange(file);
                    if (file?.type.startsWith("image/")) {
                      const url = URL.createObjectURL(file);
                      console.log(url);
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
