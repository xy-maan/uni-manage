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
import { Control } from "react-hook-form";
import {
  Award,
  BookOpen,
  ChevronDown,
  Code,
  Github,
  IdCard,
  Linkedin,
  Lock,
  Shield,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import { CompleteProfileType } from "@/types/schema";
import { GetDepartmentsAction } from "@/Actions/getAlldepartments.action";
import { GetAcademicLevelsAction } from "@/Actions/getAllAcademicLevels.action";
import { Textarea } from "@/components/ui/textarea";
import MultiSelect from "../TagsSearch/MultiSelect";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
type Departments = {
  id: number;
  name: string;
};
type Levels = {
  id: number;
  name: string;
};
export default function FormSupervisor({
  control,
}: {
  control: Control<CompleteProfileType>;
}) {
  const [departments, setDepartments] = useState<Departments[]>([]);
  const [levels, setLevels] = useState<Levels[]>([]);
  async function handleGetDepartments() {
    const { payload } = await GetDepartmentsAction();
    ("Department", payload);
    setDepartments(payload);
  }
  async function handleAcademicLevels() {
    const { payload } = await GetAcademicLevelsAction();
    ("Levels", payload);
    setLevels(payload);
  }

  useEffect(() => {
    handleGetDepartments();
    handleAcademicLevels();
  }, []);

  return (
    <>
      <div className="space-y-6">
        <FormField
          control={control}
          name="username"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-foreground text-sm font-medium">
                <User className="size-4 text-primary" />
                User Name *
              </FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="johndoe" />
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
                  <User className="size-4 text-primary" />
                  First Name *
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="John" />
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
                  <User className="size-4 text-primary" />
                  Last Name*
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="max_team_capacity"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-foreground text-sm font-medium ">
                <TrendingUp className="text-primary size-4" />
                Max Team Capacity *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  value={field.value ?? ""}
                  step="1"
                  min="5"
                  max="7"
                  placeholder="e.g., 5"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
               <FormField
                control={control}
                name="department"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-foreground text-sm font-medium">
                      <Award className="size-4 text-primary"/>
                      Department 
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
        {/* <FormField
          control={control}
          name="department"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-foreground text-sm font-medium">
                <Award className="size-4 text-primary" />
                Department *
              </FormLabel>
              <FormControl>
                <Select
                  name={field.name}
                  value={field.value ? field.value.toString() : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {departments.map((department) => (
                      <SelectItem
                        key={department.id}
                        value={department.id.toString()}
                      >
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={control}
          name="expertise"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-foreground text-sm font-medium">
                <Target className="text-primary size-4" />
                Areas of Expertise 
              </FormLabel>
              <FormControl>
                <MultiSelect
                  variant="supervisor"
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
          name="scholar_url"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-foreground text-sm font-medium">
                <Github className="text-primary size-4" />
                scholar_url 
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://scholar_url.com/username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="linkedin_url"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="text-foreground text-sm font-medium">
                <Linkedin className="text-primary size-4" />
                Linkedin URL 
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://linkedin.com/username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="bio"
          render={({ field }) => (
            <FormItem className="my-2 w-full">
              <div className="gap-2">
                <FormLabel>Professional Bio *</FormLabel>
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
        <Card className="p-0  bg-primary/5 border-2 border-primary/20 mt-6">
          <CardContent className="p-4 items-start flex gap-3">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="size-5 text-primary" />
            </div>
            <div className="">
              <h3 className="font-semibold mb-1">Supervisor Verification</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter the verification passcode provided by your institution to
                verify your supervisor status. This ensures only authorized
                faculty members can supervise student projects.
              </p>
              <FormField
                control={control}
                name="registration_code"
                render={({ field }) => (
                  <FormItem className="my-2 w-full">
                    <div className="gap-2">
                      <FieldLabel htmlFor="Supervisor Verification">
                        <Lock className="size-4 text-primary" /> Verification
                        Passcode *
                      </FieldLabel>
                    </div>
                    <Field>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your verification code"
                      />
                      <FieldDescription className="text-xs text-muted-foreground">
                        Contact your department administrator if you haven't
                        received a verification code.
                      </FieldDescription>
                    </Field>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
