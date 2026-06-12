import React from 'react'
import { Calendar, CircleCheck, FileText, FileTextIcon, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export default function MilestoneCard({variant}:{variant:string}) {
  return (
    <div className="flex  flex-col lg:flex-row gap-6 mb-6 rounded-lg border-2 p-6 border-success/30 bg-success/5">
    <div className="left-card flex  gap-4 ">
    <div className="shrink-0 size-12 rounded-full flex items-center justify-center bg-success">
    <CircleCheck className=' size-5 text-foreground'/>
    </div>
    <div className="">
        <Badge variant="outline" className="mb-2">
             {variant=="phase1"&&"Phase 1"}
             {variant=="phase2"&&"Phase 2"}
             {variant=="phase3"&&"Phase 3"}
             {variant=="phase4"&&"Phase 4"}
             {variant=="phase5"&&"Phase 5"}
        </Badge>
        <h3 className='mb-1'>
                    {variant=="phase1"&&"Project Proposal & Requirements"}
            {variant=="phase2"&&"System Design & Architecture"}
            
    </h3>
            <Badge className="text-success bg-success/10 border-success/20">
            Completed
        </Badge>
        <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
            <Calendar className="size-4"/>
            Due: Dec 20, 2025
        </div>
        <div className="flex items-center gap-2 text-success  text-sm">
            <CircleCheck className="size-4 "/>
            Completed: Dec 18, 2025
        </div>
            <div className="flex items-center gap-2 text-muted-foreground  text-sm my-2">
            <Users className="size-4"/>
           4 team members
        </div>
    </div>
    </div>
    <div className="right-card flex-1">
        <div className="flex items-center gap-2 mb-3">
            <FileText className="size-4 text-muted-foreground"/>
            <span className='text-sm font-medium'>Deliverables</span>
            <Badge className=" border-transparent bg-secondary text-secondary-foreground">3/3</Badge>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg border transition-all bg-success/5 border-success/20 my-2">
    <div className="size-5 rounded flex items-center justify-center bg-success">
        <CircleCheck className='size-4 text-foreground'/>
    </div>
        <h5 className="text-sm flex-1 text-muted-foreground line-through">System Architecture Document
    </h5>
        </div>
         <div className="flex items-center gap-3 p-3 rounded-lg border transition-all bg-success/5 border-success/20 my-2">
    <div className="size-5 rounded flex items-center justify-center bg-success">
        <CircleCheck className='size-4 text-foreground'/>
    </div>
        <h5 className="text-sm flex-1 text-muted-foreground line-through">Database Schema Design
    </h5>
        </div>
         <div className="flex items-center gap-3 p-3 rounded-lg border transition-all bg-success/5 border-success/20 ">
    <div className="size-5 rounded flex items-center justify-center bg-success">
        <CircleCheck className='size-4 text-foreground'/>
    </div>
        <h5 className="text-sm flex-1 text-muted-foreground line-through">UI/UX Mockups
    </h5>
        </div>
    </div>
    </div>
  )
}
