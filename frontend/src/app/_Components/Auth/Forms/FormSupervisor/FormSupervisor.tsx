"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SupervisorFormType } from "@/types/schema";
import z from "zod";
import { completeProfileAction } from "@/Actions/complete.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { schemaSupervisor } from "@/schemas/Supervisor.schema";
export type RoleDataType={
   role: string,
   is_professor: boolean,
    department: string,
   expertise: string[];
}
export default function FormSupervisor() {
      const router=useRouter()
    const formObj = useForm<SupervisorFormType>({
      resolver: zodResolver(schemaSupervisor),
      defaultValues: {
        is_professor: false,
        department: "",
        expertise: "",
      },
    });
      const {
        control,
        handleSubmit,
        formState: { isSubmitting, isValid },
      } = formObj;
      async function handleProfile(data: SupervisorFormType) {
         const roleData = {
         role: "SUPERVISOR",
        is_professor: data.is_professor,
        department: data.department,
        expertise: data.expertise
          .split(",")
          .map((e:string) => e.trim())
          .filter((e:string) => e !== ""),
        };
      }
  return (
  <Form {...formObj}>
         <form className="" onSubmit={handleSubmit(handleProfile)}>
            <FormField
  control={control}
  name="is_professor"
  render={({ field }) => (
    <FormItem className="flex items-center gap-2">
      <FormControl>
        <Checkbox
          checked={field.value}
         onCheckedChange={(checked) => field.onChange(!!checked)}
        />
      </FormControl>

      <FormLabel>Professor</FormLabel>
      <FormMessage />
    </FormItem>
  )}
/>
              <FormField
               control={control}
               name="department"
               render={({field}) => (
                 <FormItem  className='my-5 w-full'>
                   <FormLabel >Enter Your Department</FormLabel>
                   <FormControl>
                  <Input {...field} type='text'/>
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
           <FormField
             control={control}
             name="expertise"
             render={({ field }) => (
               <FormItem className="my-4">
                 <FormLabel className="text-foreground text-sm font-medium">
                   expertise
                 </FormLabel>
                 <FormControl>
                   <Input
                     placeholder="e.g. Machine Learning, Data Science"
                       {...field}
                   />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           <Button type="submit" className="my-4 w-full cursor-pointer btn">
             Create Student Account
           </Button>
         </form>
       </Form>
  )
}
