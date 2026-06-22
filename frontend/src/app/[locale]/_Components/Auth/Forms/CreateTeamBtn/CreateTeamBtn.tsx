"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ArrowRight, Award, BookOpen, ChevronDown, CircleCheck, Code, Github, IdCard, Linkedin, Plus, TrendingUp, User } from "lucide-react";
import { CompleteProfileType, createProjectValues } from "@/types/schema";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { CreatePostAction } from "@/Actions/createPost.action";
import { createProjectAction } from "@/Actions/Project/createProject.action";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProjectType from "@/app/[locale]/_Components/Projects/ProjectType";
import MethodologyType from "@/app/[locale]/_Components/Projects/MethodologyType";
import { createProjectSchema } from "@/schemas/createProject.schema";
import Details from "../../../Projects/Details";
import Team from "../../../Projects/Team";
const steps = [
  "Type",
  "Method",
  "Details",
  "Team",
//   "Review",
];
export default function CreateTeamBtn({role}:{role:string}) {
 const router=useRouter()
     const [step, setStep] = useState(1);
     const [selectedProjectType, setSelectedProjectType] =  useState<
         "course" | "graduation" | null
       >(null);
          const [selectedMethType, setSelectedMethType] =  useState<
         "kanban" | "sprint" | "milestone" |null
       >(null);
   const formObj = useForm<createProjectValues>({
     resolver: zodResolver(createProjectSchema),
     defaultValues: {
       name: "",
       project_type: undefined,
       methodology: undefined,
       description: "",
    category_id: undefined,
    semester_id: undefined,
    academic_year_id: undefined,
    subject_id: undefined,
    technology_names: [],
    min_members: 5,
    max_members: 7,
    is_public: true,
    proposal: "",
    archive_tags:[]
     },
   });
     const { control,watch, handleSubmit, formState: { isSubmitting, isValid }, } = formObj;
       async function handleCreateTeam(data:createProjectValues) {
         const postData:createProjectValues = {
           ...data,
           
         };
       ( postData); 
       
    const { payload, ok  } = await createProjectAction(postData);
         if(ok){
 router.push(`/${role}/projects`)
         }
  
       if (!ok ) 
 
 
       toast.error("Failed to create team");
 
         
     
     else
         {toast.success(payload?.status,{position:"top-center",duration:2000})}
       }
       function onContinue() {
     setStep(step + 1);
   }
   function handleBack() {
       if (step === 1) {
     router.push(`/${role}/projects`);
   } else {
     setStep((prev) => prev - 1);
   }
   }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="py-0 h-10 px-6">
        <Plus className="size-5"/>
          Create New Team
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`${step != 3 ? "sm:max-w-lg max-w-lg" : "sm:max-w-[600px]  max-w-[calc(100%-2rem)]"}  max-h-[90vh] overflow-y-auto grid w-full p-6 gap-4`}
      >
        <DialogHeader>
          <DialogTitle className="">
            <div className="text-lg leading-none font-semibold flex items-center gap-2 ">
                Create New Project
            </div>
          </DialogTitle>
        </DialogHeader>
<div className="space-y-2">
  {/* Stepper */}
  <div className="flex items-center gap-2 py-1">
    {steps.map((label, index) => {
      const currentStep = index + 1;
      const completed = currentStep < step;
      const active = currentStep === step;

      return (
        <div
          key={label}
          className="flex items-center gap-2 flex-1 last:flex-none"
        >
          <div
            className={`
              size-7 rounded-full flex items-center justify-center
              text-xs font-medium shrink-0 transition-all
              ${
                completed
                  ? "bg-primary text-primary-foreground"
                  : active
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : "bg-muted text-muted-foreground"
              }
            `}
          >
            {completed ? (
              <CircleCheck className="size-3.5" />
            ) : (
              currentStep
            )}
          </div>

          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-px transition-all ${
                completed ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      );
    })}
  </div>

  {/* Labels */}
  <div className="flex w-full flex justify-between text-xs text-muted-foreground -mt-1">
    {steps.map((label) => (
      <div
        key={label}
        className=""
      >
        <span>{label}</span>
      </div>
    ))}
  </div>
</div>
      <div className="w-full">
       <Form {...formObj}>
                <form onSubmit={handleSubmit(handleCreateTeam)} className="">

      {step == 1 && (
                          <ProjectType
                            formObj={formObj}
                            setSelectedProjectType={setSelectedProjectType}
                            selectedProjectType={selectedProjectType}
                          />
                        )}
                            {step == 2 &&(
                                            <MethodologyType     formObj={formObj}
                            setSelectedMethType={setSelectedMethType}
                            selectedMethType={selectedMethType}
                           />
                            )}
                            {step == 3 &&(
                                            <Details control={control}/> 
                                          )}
        {step == 4 &&(
                                            <Team control={control} watch={watch}/> 
                                          )}

                      <div className="flex justify-end pt-4 mt-6 gap-3 ">

 {step < 4 ? (
    <Button type="button" onClick={() => setStep(step + 1)}>
      Continue
    </Button>
  ) : (
    <Button type="submit">
      Create Project
    </Button>
  )}
      <Button
      type="button"
      variant="outline"
      onClick={handleBack}
    >
      {step === 1 ? "Cancel" : "Back"}
    </Button>
                  </div>
                </form>
                </Form>



      </div>
      </DialogContent>
    </Dialog>
  );
}
