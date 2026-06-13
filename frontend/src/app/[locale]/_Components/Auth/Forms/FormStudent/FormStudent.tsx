"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Control, Controller, useForm, useWatch } from "react-hook-form";
import { Award, BookOpen, ChevronDown, Code, Github, IdCard, Linkedin, TrendingUp, User } from "lucide-react";
import { CompleteProfileType } from "@/types/schema";
import MultiSelect from "../TagsSearch/MultiSelect";
import { GetDepartmentsAction } from "@/Actions/getAlldepartments.action";
import { GetAcademicLevelsAction } from "@/Actions/getAllAcademicLevels.action";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
type Departments = {
  id: number;
  name: string;
};
type Levels = {
  id: number;
  name: string;
};

export default function FormStudent({
  control,
}: {
  control: Control<CompleteProfileType>;
}) {
  const [departments, setDepartments] = useState<Departments[]>([])
  const [levels, setLevels] = useState<Levels[]>([])
  async function  handleGetDepartments() {
    const {payload}=await GetDepartmentsAction() 
    console.log("Department",payload);
      setDepartments(payload)
    
  }
async function  handleAcademicLevels() {
  const {payload}=await GetAcademicLevelsAction() 
  console.log("Levels",payload);
setLevels(payload)
  
}

useEffect(() => {
  handleGetDepartments();
  handleAcademicLevels()
}, [])

  const router = useRouter();
  return (
    <>
    <div className="space-y-6">
             <FormField
                control={control}
                name="username"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium">
                       <User className="size-4 text-primary"/>
                      User Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="johndoe"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
   
      <div className="grid lg:grid-cols-2 gap-4">
             <FormField
                control={control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium gap-2">
                      <User className="size-4 text-primary"/>
                     First Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="John"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium gap-2">
                       <User className="size-4 text-primary"/>
                     Last Name*
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Doe"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
      </div>
         <div className="grid lg:grid-cols-2 gap-4">
               <FormField
                control={control}
                name="student_id"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium">
                      <IdCard className="size-4 text-primary"/>
                      Student ID *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="30505015864828"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={control}
                name="gpa"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium ">
                      <TrendingUp className="text-primary size-4"/>
                     GPA *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        step="0.01"
                        min="1"
                        max="4"
                        placeholder="e.g., 3.5"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

      </div>
             <div className="grid lg:grid-cols-2 gap-4">
               <FormField
                control={control}
                name="department"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium">
                      <Award className="size-4 text-primary"/>
                      Department *
                    </FormLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                    value={field.value ? field.value.toString() : ""}
                       onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger
                          id="department"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          
                          {departments.map((department) => (
                            <SelectItem key={department.id} value={department.id.toString()}>{department.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="academic_level"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium">
                      <BookOpen className="text-primary size-4"/>
                      Academic Level *
                    </FormLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                      value={field.value ? field.value.toString() : ""}
                        onValueChange={(v) => field.onChange(Number(v))}>
                    
                        <SelectTrigger
                          id="form-rhf-select-language"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                         
                          {levels.map((level) => (
                            <SelectItem key={level.id} value={level.id.toString()}>{level.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             </div>
            
<FormField
  control={control}
  name="skills"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel className="text-foreground text-sm font-medium">
        <Code className="text-primary size-4"/>
        Skills * (Select at least 3)</FormLabel>
      <FormControl>
        <MultiSelect
          variant="student"
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
<FormField control={control} name="github_url" render={({ field }) => (
  <FormItem className="">
    <FormLabel className="text-foreground text-sm font-medium">
      <Github className="text-primary size-4"/>
      
      GitHub URL *</FormLabel>
    <FormControl>
      <Input {...field} type="url" placeholder="https://github.com/username" />
    </FormControl>
    <FormMessage />
  </FormItem>
)} />
<FormField control={control} name="linkedin_url" render={({ field }) => (
  <FormItem className="">
    <FormLabel className="text-foreground text-sm font-medium">
       <Linkedin className="text-primary size-4"/>
      Linkedin URL *</FormLabel>
    <FormControl>
      <Input {...field} type="url" placeholder="https://linkedin.com/username" />
    </FormControl>
    <FormMessage />
  </FormItem>
)} />
 <FormField
          control={control}
          name="bio"
          render={({ field }) => (
            <FormItem className="my-2 w-full">
              <div className="gap-2">
                <FormLabel>Bio (Optional) *</FormLabel>
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none min-h-[100px]"
                  placeholder="Tell us about yourself, your goals, and what you're passionate about..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>


    </>
   
  );
}
