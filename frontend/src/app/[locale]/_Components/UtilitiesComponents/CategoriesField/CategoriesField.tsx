"use client"
import { GetCategoryProjectsAction } from '@/Actions/getCategoriesProject.action';
import { FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage,FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types/post';
import { createProjectValues } from '@/types/schema';
import React, { useEffect, useState } from 'react'
import { Control } from 'react-hook-form';

export default function CategoriesField({
  control,
}: {
  control: Control<createProjectValues>;
}) {
          const [categories, setCategories] = useState<Category[]>([]);
           async function getCategory() {
    const { ok, payload } = await GetCategoryProjectsAction();
    if (ok)
     {
      
      setCategories(payload);}
  }
    useEffect(() => {
      getCategory();
    }, []);
  return (
            <FormField
                control={control}
                name="category_id"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium">
                      categories *
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
                          <SelectValue placeholder="Select categories" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          
                          {categories.map((cat) => (
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
