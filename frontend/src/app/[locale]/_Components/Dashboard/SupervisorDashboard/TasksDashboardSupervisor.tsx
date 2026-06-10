import React from 'react'
import { ArrowRight, Calendar, CircleAlert, CircleCheck, Clock, FileText, MessageSquare, TriangleAlert, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar';
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
export default function TasksDashboardSupervisor() {
  return (
                <Card className=" p-0 gap-0  border-2 hover:border-primary/50 transition-all">
  <CardContent className="p-6">
<div className="">
    <div className="flex items-start justify-between mb-4 p-0">     
    <div className="flex-1">
     <h4 className="mb-2">AI-Powered Study Assistant</h4>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Users className='size-4'/>
                    <span>4 members</span>
                    <span className="mx-2">•</span>
                    <Clock className='size-4'/>
                    <span>Updated 2 hours ago</span>
                    </div>
        </div>  
                    <Badge className="bg-success/10 text-success">
                      On Track
                    </Badge></div>

                        <AvatarGroup className="*:data-[slot=avatar]:ring-0 *:data-[slot=avatar]:ring-transparent mb-4">
       <Avatar className=' size-8 border-2 border-white shrink-0 flex  '>
        <AvatarFallback className='bg-muted flex size-full items-center justify-center  text-xs text-foreground'>A</AvatarFallback>
      </Avatar>
      <Avatar className=' size-8 border-2 border-white shrink-0 flex  '>
        <AvatarFallback className='bg-muted flex size-full items-center justify-center  text-xs text-foreground'>A</AvatarFallback>
      </Avatar>
       <Avatar className=' size-8 border-2 border-white shrink-0 flex  '>
        <AvatarFallback className='bg-muted flex size-full items-center justify-center  text-xs text-foreground'>A</AvatarFallback>
      </Avatar>
            <Avatar className=' size-8 border-2 border-white shrink-0 flex  '>
        <AvatarFallback className='bg-muted flex size-full items-center justify-center  text-xs text-foreground'>A</AvatarFallback>
      </Avatar>
    </AvatarGroup>
        <div className="progress mb-4">
          <Field className="w-full gap-0 mb-2">
            <FieldLabel
              htmlFor="progress-upload"
              className="mb-2"
            >
              <span
                className="text-sm font-normal"
              >
               Progress
              </span>
              <span className="ml-auto text-sm font-medium">75%</span>
            </FieldLabel>
            <Progress
              value={75}
              id="progress-upload"
              className="h-2 bg-primary/20 [&_[data-slot=progress-indicator]]:!bg-primary [&_[data-slot=progress-indicator]]:!bg-none"
            />
          </Field>
        </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-sm text-warning">
                          <TriangleAlert className="size-4"/>
                          <span>2 pending review</span>
                      </div>
                          <Button className="bg-transparent  hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ">
                            View Details
                            <ArrowRight className='size-4 ml-2'/>
                          </Button>
                 
                    </div>
</div>
                  </CardContent>
                </Card>
       
         
  )
}
