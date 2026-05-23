import StudentDashboard from "@/app/_Components/Dashboard/StudentDashboard/StudentDashboard";
import { Metadata } from "next";
import ProjectCard from './../../../../_Components/ProjectCard/ProjectCard';
import { Calendar, CircleAlert, CircleCheck, Clock, FileText, MessageSquare, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import TasksDashboardStudent from "@/app/_Components/Dashboard/StudentDashboard/TasksDashboardStudent";
import SupervisorDashboard from "@/app/_Components/Dashboard/SupervisorDashboard/SupervisorDashboard";
 export const metadata: Metadata = {
   title: "Dashboard",
 };
export default async function DashboardUser() {
    const testRole = "student";
  // const { role } = await params;
  return (

 <div className="container mx-auto px-4 lg:px-8 py-8">
  
      {testRole=="student"&&<StudentDashboard/>}
      {/* {testRole=="supervisor"&&<SupervisorDashboard/>} */}
        {/* <div className="gap-8 grid lg:grid-cols-3 ">
        <div className="upcoming lg:col-span-2">
          <Card className="p-0 ">
            <CardHeader className=" px-6 pt-6  gap-1.5">
                <div className=" flex items-center justify-between">

                      <div className="flex flex-col">
                <h4 className="leading-none font-medium">Upcoming Tasks</h4>
                <p className="text-muted-foreground">
                  Your assigned tasks for this week
                </p>
              </div>
              <Button className="bg-transparent cursor-pointer hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9">View All</Button>
                </div>
            
            </CardHeader>
            <CardContent className="pb-6 px-6">
              {testRole=="student"&&<TasksDashboardStudent/>}
              {testRole=="student"&&<TasksDashboardStudent/>}
         <div className="space-y-4 ">
                 <div className="">
                <Card className=" p-0 gap-0 border-l-4 border-l-warning">

                  <CardContent className="p-4 pb-6 ">
<div className="flex items-start justify-between mb-3 p-0">       
     <h4 className=" flex-1 pr-2">
                      Complete Database Schema Design
                    </h4>
                    <Badge className="bg-destructive/10 text-destructive">
                      High
                    </Badge></div>
                    <p className="text-muted-foreground mb-3 text-sm">
                      Design and implement the database structure for user
                      management
                    </p>
                    <div className="flex items-start justify-between  p-0 text-sm text-foreground/70">
                      <div className="gap-4 flex items-center">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4"/>
                          <span>Feb 2</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="size-4" />
                          <span>2</span>
                        </div>
                      </div>
                      <Badge className="bg-muted flex size-6 items-center justify-center rounded-full text-xs text-foreground/70">
                        A
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
                  <div className="">
                <Card className=" p-0 gap-0 border-l-4 border-l-warning">

                  <CardContent className="p-4 pb-6 ">
<div className="flex items-start justify-between mb-3 p-0">       
     <h4 className=" flex-1 pr-2">
                      Complete Database Schema Design
                    </h4>
                    <Badge className="bg-destructive/10 text-destructive">
                      High
                    </Badge></div>
                    <p className="text-muted-foreground mb-3 text-sm">
                      Design and implement the database structure for user
                      management
                    </p>
                    <div className="flex items-start justify-between  p-0 text-sm text-foreground/70">
                      <div className="gap-4 flex items-center">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4"/>
                          <span>Feb 2</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="size-4" />
                          <span>2</span>
                        </div>
                      </div>
                      <Badge className="bg-muted flex size-6 items-center text-foreground/70 justify-center rounded-full text-xs">
                        A
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
                  <div className="">
                <Card className=" p-0 gap-0 border-l-4 border-l-warning">

                  <CardContent className="p-4 pb-6 ">
<div className="flex items-start justify-between mb-3 p-0">       
     <h4 className=" flex-1 pr-2">
                      Complete Database Schema Design
                    </h4>
                    <Badge className="bg-destructive/10 text-destructive">
                      High
                    </Badge></div>
                    <p className="text-muted-foreground mb-3 text-sm">
                      Design and implement the database structure for user
                      management
                    </p>
                    <div className="flex items-start justify-between  p-0 text-sm text-foreground/70">
                      <div className="gap-4 flex items-center">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4"/>
                          <span>Feb 2</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="size-4" />
                          <span>2</span>
                        </div>
                      </div>
                      <Badge className="bg-muted flex size-6 items-center text-foreground/70 justify-center rounded-full text-xs">
                        A
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
         
         </div>
            </CardContent>
          </Card>
        </div>
  
      </div> */}

   {/* {role=="student" && */}
   {/* <StudentDashboard/> */}
    {/* } */}
     {/* {role=="supervisor" &&
   <StudentDashboard/>
    } */}
 </div>
  );
}
