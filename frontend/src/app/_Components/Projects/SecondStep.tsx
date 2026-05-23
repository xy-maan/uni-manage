"use client"
import { Badge } from '@/components/ui/badge'
import { BookOpen, CircleCheck, GraduationCap } from 'lucide-react'
import React, { useState } from 'react'

export default function SecondStep() {
const [typeProject, setTypeProject] = useState("")
  return (
        <div className="grid gap-4 ">
            <div className={`relative p-6 rounded-lg border-2 transition-all text-left ${typeProject=="grad"?"border-primary bg-primary/5 ":"border-border hover:border-primary/50 hover:bg-muted/50"}  `} onClick={()=>{setTypeProject("grad")}}>
            <div className="flex items-start gap-4">
                <div className={`size-12 rounded-lg flex items-center justify-center ${typeProject=="grad"?"bg-primary text-white":"bg-primary/10  text-primary"}`}>

<GraduationCap className="size-6"/>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4>Graduation Project</h4>
                        <Badge className='bg-primary/10 text-primary'>Major</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Final year capstone project required for graduation. Typically spans multiple semesters with comprehensive deliverables and evaluations.</p>
                </div>
            </div>
         {typeProject=="grad"&& <CircleCheck className="size-5 text-primary absolute top-4 right-4"/>
}

            </div>


              <div className={`relative p-6 rounded-lg border-2 transition-all text-left ${typeProject=="course"?"border-secondary bg-secondary/5 ":"border-border  hover:border-secondary/50 hover:bg-muted/50"} ` }onClick={()=>{setTypeProject("course")}}>
            <div className="flex items-start gap-4">
                <div className={`size-12 rounded-lg  flex items-center justify-center ${typeProject=="course"?"bg-secondary text-white":"bg-secondary/10  text-secondary"} `}>

<BookOpen className="size-6"/>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h4>Course Project</h4>
                        <Badge className='bg-secondary/10 text-secondary'>Semester</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Project for a specific course or class. Usually completed within one semester with defined scope and course-specific requirements.</p>
                </div>
              {typeProject=="course"&&   <CircleCheck className="size-5 text-secondary absolute top-4 right-4"/>}

            </div>
            </div>
        </div>
        
  )
}
