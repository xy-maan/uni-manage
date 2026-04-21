"use client"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function FileUploadSection({control}:{control:any}) {
  return (
  <>
    <div className="">

        <FormField
    control={control}
    name="text"
    render={({field}) => (
      <FormItem  className='my-2 w-full'>
         <div className="gap-2">
        <FormLabel > Content *</FormLabel>
  </div>
        <FormControl>
    <Textarea
    {...field}
                  className="resize-none"
                  placeholder="Share an update, ask a question, or start a discussion... (Use @ to mention users or projects)"
                />
        </FormControl>
      </FormItem>
    )}
  />
     <div className="text-xs text-muted-foreground flex items-center gap-1 my-2">
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
     <div className="flex items-center justify-center w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors border-muted-foreground/25">
     
             <Controller
      control={control}
      name="file"
      render={({ field,fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="file" className='flex flex-col items-center justify-center w-full bg-neutral-secondary-medium  rounded-base cursor-pointer hover:bg-neutral-tertiary-medium'>
                    <div className="flex flex-col items-center justify-center   gap-2">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center">
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
                {/* <input id="file" type="file" className="hidden " /> */}
                  <Input type="file" id="file" className="hidden " onChange={(e) => field.onChange(e.target.files)} />
                  </FieldLabel>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                </Field>
      
      )}
    />
              {/* <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full bg-neutral-secondary-medium  rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
              >
                <div className="flex flex-col items-center justify-center   gap-2">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center">
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
                <input id="dropzone-file" type="file" className="hidden " />
              </label> */}
            </div> 
  </>
  )
}
