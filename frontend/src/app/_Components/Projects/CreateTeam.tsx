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
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CircleCheck, Plus, Target, Users, Workflow } from "lucide-react";
export default function CreateTeam() {
  const [step, setStep] = useState(1);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="py-0 h-10 px-6">
        <Plus className="size-5"/>
          Create New Team
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`${step == 3 ? "sm:max-w-[800px]" : "sm:max-w-[600px]  max-w-[calc(100%-2rem)]"}  max-h-[90vh] overflow-y-auto grid w-full max-w-[calc(100%-2rem)] p-6 gap-4`}
      >
        <DialogHeader>
          <DialogTitle className="">
            <div className="text-lg leading-none font-semibold flex items-center gap-2 ">
              {step == 3 ? (
                <Workflow  className=" size-5 text-primary"/>
             
              ) : (
                <Users className="size-5 text-primary"/>
       
              )}

              {step == 3
                ? "Choose Project Management Philosophy"
                : "Create New Team"}
            </div>
          </DialogTitle>
          <DialogDescription>
            {step == 3
              ? "Select how your team will manage work and track progress. You can change this later if needed"
              : "Start by giving your team a name and description"}
          </DialogDescription>
        </DialogHeader>
{step==3?
  <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border bg-muted/50 p-0">
                <CardContent className=" p-4 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Target className="size-5 text-primary"/>
                   
                        </div>
                <div className="">
                      <h4 className="font-medium text-md">Project Name</h4>
                  <p className="text-sm text-muted-foreground">
                  Course Project
                  </p>
                </div>
                    </div>
                </CardContent>
              </Card>
:  <div className="flex items-center justify-center gap-2 py-4">
          <div
            className={`flex items-center justify-center size-8 rounded-full  ${step === 1 ? "bg-primary text-primary-foreground" : "bg-success text-white"}`}
          >
            {step === 2 ? (
              <CircleCheck  className="size-5"/>
             
            ) : (
              <span>1</span>
            )}
          </div>
          <div className="h-0.5 w-12 bg-border"></div>
          <div
            className={`flex items-center justify-center size-8 rounded-full ${step === 2 ? "bg-primary text-primary-foreground" : " bg-muted text-muted-foreground"} `}
          >
            <span>2</span>
          </div>
        </div>}
      
        {step === 1 && <FirstStep />}
        {step === 2 && <SecondStep />}
        {step === 3 && <ThirdStep  />}
        <div className="flex items-center">
          {step === 2 && (
            <Button variant={"outline"} onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <div className="flex justify-end gap-3 pt-4 ml-auto">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={() => (step == 1 ? setStep(2) : setStep(3))}>
              {" "}
              {step == 3 ? "Create Team" : "Continue"}
              <ArrowRight   className=" ml-2 size-4"/>
             
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// function SecondStep({ onBack }: { onBack: () => void }) {
//   return (
//     <div>mmmmmm</div>
// <div className="space-y-4">
//   <div className="flex justify-between gap-2">
//     <Button variant="outline" onClick={onBack}>← Back</Button>
//     <Button>Create Team</Button>
//   </div>
// </div>
//   )}
{
  /* {step === 1 && <FirstStep onNext={() => setStep(2)} />} */
}
