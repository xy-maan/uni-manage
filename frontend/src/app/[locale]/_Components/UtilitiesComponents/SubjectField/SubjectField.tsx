"use client"
import { GetSubjectAction } from '@/Actions/getSubject.action';
import { FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage,FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types/post';
import { createProjectValues } from '@/types/schema';
import React, { useEffect, useState } from 'react'
import { Control } from 'react-hook-form';

export default function SubjectField({
  control,
}: {
  control: Control<createProjectValues>;
}) {
          const [subject, setSubject] = useState<Category[]>([]);
           async function getSubject() {
    const { ok, payload } = await GetSubjectAction();
    if (ok)
     {
      
      setSubject(payload);}
  }
    useEffect(() => {
      getSubject();
    }, []);
  return (
            <FormField
                control={control}
                name="category_id"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium">
                      Subject *
                    </FormLabel>
                    <FormControl>
                      <Select
                        // name={field.name}
                    value={field.value ? field.value.toString() : ""}
                       onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger
                          id="department"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          
                          {subject.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            
  )
}
