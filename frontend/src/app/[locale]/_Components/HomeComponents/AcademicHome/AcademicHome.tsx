import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from '@/i18n/navigation';
import { ArrowRight, CircleCheck, GraduationCap, UserCheck } from "lucide-react";
import React from "react";

export default function AcademicHome() {
  return (
    <div className="card-role grid md:grid-cols-2 gap-6">
      <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg border-primary/20 hover:border-primary/50 bg-primary/5 hover:shadow-primary/10 p-0">
        <CardContent className="p-6">
          <CardTitle className="flex size-14 rounded-xl bg-primary/10 text-primary items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <GraduationCap className="size-7"/>
         
          </CardTitle>
          <h3 className="mb-2">Student</h3>
          <p className=" text-sm text-muted-foreground mb-4">
            Access projects, teams, tasks, and collaboration tools
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm">
                        <CircleCheck className=" size-4 text-success mt-0.5"/>

            
              Create & join projects
            </div>
            <div className="flex items-start gap-2 text-sm">
                <CircleCheck className=" size-4 text-success mt-0.5"/>
             
              Team collaboration
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CircleCheck className=" size-4 text-success mt-0.5"/>
              Task management
            </div>
            <div className="flex items-start gap-2 text-sm">
               <CircleCheck className=" size-4 text-success mt-0.5"/>
              Profile & portfolio
            </div>
          </div>
<Link href="/login">           <Button className="w-full text-center">Get Started
        
            <ArrowRight className="ml-2 size-4"/>
        </Button></Link>
        </CardContent>
      </Card>
      <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg border-primary/20 hover:border-primary/50 bg-primary/5 hover:shadow-primary/10 p-0">
        <CardContent className="p-6">
          <CardTitle className="size-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
          <UserCheck className="size-7"/>
       
          </CardTitle>
          <h3 className="mb-2">Supervisor</h3>
          <p className=" text-sm text-muted-foreground mb-4">
            Monitor projects, provide feedback, and evaluate student work
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm">
              <CircleCheck className="size-4 text-success mt-0.5"/>
           
              Project oversight
            </div>
            <div className="flex items-start gap-2 text-sm">
            <CircleCheck className="size-4 text-success mt-0.5"/>
              Feedback & grading
            </div>
            <div className="flex items-start gap-2 text-sm">
             <CircleCheck className="size-4 text-success mt-0.5"/>
              Progress monitoring
            </div>
            <div className="flex items-start gap-2 text-sm">
           <CircleCheck className="size-4 text-success mt-0.5"/>
              Student guidance
            </div>
          </div>
   <Link href="/login">  
      <Button className="w-full text-center">Get Started
        <ArrowRight className="ml-2 size-4"/>
          
        </Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
