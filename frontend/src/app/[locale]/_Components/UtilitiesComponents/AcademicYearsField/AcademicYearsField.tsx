import { GetAcademicAction } from '@/Actions/getAcademicYears.action';
import { GetAcademicLevelsAction } from '@/Actions/getAllAcademicLevels.action';
import { GetSemesterAction } from '@/Actions/getSemester.action';
import { FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createProjectValues } from '@/types/schema';
import { AcademicYears } from '@/types/team';
import React, { useEffect, useState } from 'react'
import { Control } from 'react-hook-form';

export default function AcademicYearsField({
  control,
}: {
  control: Control<createProjectValues>;
}) {
          const [academicYears, setAcademicYears] = useState<AcademicYears[]>([]);
           async function getAcademicYears() {
    const { ok, payload } = await GetAcademicAction();
    if (ok)
     {  setAcademicYears(payload);}
  }
    useEffect(() => {
      getAcademicYears();
    }, []);
  return (
             <FormField
                control={control}
                name="academic_year_id"
                render={({ field }) => (
                  <FormItem className="">
                     <FieldLabel htmlFor="category">academic years *</FieldLabel>
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
                         
                          {academicYears.map((cat) => (
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
