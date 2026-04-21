"use client"
import { Button } from '@/components/ui/button'
import { FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import React from 'react'
import { Field } from '@/components/ui/field';
type PollItem = {
  label: string;
  value: string;
};
export default function PollSection({control}:{control:any}) {
      const itemsPoll: PollItem[] = [
    { label: "1 Day", value: "1 Day" },
    { label: "3 Days", value: "3 Days" },
    { label: "1 Week", value: "1 Week" },
    { label: "2 Weeks", value: "2 Weeks" },
  ];
  return (
      <div className="space-y-3 w-full">
        <FormField
          control={control}
          name="text"
          render={({field}) => (
            <FormItem  className='my-2 w-full'>
              <FormControl>
             <Input {...field} type='text'  placeholder="Option 1"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <FormField
          control={control}
          name="text"
          render={({field}) => (
            <FormItem  className='my-2 w-full'>
              <FormControl>
             <Input {...field} type='text'  placeholder="Option 2"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <Button type="button" variant="outline" className="w-full gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-4 w-4 mr-2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
 Add Option
      </Button>

     <div className="space-y-2">
        <Controller
                      name="category"
                      control={control}
                      render={({field,fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="category">
                           Poll Duration
                          </FieldLabel>
                          <Select
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="category"
                              aria-invalid={fieldState.invalid}
                            >
                              <SelectValue  placeholder="Select Durations" />
                            </SelectTrigger>
                            <SelectContent>
                             {itemsPoll.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                            </SelectContent>
                          </Select>
                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        
                        </Field>
                      )}
                    />
        
          
            </div>
    </div>
  )
}
