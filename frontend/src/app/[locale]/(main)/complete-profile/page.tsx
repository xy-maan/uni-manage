"use client";
import FormStudent from "@/app/[locale]/_Components/Auth/Forms/FormStudent/FormStudent";
import FormSupervisor from "@/app/[locale]/_Components/Auth/Forms/FormSupervisor/FormSupervisor";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { completeProfileAction } from "@/Actions/complete.action";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";
import { schemaProfile } from "@/schemas/Profile.schema";
import { Button } from "@/components/ui/button";
import ChooseRoles from "@/app/[locale]/_Components/Auth/Forms/ChooseRoles/ChooseRoles";
import { ArrowLeft, Link, Layers, CircleCheck, ArrowRight, Shield, Lock } from "lucide-react";
import HeaderCompleteProfile from "@/app/[locale]/_Components/Auth/HeaderCompleteProfile/HeaderCompleteProfile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CardCompleteProfile from "@/app/[locale]/_Components/CardCompleteProfile/CardCompleteProfile";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import HeaderForm from "@/app/[locale]/_Components/Auth/HeaderForm/HeaderForm";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CompleteProfileType } from "@/types/schema";
import { useRouter } from '@/i18n/navigation';
export default function CompleteProfile() {
  //  const [switchRole, setSwitchRole] = useState("student");
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<
    "student" | "supervisor" | null
  >(null);
  const router = useRouter();
  const formObj = useForm<CompleteProfileType>({
    resolver: zodResolver(schemaProfile),
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      bio: "",
      role: undefined,
      student_id: "",
      department: undefined,
      academic_level: undefined,
      gpa: undefined,
      skills: [],
      github_url: "",
      scholar_url: "",
      linkedin_url: "",
      expertise: [],
      max_team_capacity: undefined,
      registration_code:"",


    },
     mode: "onChange"
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = formObj;
  const watchedFields = useWatch({ control });
  function calculateProgressStudent() {
    const fieldsStudent = [
      watchedFields.username,
      watchedFields.first_name,
      watchedFields.last_name,
      watchedFields.student_id,
      watchedFields.department,
      watchedFields.academic_level,
      watchedFields.gpa,
      watchedFields.github_url,
      watchedFields.linkedin_url,
      watchedFields.skills && watchedFields.skills.length > 0 ? "filled" : "",
      watchedFields.bio,
    ];

    const filled = fieldsStudent.filter(
      (field) => field !== undefined && field !== "" && field !== null,
    );
       return Math.round((filled.length / fieldsStudent.length) * 100);
  }

    function calculateProgressSupervisor() {
    const fieldsSupervisor = [
      watchedFields.username,
      watchedFields.first_name,
      watchedFields.last_name,
      watchedFields.registration_code,
      watchedFields.department,
      watchedFields.scholar_url,
      watchedFields.linkedin_url,
      watchedFields.expertise && watchedFields.expertise.length > 0 ? "filled" : "",
      watchedFields.bio,
    ];

    const filled = fieldsSupervisor.filter(
      (field) => field !== undefined && field !== "" && field !== null,
    );

    return Math.round((filled.length / fieldsSupervisor.length) * 100);
  }
  const progress =
  selectedRole === "student"
    ? calculateProgressStudent()
    : calculateProgressSupervisor();
  function onContinue() {
    setStep(step + 1);
  }
  function handleBack() {
    if (step > 1) setStep(step - 1);
    else router.push("/");
  }

async function handleCompleteProfile(data: CompleteProfileType) {
  if (selectedRole == "student") {
    await handleFormStudent(data);
  } else {
    await handleFormSupervisor(data);
  }

}
      async function handleFormStudent(data: CompleteProfileType) {
          console.log("SUBMITTED", data);
          const roleData:CompleteProfileType =
       {
...data,
role: data.role.toUpperCase() as "STUDENT" | "SUPERVISOR",
        }
        const res = await completeProfileAction(roleData);
        console.log(res);

        if (res.ok) {
          toast.success(res.payload.message, {
            position: "top-center",
            duration: 2000,
          });
if (data.role === "STUDENT") router.push("/student/dashboard");
        } else {
          toast.error(res.payload.error, {
            position: "top-center",
            duration: 2000,
          });
        }
      }
        async function handleFormSupervisor(data: CompleteProfileType) {
          console.log("SUBMITTED", data);
          const roleData:CompleteProfileType =
       {
        ...data,
    role: data.role.toUpperCase() as "STUDENT" | "SUPERVISOR",
        };
        const res = await completeProfileAction(roleData);
        console.log(res);

        if (res.ok) {
          toast.success(res.payload.message, {
            position: "top-center",
            duration: 2000,
          });
if (data.role === "SUPERVISOR") router.push("/supervisor/dashboard");
        } else {
          toast.error(res.payload.error, {
            position: "top-center",
            duration: 2000,
          });
        }
      }
  return (
    <div className="w-full">
      <HeaderCompleteProfile handleBack={handleBack} step={step} />
      <div className="p-4 py-12 flex-1 items-center justify-center flex">
        <div className={`w-full ${step == 1 ? " max-w-4xl" : "max-w-3xl"}`}>
          <div className="mb-6">
            {step > 1 && (
              <Field className="w-full gap-0 mb-2">
                <FieldLabel htmlFor="progress-upload" className="mb-2">
                  <span className="text-sm font-medium">
                    Profile Completion
                  </span>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {progress}%
                  </span>
                </FieldLabel>
                <Progress
                  value={progress}
                  id="progress-upload"
                  className="h-2 bg-primary/20 [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none"
                />
              </Field>
            )}
          </div>
          <CardCompleteProfile role="" />
          <Card className="p-0 border-2 ">
            <CardHeader className="p-6 pb-0 ">
              <HeaderForm variant={selectedRole} step={step} />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Form {...formObj} >
                <form className="space-y-4"  onSubmit={handleSubmit(handleCompleteProfile)}>
                  {step == 1 && (
                    <ChooseRoles
                      formObj={formObj}
                      setSelectedRole={setSelectedRole}
                      selectedRole={selectedRole}
                    />
                  )}
                  {step == 2 && selectedRole == "student" && (
                    <FormStudent control={control} />
                    
                  )}
                  {step == 2 && selectedRole == "supervisor" && (
                    <FormSupervisor control={control} />
   
                  )}
                
                  <div className="flex justify-end pt-4 mt-6">
                    {step == 1 && (
                      <Button
                        disabled={!selectedRole}
                        onClick={onContinue}
                        className="cursor-pointer"
                      >
                        Continue
                        <ArrowRight className="size-4 mt-.5" />
                      </Button>
                    )}
                    {step > 1 && (
                      <Button
                        type="submit"
                         disabled={isSubmitting || !isValid}

                        className="cursor-pointer py-0 h-10 px-6!"
                      >
                        <CircleCheck className="size-4 mt-.5" />
                        Complete Setup
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
              {step>1 &&<Card className="p-0 border-2 border-warning/50 bg-warning/5  mt-6">
                <CardContent className=" p-4 flex items-start gap-3 pb-6">
                  <div className="size-5 rounded-full bg-warning/20 flex items-center justify-center mt-0.5">
                    <span className="text-warning text-xs font-bold ">!</span>

                  </div>
                  <div className="">
                    <h4 className="text-sm font-medium text-warning mb-1">
                      Complete Required Fields
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Please fill in all required fields and select at least 3 
                      {selectedRole=="student"?" skills":" expertise"}.
                      
                    </p>
                  </div>
                </CardContent>
              </Card>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
