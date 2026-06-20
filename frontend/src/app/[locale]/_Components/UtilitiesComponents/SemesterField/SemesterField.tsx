import { GetSemesterAction } from '@/Actions/getSemester.action';
import { FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createProjectValues } from '@/types/schema';
import { Semesters } from '@/types/team';
import React, { useEffect, useState } from 'react'
import { Control } from 'react-hook-form';

export default function SemesterField({
  control,
}: {
  control: Control<createProjectValues>;
}) {
          const [semesters, setsemesters] = useState<Semesters[]>([]);
           async function getSemester() {
    const { ok, payload } = await GetSemesterAction();
    console.log(payload);
    
    if (ok)
     {  setsemesters(payload);}
  }
    useEffect(() => {
      getSemester();
    }, []);
  return (
             <FormField
                control={control}
                name="semester_id"
                render={({ field }) => (
                  <FormItem className="">
                     <FieldLabel htmlFor="category">Semester *</FieldLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                      value={field.value ? field.value.toString() : ""}
                        onValueChange={(v) => field.onChange(Number(v))}>
                    
                        <SelectTrigger
                          id="categories"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                         
                          {semesters.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
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
