"use client"
import React from "react";
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button";
type activeBarType = {
  activeBar: string;
};
export default function ProjectCard({ activeBar }: activeBarType) {
  return (
    <div className="card-project bg-card text-card-foreground gap-6 rounded-xl group relative border-2 transition-all duration-300 h-full flex flex-col hover:border-primary/30 shadow-md hover:shadow-xl hover:scale-[1.02]">
      <div className="flex flex-col flex-1  p-6 ">
        <div className="flex items-center justify-start mb-4 h-6 gap-2 flex-wrap ">
          <span className="[a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-500/10 text-green-500 border-green-500/20 border transition-all hover:scale-105  rounded-md px-2 py-0.5 text-xs font-medium w-fi">
            AI/ML
          </span>
          <span className="[a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-500/10 text-green-500 border-green-500/20 border transition-all hover:scale-105  rounded-md px-2 py-0.5 text-xs font-medium w-fi">
            Active
          </span>
        </div>
        <h3 className="mb-2 text-xl group-hover:text-primary transition-colors line-clamp-1">
          AI-Powered Student Assistant
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          An intelligent chatbot system designed to help students with course
          selection, academic planning, and university navigation.
        </p>
        {/* from api */}
        <div className="skills items-center justify-start flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground border hover:border-primary/30 transition-colors">Python</span>
            <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground border hover:border-primary/30 transition-colors">Python</span>
            <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground border hover:border-primary/30 transition-colors">Python</span>
            <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground border hover:border-primary/30 transition-colors">Python</span>
        </div>
<div className="details-project flex  items-center gap-4 text-sm text-muted-foreground mb-4">
<span className="flex items-center gap-1.5">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
   4 members
</span>
<span  className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock h-4 w-4"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
8 months
</span>
</div>
<div className="progress">
     <Field className="w-full gap-0">
      <FieldLabel htmlFor="progress-upload" className=" text-xs text-muted-foreground mb-2">
        <span>Progress</span>
        <span className="ml-auto">75%</span>
      </FieldLabel>
      <Progress value={75} id="progress-upload" />
    </Field>
</div>
      </div>
      <div className="card-footer p-6 pt-0 w-full">
        {activeBar=="student"&&<Button className='text-center border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 w-full flex items-center justify-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-4 w-4 mr-2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
            View Details
        </Button>}
             {activeBar=="supervisor"&&<Button className='text-center border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 w-full flex items-center justify-center gap-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up h-4 w-4 mr-2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            Monitor Progress
        </Button>}
        {/*  */}
      </div>
    </div>
  );
}
