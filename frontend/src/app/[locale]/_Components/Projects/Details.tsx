"use client";
import React from "react";
import { Control, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProjectValues } from "@/types/schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Code } from "lucide-react";
import CategoriesField from "../UtilitiesComponents/CategoriesField/CategoriesField";
import SemesterField from "../UtilitiesComponents/SemesterField/SemesterField";
import AcademicYearsField from "../UtilitiesComponents/AcademicYearsField/AcademicYearsField";
import SubjectField from "../UtilitiesComponents/SubjectField/SubjectField";
import TechnologiesField from "../UtilitiesComponents/TechnologiesField/TechnologiesField";

export default function Details({
  control,
}: {
  control: Control<createProjectValues>;
}) {
  return (
<div className="space-y-6">

               <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium">
                     Team Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                      placeholder="e.g. Code Crusaders"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                     <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="my-2 w-full">
                            <div className="gap-2">
                              <FormLabel>Description</FormLabel>
                            </div>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="resize-none "
                                placeholder="What is your project about?"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-3">

                      <CategoriesField control={control}/>
                      <SemesterField control={control}/>
                      </div>
                            <div className="grid grid-cols-2 gap-3">
 <AcademicYearsField control={control}/>
                      <SubjectField control={control}/>
                      </div>
                        <FormField
                               control={control}
                               name="proposal"
                               render={({ field }) => (
                                 <FormItem className="my-2 w-full">
                                   <div className="gap-2">
                                     <FormLabel className="flex items-center gap-2 text-sm leading-none">proposal <span className="text-muted-foreground text-xs">(optional — will be shared with supervisor requests)</span></FormLabel>
                                   </div>
                                   <FormControl>
                                     <Textarea
                                       {...field}
                                       className="resize-none "
                                       placeholder="What is your project about?"
                                     />
                                   </FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
                             <FormField
                       control={control}
                       name="technology_names"
                       render={({ field, fieldState }) => (
                         <FormItem>
                           <FormLabel className="text-foreground text-sm font-medium">
                             <Code className="text-primary size-4"/>
                            Technologies</FormLabel>
                           <FormControl>
                             <TechnologiesField
                               variant="project"
                               value={field.value ?? []}
                               onChange={field.onChange}
                               onBlur={field.onBlur}
                               isInvalid={fieldState.invalid}
                             />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                              <FormField
                               control={control}
                               name="expected_scope"
                               render={({ field }) => (
                                 <FormItem className="my-2 w-full">
                                   <div className="gap-2">
                                     <FormLabel>expected_scope </FormLabel>
                                   </div>
                                   <FormControl>
                                     <Textarea
                                       {...field}
                                       className="resize-none "
                                       placeholder="What is your project about?"
                                     />
                                   </FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
   </div>

  )
}
