"use client"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card';
import { createProjectValues } from '@/types/schema';
import { BookOpen, CircleCheck, GraduationCap } from 'lucide-react'
import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form';
type Project_type = "course" | "graduation" | null;
export default function ProjectType({formObj,setSelectedProjectType,selectedProjectType}:{formObj:UseFormReturn<createProjectValues>;  setSelectedProjectType: (
  project_type:Project_type
) => void;
 selectedProjectType:Project_type}) {
  return (
    <div className='space-y-3 py-2'>
        <p className="text-sm text-muted-foreground">What kind of project are you starting?</p>
<Card className={`${selectedProjectType=="graduation"?"border-primary bg-primary/5 ":""}  relative cursor-pointer transition-all hover:border-primary/60  p-0`}  onClick={() => {
  setSelectedProjectType("graduation");
  formObj.setValue("project_type", "graduation");
}} >

    <CardContent className='p-4 flex items-start gap-3 pb-6'>
                <div className={`p-2 rounded-lg shrink-0  ${selectedProjectType=="graduation"?"bg-primary text-primary-foreground":"bg-muted"}`}>

<GraduationCap className="size-7"/>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">Graduation Project</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Final thesis project with supervisor oversight, formal deliverables, and academic evaluation.</p>
                </div>
                 {selectedProjectType=="graduation"&& <CircleCheck className="size-5 text-primary absolute top-4 right-4"/>}
        </CardContent>
        
</Card>
<Card className={`${selectedProjectType=="course"?"border-primary bg-primary/5 ":""} relative cursor-pointer transition-all hover:border-primary/60  p-0`}  onClick={() => {
  setSelectedProjectType("course");
  formObj.setValue("project_type", "course");
}} >

    <CardContent className='p-4 flex items-start gap-3 pb-6'>
                <div className={`p-2 rounded-lg shrink-0  ${selectedProjectType=="course"?"bg-primary text-primary-foreground":"bg-muted"}`}>

<BookOpen className="size-7"/>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">Course Project</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Semester-specific project for a particular course or subject.</p>
                </div>
                 {selectedProjectType=="course"&& <CircleCheck className="size-5 text-primary absolute top-4 right-4"/>}
        </CardContent>
        
</Card>

        
    </div>
  )
}
