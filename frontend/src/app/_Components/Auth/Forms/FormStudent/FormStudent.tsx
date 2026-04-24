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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaStudent } from "@/schemas/Student.schema";
import { StudentFormType } from "@/types/schema";
import z from "zod";
import { completeProfileAction } from "@/Actions/complete.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
export type RoleDataType={
   role: string,
    major: string,
    academic_level: string,
    gpa: number, 
   skills: string[];
}
export default function FormStudent() {
const router=useRouter()
const formObj = useForm<StudentFormType>({
  resolver: zodResolver(schemaStudent),
  defaultValues: {
    major: "",
    academic_level: "",
    skills: "",
    gpa: 0,
  },
});
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = formObj;
  async function handleProfile(data: StudentFormType) {
     const roleData = {
     role: "STUDENT",
    major: data.major,
    academic_level: data.academic_level,
    gpa: data.gpa, 
    skills: data.skills
      .split(",")
      .map((s:string) => s.trim())
      .filter((s:string) => s !== ""),
    };
const res=await completeProfileAction(roleData)
if(res.ok)
{
  toast.success(res.payload.message,{position:"top-center",duration:2000})
  router.push("/student/dashboard")
}
else{
  toast.error(res.payload.error,{position:"top-center",duration:2000})
}
  }
  return (
    <>
      <Form {...formObj}>
        <form className="" onSubmit={handleSubmit(handleProfile)}>
           {/* <RadioGroup defaultValue="comfortable" className="w-fit my-4">
                    <FormLabel className="text-foreground text-sm font-medium">
                  Role
                </FormLabel>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="STUDENT" id="r1" />
        <Label htmlFor="r1">STUDENT</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="SUPERVISOR" id="r2" />
        <Label htmlFor="r2">SUPERVISOR</Label>
      </div>
    </RadioGroup> */}
          <FormField
            control={control}
            name="major"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-foreground text-sm font-medium">
                  Major
                </FormLabel>
                <FormControl>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      // aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select Major" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="Computer Science">
                        Computer Science
                      </SelectItem>
                      <SelectItem value="Software Engineering">
                        Software Engineering
                      </SelectItem>
                      <SelectItem value="Artificial Intelligence">
                        Artificial Intelligence
                      </SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
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
              <FormItem className="my-4">
                <FormLabel className="text-foreground text-sm font-medium">
                  Academic Level
                </FormLabel>
                <FormControl>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      // aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="gpa"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-foreground text-sm font-medium">
                  GPA
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    placeholder="3.6"
                   onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="skills"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel className="text-foreground text-sm font-medium">
                  Skills
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. React, Python, Django"
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
    </>
  );
}
