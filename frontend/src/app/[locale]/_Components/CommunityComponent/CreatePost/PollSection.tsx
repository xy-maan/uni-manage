"use client"
import { Button } from '@/components/ui/button'
import { FieldContent, FieldError, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import {  FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Control, Controller, FormState, useFieldArray, useForm } from "react-hook-form";
import React from 'react'
import { Field } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Plus, XIcon } from 'lucide-react'
import { CreateTextPostValues } from '@/types/schema'
export default function PollSection({
  control,formState
}: {
  control: Control<CreateTextPostValues>;
  formState:FormState<CreateTextPostValues>
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
                <FormField
                  key={field.id}
                name={`poll_option_texts.${index}.value`}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <FormItem
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
                          {fields.length > 2 && (
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
                    </FormItem>
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
                <Plus className=' size-4 mr-2'/>
               
                Add Option
              </Button>
            </FieldGroup>

              <FormMessage />
          </FieldSet>

    </div>
  )
}
