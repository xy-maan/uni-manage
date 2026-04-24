"use client"
import { Button } from '@/components/ui/button'
import { FieldContent, FieldError, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import {  FormMessage } from "@/components/ui/form";
import { Control, Controller, useFieldArray, useForm } from "react-hook-form";
import React from 'react'
import { Field } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { XIcon } from 'lucide-react'
import { CreateTextPostValues } from '@/types/schema'
export default function PollSection({
  control,
}: {
  control: Control<CreateTextPostValues>;
}) {
    const { fields, append, remove } = useFieldArray({
    control,
    name: "poll_option_texts",
  });

  return (
      <div className="space-y-3 w-full">
         <FieldSet className="gap-4">
            <FieldLegend variant="label">Poll Options *</FieldLegend>
            <FieldGroup className="space-y-2 gap-0">
              {fields.map((field, index) => (
                <Controller
                  key={field.id}
                name={`poll_option_texts.${index}.value`}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput
                            {...controllerField}
                            id={`form-rhf-array-email-${index}`}
                            aria-invalid={fieldState.invalid}
                            placeholder={`Option ${index+1}` }
                          />
                          {fields.length > 1 && (
                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => remove(index)}
                                aria-label={`Remove email ${index + 1}`}
                              >
                                <XIcon />
                              </InputGroupButton>
                            </InputGroupAddon>
                          )}
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={() => append({value:""})}
                disabled={fields.length >= 5}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-4 w-4 mr-2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                Add Option
              </Button>
            </FieldGroup>
              <FormMessage />
          </FieldSet>

     {/* <div className="space-y-2">
    <Controller
                  name="poll_ends_at"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="category">Category *</FieldLabel>
                      <Select
                        name={field.name}
                         value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger
                          id="category"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
        
          
            </div> */}
    </div>
  )
}
