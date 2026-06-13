import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CompleteProfileType } from '@/types/schema'
import { ArrowRight, Award, CircleCheck, GraduationCap } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import CardCompleteProfile from '../../../CardCompleteProfile/CardCompleteProfile'
type Role = "student" | "supervisor" |null;
export default function ChooseRoles({formObj,setSelectedRole,selectedRole}:{formObj:UseFormReturn<CompleteProfileType>;  setSelectedRole: (
  role:Role
) => void;
 selectedRole:Role}) {
  return (

<div className="grid md:grid-cols-2 gap-4 mb-6">




              <Card className={`${selectedRole=="student"?" border-primary bg-primary/5 shadow-lg":"hover:shadow-md hover:border-primary/50"} p-0  border-2 cursor-pointer transition-all   `} onClick={() => {
  setSelectedRole("student");
  formObj.setValue("role", "STUDENT");
}} >
    <CardContent className="p-6" >
<div className="mb-4  flex items-center justify-between">
  <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
<GraduationCap className='size-6 text-white'/>
</div>
{selectedRole=="student"&& <CircleCheck className="size-6 text-primary "/>}

</div>
<h4 className='font-semibold text-lg mb-2'>
    student
</h4>
<p className='text-sm text-muted-foreground mb-4'>Manage graduation projects, collaborate with teams, and track your academic progress.</p>
 <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <CircleCheck className="size-4 text-success" />
                          Project management
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CircleCheck className="size-4 text-success" />
                          Team collaboration
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CircleCheck className="size-4 text-success" />
                          Progress tracking
                        </li>
                         <li className="flex items-center gap-2 text-sm">
                          <CircleCheck className="size-4 text-success" />
                          AI-powered matching
                        </li>
                      </ul>
    </CardContent>
</Card>
            <Card className={`${selectedRole=="supervisor"?" border-primary bg-primary/5 shadow-lg":"hover:shadow-md hover:border-primary/50"} p-0  border-2 cursor-pointer transition-all   `}  onClick={() => {
  setSelectedRole("supervisor");
  formObj.setValue("role", "SUPERVISOR");
}}>
    <CardContent className="p-6" >
  <div className="mb-4  flex items-center justify-between">
  <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
<Award className='size-6 text-white'/>
</div>
{selectedRole=="supervisor"&& <CircleCheck className="size-6 text-primary "/>}
</div>
<h4 className='font-semibold text-lg mb-2'>
    supervisor
</h4>
<p className='text-sm text-muted-foreground mb-4'>Oversee student projects, provide guidance, and evaluate academic work.</p>

 <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <CircleCheck className="size-4 text-success" />
                          Project oversight
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CircleCheck className="size-4 text-success" />
                          student evaluation
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CircleCheck className="size-4 text-success" />
                          Feedback & grading
                        </li>
                         <li className="flex items-center gap-2 text-sm">
                          <CircleCheck className="size-4 text-success" />
                         Progress monitoring
                        </li>
                      </ul>
    </CardContent>
</Card>
</div>

  )
}
